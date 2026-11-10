# Blanco Fine Jewelry

A personal jewelry design portfolio. Plain HTML, CSS, and JavaScript; no framework, build command, paid database, or server to maintain.

## Current content

The starter deliberately contains **no jewelry photographs, invented pieces, biography, or contact information**. It displays “Portfolio in progress” until at least one piece has a name, a photo, and **Show on website** enabled. Replace the introductory copy and temporary B app icon as the visual identity develops.

## Updating photographs and text

The prepared editor configuration is `.pages.yml`. The free hosted [Pages CMS editor](https://app.pagescms.org/) can be connected to this repository by its owner. It is a separate service from GitHub Pages; it edits content stored here.

1. Sign in to Pages CMS with the repository owner’s GitHub account and select this website repository.
2. Open **Website content**.
3. Edit the **Homepage**, **About text**, or **Public contact details**.
4. Under **Jewelry portfolio**, add a piece, its name, materials and description, and up to eight photos.
5. Turn on **Show on website** when ready. Set **Display order** if needed.
6. Save. GitHub Pages publishes the resulting commit; allow the deployment to complete before checking the live website.

The website reads `site.json`. Uploaded photographs belong in `images/`. Keep original camera files separately and upload optimized JPEG, PNG, WebP, or AVIF images; roughly 1600–2400 pixels on the longest side is normally sufficient. The editor itself is not assumed to compress photographs.

GitHub Pages hosting and the currently offered hosted Pages CMS editor require no monthly subscription for this public personal portfolio. Domain renewal at Namecheap is separate. See [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [Pages CMS](https://pagescms.org/) for current service terms.

## Publishing

The repository is intended to be `blancofinejewelry/blancofinejewelry.github.io`, published from **main / root**. Keep the custom-domain `CNAME` file created by GitHub settings. Do not store passwords, tokens, or private documents in this public repository. No open-source license is granted to the photographs by this starter.

## Mobile and offline behavior

`manifest.webmanifest` and `service-worker.js` provide the PWA foundation: a standalone display, home-screen icons, a cached page and previously viewed photographs. Installation controls vary by browser. Content is requested from the network first so new edits appear online; the cached copy is used when offline. External sites and the editor are not cached. The image cache is limited to 80 files.

If the application shell changes substantially, increment `CACHE_NAME` in `service-worker.js`. Website operation requires HTTPS, apart from local development. There is no cart or checkout.

## Files

- `index.html`, `styles.css`, `app.js`: layout and interactions.
- `site.json`: editable portfolio content.
- `.pages.yml`: editor form configuration.
- `manifest.webmanifest`, `service-worker.js`, `offline.html`: PWA support.
- `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`: temporary typographic icons.

The first real photograph upload and CMS save should be checked on both desktop and mobile before calling the finished portfolio complete.
