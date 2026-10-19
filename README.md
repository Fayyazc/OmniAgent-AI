# OmniAgent OS — Autonomous AI Desktop Agent (web control center)

Vite + React + TypeScript frontend, deployed on Vercel. Serverless API routes in
`/api` proxy the Groq LLM so the API key never reaches the browser.

## Quick start (local)

```bash
npm install
npm run dev        # frontend only at http://localhost:3000
```

> Local `npm run dev` does not serve `/api` routes. For full local testing use
> `vercel dev`, or test against the deployed Vercel URL.

## Environment variables (required)

| Variable      | Where to set                                              | Purpose                        |
| ------------- | ----------------------------------------------------------- | ------------------------------ |
| GROQ_API_KEY  | Vercel → Project → Settings → Environment Variables         | Server-side Groq API key used by `/api/chat` |

See `.env.example`. **Never put API keys in `src/`** — anything bundled by Vite
is public. A previously hardcoded key was removed from `src/services/groqApi.ts`
on 2026-10-19; if it was ever deployed, **revoke it in the Groq console** and
generate a fresh one.

## Deploy

1. Push to GitHub (`main` branch).
2. In Vercel, import the repo (framework preset: Vite).
3. Add `GROQ_API_KEY` under Settings → Environment Variables (all environments).
4. Deploy. Verify:
   - `POST https://<your-app>.vercel.app/api/chat` with
     `{ "messages": [{ "role": "user", "content": "Hello" }] }` returns `{ "text": ... }`
   - `POST https://<your-app>.vercel.app/api/pc-command` returns the desktop-agent status object.

## API routes

- `POST /api/chat` — `{ messages, systemPrompt?, model? }` → `{ text, model }` or `{ error }`.
  Proxies `https://api.groq.com/openai/v1/chat/completions` (default model
  `llama-3.3-70b-versatile`).
- `POST /api/pc-command` — honest status stub for the desktop companion
  (`{ ok, connected: false, message }`). Implement pairing + command dispatch
  here when the desktop app exists.

## Project layout

- `src/` — React frontend (`src/services/groqApi.ts` calls `/api/chat`)
- `api/` — Vercel serverless functions (Node runtime, not type-checked by `tsc`)
- `electron/` — desktop shell (uses the same UI; API routes need a reachable backend URL there)

## Security notes

- The old client-side Groq key has been removed. Rotate any exposed keys.
- `/api/chat` has no auth — anyone with the URL can spend your Groq quota.
  Add your own auth (e.g. a shared secret header checked in `api/chat.ts`)
  before sharing the link publicly.
