// =====================================================
// HATCHBOUND — Cloud Accounts & Save Sync
// =====================================================
// Talks to Supabase over plain REST (no SDK). Entirely optional: when
// CLOUD_CONFIG is blank every method is a safe no-op and the game runs
// on local saves alone.

const Cloud = (() => {
  const cfg = typeof CLOUD_CONFIG !== 'undefined' ? CLOUD_CONFIG : { url: '', anonKey: '' };
  const enabled = !!(cfg.url && cfg.anonKey);
  const SESSION_KEY = 'hatchbound_session';

  let session = null;       // { access_token, refresh_token, expires_at, user }
  let pushTimer = null;
  let pending = null;
  let lastPushed = '';
  let pushedHook = null;    // told about every save the cloud accepts
  // No writes until sign-in reconciliation has decided whose save this is —
  // otherwise an autosave could push another player's device save into
  // this account in the gap.
  let ready = false;

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) session = JSON.parse(raw);
    } catch { session = null; }
  }
  function storeSession(s) {
    session = s;
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* storage blocked — session just won't persist */ }
  }

  async function api(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
    const h = { apikey: cfg.anonKey, 'Content-Type': 'application/json', ...headers };
    if (auth && session && session.access_token) h.Authorization = 'Bearer ' + session.access_token;
    const res = await fetch(cfg.url.replace(/\/$/, '') + path, {
      method, headers: h, body: body ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const msg = (data && (data.msg || data.message || data.error_description || data.error)) ||
                  ('Request failed (' + res.status + ')');
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  // Swap an expiring access token for a fresh one. Only a rejection from
  // the server ends the session; being offline throws instead, so callers
  // retry later rather than signing the player out (or mistaking "can't
  // reach the cloud" for "the account has no save").
  async function refreshIfNeeded() {
    if (!session || !session.refresh_token) return false;
    const soon = Date.now() + 60_000;
    if (session.expires_at && session.expires_at > soon) return true;
    let d;
    try {
      d = await api('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', auth: false, body: { refresh_token: session.refresh_token }
      });
    } catch (e) {
      if (e.status >= 400 && e.status < 500) {
        storeSession(null);   // refresh token rejected — force a fresh sign-in
        return false;
      }
      throw e;
    }
    storeSession({
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: Date.now() + (d.expires_in || 3600) * 1000,
      user: d.user || session.user
    });
    return true;
  }

  function sessionFrom(d) {
    return {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: Date.now() + (d.expires_in || 3600) * 1000,
      user: d.user
    };
  }

  loadSession();

  return {
    isEnabled: () => enabled,
    isSignedIn: () => enabled && !!(session && session.access_token),
    email: () => (session && session.user && session.user.email) || null,
    userId: () => (session && session.user && session.user.id) || null,
    isReady: () => ready,
    onPushed(fn) { pushedHook = fn; },
    setReady(v) { ready = !!v; },

    async signUp(email, password) {
      const d = await api('/auth/v1/signup', { method: 'POST', auth: false, body: { email, password } });
      // Projects with email confirmation on return no session until confirmed
      if (d.access_token) { storeSession(sessionFrom(d)); return { signedIn: true }; }
      return { signedIn: false, needsConfirmation: true };
    },

    async signIn(email, password) {
      const d = await api('/auth/v1/token?grant_type=password', {
        method: 'POST', auth: false, body: { email, password }
      });
      storeSession(sessionFrom(d));
      return { signedIn: true };
    },

    // Push anything outstanding, then drop the session. Resolves true if
    // the account is known to hold the latest progress.
    async signOut(latest) {
      if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
      pending = null;
      let synced = false;
      if (this.isSignedIn() && ready && latest) {
        try { synced = await this.push(latest); } catch { synced = false; }
      }
      storeSession(null);
      lastPushed = '';
      ready = false;
      return synced;
    },

    // Fetch this player's cloud save, or null if they have none yet
    async pull() {
      if (!this.isSignedIn()) return null;
      if (!(await refreshIfNeeded())) return null;
      const uid = session.user && session.user.id;
      if (!uid) return null;
      const rows = await api('/rest/v1/saves?select=data,updated_at&user_id=eq.' + encodeURIComponent(uid));
      return (Array.isArray(rows) && rows.length) ? rows[0].data : null;
    },

    // Write immediately (used on sign-in and when leaving the page)
    async push(data) {
      if (!this.isSignedIn()) return false;
      if (!(await refreshIfNeeded())) return false;
      const uid = session.user && session.user.id;
      if (!uid) return false;
      await api('/rest/v1/saves?on_conflict=user_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: [{ user_id: uid, data, updated_at: new Date().toISOString() }]
      });
      lastPushed = JSON.stringify(data);
      if (pushedHook) pushedHook(data);
      return true;
    },

    // Debounced write — the game saves on almost every action, so batch
    // those into at most one network call every few seconds.
    queuePush(data) {
      if (!this.isSignedIn() || !ready) return;
      pending = data;
      if (pushTimer) return;
      pushTimer = setTimeout(async () => {
        pushTimer = null;
        const payload = pending;
        pending = null;
        if (!payload) return;
        const json = JSON.stringify(payload);
        if (json === lastPushed) return;   // nothing actually changed
        try { await this.push(payload); }
        catch (e) { console.warn('cloud save failed', e.message); }
      }, 4000);
    },

    // Final save as the page closes or the app is backgrounded. fetch with
    // keepalive outlives the page and, unlike sendBeacon, can carry the
    // auth and upsert headers PostgREST needs (sendBeacon could send
    // neither, and Chrome refuses its JSON body anyway).
    flush(data) {
      if (!this.isSignedIn() || !ready || !session.access_token) return;
      const uid = session.user && session.user.id;
      if (!uid) return;
      const json = JSON.stringify(data);
      if (json === lastPushed) return;
      try {
        fetch(cfg.url.replace(/\/$/, '') + '/rest/v1/saves?on_conflict=user_id', {
          method: 'POST',
          keepalive: true,
          headers: {
            apikey: cfg.anonKey,
            Authorization: 'Bearer ' + session.access_token,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify([{ user_id: uid, data, updated_at: new Date().toISOString() }])
        }).then(r => {
          if (!r.ok) return;
          lastPushed = json;
          if (pushedHook) pushedHook(data);
        }).catch(() => {});
      } catch { /* nothing more we can do at unload */ }
    }
  };
})();
