# Cloud Accounts Setup (optional, free, ~5 minutes)

Right now the game saves to each player's own device. That's genuinely enough
for friends to test — everyone gets their own beast and can come back to it.

Turn this on when you want **real accounts**: players sign up with an email and
password, and their beast follows them to any phone or computer. It also means
a player can't lose progress by clearing their browser or switching phones.

Free tier covers 50,000 monthly users. No credit card required.

---

## Step 1 — Create a Supabase project

1. Go to **[supabase.com](https://supabase.com)** and sign up (GitHub login works)
2. Click **New Project**
3. Name it anything (e.g. `hatchbound`), set a database password, pick the
   region closest to your players, and create it
4. Wait ~2 minutes while it provisions

## Step 2 — Create the saves table

In your project, open **SQL Editor** in the left sidebar, click **New query**,
paste this in, and hit **Run**:

```sql
-- One save row per player
create table if not exists public.saves (
  user_id    uuid primary key references auth.users on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security: this is what keeps players out of each other's saves
alter table public.saves enable row level security;

drop policy if exists "players manage their own save" on public.saves;
create policy "players manage their own save"
  on public.saves
  for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

You should see **Success. No rows returned**.

> The policy is the important part. Without it, any player could read every
> other player's save. With it, the database itself enforces that each row is
> readable and writable only by the account that owns it.

## Step 3 — Decide about email confirmation

By default Supabase emails a confirmation link before a new account can log in.

- **For testing with friends, turn it off** so they can play immediately:
  **Authentication → Sign In / Providers → Email**, switch off
  **Confirm email**, and save.
- Leave it on for a real launch — it stops people signing up with addresses
  they don't own. The game handles both: if confirmation is required, it tells
  the player to check their email.

## Step 4 — Copy your keys into the game

In Supabase go to **Project Settings → API** and copy two values.

Open **`js/cloud-config.js`** in the repo and paste them in:

```js
const CLOUD_CONFIG = {
  url: 'https://YOUR-PROJECT-ID.supabase.co',   // "Project URL"
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'    // the "anon" / "public" key
};
```

Commit and push. Login appears in the game automatically.

> **Is it safe to put the anon key in public code?** Yes — that's what it's
> designed for, and it's why it's called the *public* key. It only grants what
> your Row Level Security policies allow, which is why Step 2 matters.
>
> **Never** paste the `service_role` key here. That one bypasses all security
> and must stay on a server.

## Step 5 — Test it

1. Open the game, tap **☁️ Log In / Sign Up** on the title screen
2. Create an account and play for a minute
3. Open the game in a different browser (or a private window), log in with the
   same account — your beast should be there

---

## How syncing behaves

- **Signing in** keeps whichever save has progress the other hasn't seen. If
  you played on another phone since this device last synced, your account's
  save wins, even if this device's clock says it saved more recently. If this
  device is ahead (say you played offline), it uploads.
- **Shared devices are safe.** Every save remembers which account it belongs
  to. If a device holds someone else's beast, signing in loads your own cloud
  save and parks theirs untouched; it comes back when they sign in here
  again. If the device has a beast that was never linked to an account and
  you already have one in the cloud, the game asks which to keep.
- **Nothing is thrown away.** Whatever loses a sign-in decision is set aside
  on the device in a slot that normal saving never overwrites.
- **Signing out** saves your latest progress to the cloud first, then clears
  the beast from the device so the next person starts fresh. If the cloud
  can't be reached, the device keeps its save so nothing is lost.
- **While playing**, progress pushes to the cloud a few seconds after it
  changes (batched, so it isn't a request per tap).
- **Closing the app** fires a final save that is allowed to finish after the
  page closes.
- **Offline or cloud unreachable**, the game keeps working on the local save
  and syncs next time.
- **Signed out**, everything works exactly as it does today, on-device.

## If something goes wrong

| Symptom | Cause |
|---------|-------|
| Login button never appears | `url` or `anonKey` still blank in `js/cloud-config.js` |
| "Wrong email or password" on a brand-new account | Email confirmation is on and they haven't clicked the link |
| Login works, save doesn't persist | The Step 2 SQL didn't run — check the `saves` table exists |
| Console shows 401 / "JWT expired" | Normal; the game refreshes the token automatically |
