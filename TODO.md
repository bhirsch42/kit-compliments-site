# kit-compliments-site TODO

## Core Site

- [x] Create repo
- [x] Add `compliments.json` populated from the Notion export (17 compliments)
- [x] Build `index.html` — single-page shell matching the benbo KitPage layout
- [x] Build `style.css` — ported from benbo's `kit.css`
- [x] Build `app.js` — pure client-side logic:
  - Load compliments from `compliments.json`
  - Use `localStorage` to track which compliments have been seen and the current day's pick
  - On new day: pick next unseen compliment in order; when all seen, reset and cycle
  - Display compliment, date, divider SVG, flower SVG, and confetti animation

## Deployment: GitHub Pages

- [ ] Create GitHub repo `kit-compliments-site` (public, so GitHub Pages is free)
- [ ] Push `main` branch; enable GitHub Pages from Settings → Pages → deploy from `main` / root
- [x] Add `CNAME` file containing `kitsworstnightmare.com` (required by GitHub Pages for custom domain)
- [x] Write `deploy.sh` — a one-command local deploy script (just `git push origin main`)
- [ ] Verify site is live at `https://<username>.github.io/kit-compliments-site`

## DNS / Custom Domain

- [ ] In GitHub repo Settings → Pages, set custom domain to `kitsworstnightmare.com`
- [ ] In DNS provider (wherever `kitsworstnightmare.com` is registered), add:
  - 4× `A` records pointing to GitHub Pages IPs:
    ```
    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153
    ```
  - 1× `CNAME` record: `www` → `<github-username>.github.io`
- [ ] Wait for DNS propagation; verify `https://kitsworstnightmare.com` loads the site
- [ ] Enable "Enforce HTTPS" in GitHub Pages settings once cert is provisioned
