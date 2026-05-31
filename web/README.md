# Clinical Scholar Placements 2027 (web)

A simple website for MD Clinical Scholar students to browse placements and build a ranked preference list (1–10) for each term. No login required; preferences are saved in your browser.

## For students

1. Open the published link your cohort shares (after deploy).
2. Choose **Term 1**, **Term 2**, or **Term 3** at the top.
3. Use filters or search to find placements.
4. Click **Add** on up to 10 rows, then reorder with ↑ ↓.
5. Click **Copy list for Sonia** and paste into your email or notes when you are ready to submit.

**Important:** This tool does not submit preferences for you. Follow your program email for how to send your final list to Sonia.

## Deploy (one-time, for whoever hosts the link)

### Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Set **Root Directory** to `web`.
4. Build command: `npm run build` (default). Output: `dist`.
5. Deploy. Share the `*.vercel.app` URL with students.

### Netlify

- Root: `web`
- Build: `npm run build`
- Publish directory: `dist`

### GitHub Pages

`vite.config.ts` already uses `base: "./"` so the built site works from a subpath or static host. For project pages at `https://user.github.io/repo/` set `base: "/repo/"` in `vite.config.ts`, then build and upload `dist/` to `gh-pages`.

## Local preview

```bash
cd web
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173).

## Updating placement data

Replace JSON in `src/data/` from the parsed files in the repo root `data/` folder, then redeploy:

- `term1.json` ← `metro-term1-placements.json` (217 metro; rural GP excluded)
- `term2.json` ← `term2-regional-placements.json`
- `term3.json` ← `term3-regional-placements.json`
