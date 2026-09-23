# Netlify preview result

No `*.netlify.app` URL was created. Netlify is not authenticated in this environment, so the preview needs one signed-in import. Nothing was merged to `main`. No custom domain was added. This is not a production web launch.

## Blocker

- `npx netlify status` reports `Not logged in`.
- `NETLIFY_AUTH_TOKEN` is not set.
- The repo has no `.netlify` site link.
- `https://survivalcraft-pro.netlify.app` and nearby name guesses return HTTP 404.
- `netlify login` needs a browser approval. That click was not faked.

## What is ready for import

A static web export is feasible without a new product. `npm run build:web` runs `expo export --platform web` and writes `dist/`.

Checked locally on Node 20: the export serves HTTP 200, and the shell renders Command Center plus Skills, Intel, Profile, Offline, and Scan. With no camera, Scan stays on the existing "Camera Required" screen and does not crash. Haptics are skipped on web so button presses do not throw. Camera, purchases, and the iOS build are unchanged in intent. Do not treat the web shell as production-ready.

`netlify.toml` on this branch sets:

- Build command: `npm run build:web`
- Publish directory: `dist`
- Node: 20

## What Mike should click

1. Open [https://app.netlify.com/start](https://app.netlify.com/start) while signed into the Netlify team that should own the site.
2. Under **Import an existing project**, click **GitHub**.
3. If GitHub asks, install or authorize the Netlify GitHub app for the **llconsulting** organization and grant **survivalcraft-pro**.
4. Select repository **llconsulting/survivalcraft-pro**.
5. On the deploy settings screen, leave the plan on the free site (do not spend) and do not add a custom domain:
   - Branch to deploy: `main`
   - Base directory: empty
   - Build command: `npm run build:web`
   - Publish directory: `dist`
6. Click **Deploy survivalcraft-pro** (Netlify labels this button **Deploy** plus the repo name).

The first production build of `main` can fail until this pull request is merged, because `main` does not yet have the web script or `netlify.toml`. That failure is expected.

After the site exists:

7. Open **Site configuration → Build & deploy → Continuous deployment → Deploy contexts** and keep **Deploy Previews** enabled (on by default for a new site).
8. Open the pull request below. Netlify should comment with a preview URL shaped like `https://deploy-preview-<PR-number>-<site-name>.netlify.app`. That preview is the URL that should return HTTP 200.

Pull request branch: `cursor/netlify-web-preview-858b`.

To make the site's own `https://<site-name>.netlify.app` address serve this branch before merge, set **Branch to deploy** in step 5 to `cursor/netlify-web-preview-858b` instead of `main`. That is still only a Netlify subdomain preview.
