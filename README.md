# Scheduler — Changes and Integration Notes

This repository was updated to remove Supabase references and integrate Firebase + a local Gemini AI client for content generation. Below is a summary of what changed, how to run the project, and brief notes on key files.

## Summary of changes
- Removed Supabase environment variables and replaced with Firebase env vars in `.env`.
- Added `js/firebase.js` initializer (uses `FIREBASE_*` env vars; exports `app`, `auth`, `db`, `analytics`).
- Added `firebase` to `package.json` dependencies (run `npm install` to install).
- Added `js/gemini.js` integration (client-side helper) — note: API key was present in earlier commits; ensure keys are stored server-side for production.
- Replaced sidebar UI with a consistent top navigation bar across pages (`dashboard.html`, `content-creator.html`, `analytics.html`).
- Integrated content generation UI in `content-creator.html` to call `geminiAI` methods.

## New / Updated files
- `.env` — now contains `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID`.
- `js/firebase.js` — Firebase initializer (exports `app`, `auth`, `db`, `analytics`).
- `js/gemini.js` — Gemini AI client wrapper (content generation, hashtag suggestion, sentiment, etc.).
- `dashboard.html` & `dashboard.css` — layout updated to remove sidebar and use top nav; `.main-content` now spans full width.
- `content-creator.html` — updated to use top nav; integrated UI for caption, hashtag, and ideas generation.
- `analytics.html` — new minimal analytics page linked from the top nav.
- `README.md` — this file.

## Security notes
- Do NOT keep API keys in client-side files. Move any AI or Firebase admin keys to your backend or serverless functions. Rotate keys if they were exposed.

## How to run locally
1. Install dependencies:

```bash
npm install
```

2. Add your Firebase config to `.env` (or keep existing values if provided).

3. Start the dev server (this project uses Vite):

```bash
npm run dev
```

4. Open `http://localhost:5173` (or the address Vite prints) and navigate the app.

## Next recommended work (optional)
- Move Gemini API calls to a server-side proxy to avoid exposing API keys.
- Convert `js/gemini.js` to ESM exports and add defensive parsing and retry/backoff logic.
- Implement full analytics dashboards that read from Firestore.
- Add unit tests for parsing helper functions and UI interactions.

If you'd like, I can implement the serverless proxy and convert Gemini calls to use it next.

## Running the Gemini proxy (optional but recommended for AI features)

1. Change to the server folder:

```bash
cd server
```

2. Install proxy dependencies and start the proxy:

```bash
npm install
npm start
```

The proxy will run on port 3000 by default and exposes endpoints at `http://localhost:3000/api/gemini/*`. The front-end `js/gemini.js` is already configured to call `/api/gemini/*` so if you run the proxy alongside the Vite dev server you should be able to use AI features locally. If you have a real provider, set `GEMINI_API_URL` and `GEMINI_API_KEY` in `server/.env`.
