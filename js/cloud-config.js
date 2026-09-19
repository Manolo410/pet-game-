// =====================================================
// HATCHBOUND — Cloud Save Configuration
// =====================================================
// LEAVE THIS EMPTY and the game works exactly as it does now: saves live
// in the browser on each player's own device. That is enough for friends
// to test — each person gets their own character and can come back to it.
//
// FILL THIS IN to add real accounts: players sign up with an email and
// password, and their character follows them to any device or browser.
//
// Setup takes about 5 minutes and is free (no credit card):
//   1. Go to supabase.com and create an account, then a new project.
//   2. In the project, open the SQL Editor and run the snippet in
//      docs/CLOUD-SETUP.md (it creates the saves table).
//   3. Go to Project Settings -> API and copy two values:
//        - "Project URL"           -> paste as url below
//        - "anon" / "public" key   -> paste as anonKey below
//   4. Commit and push. Login appears automatically.
//
// The anon key is designed to be public — it is safe in this file. Row
// Level Security (set up by the SQL snippet) is what actually protects
// each player's data, so every player can only ever read or write their
// own save. Never paste the "service_role" key here.

const CLOUD_CONFIG = {
  url: '',      // e.g. 'https://abcdefghijk.supabase.co'
  anonKey: ''   // e.g. 'eyJhbGciOiJIUzI1NiIs...'
};
