# Blanco Fine Jewelry

A personal jewelry design portfolio. Plain HTML, CSS, and JavaScript; no framework, build command, paid database, or server to maintain.

## Current content

The first portfolio version includes the authentic Instagram profile logo and ten photographs from [@blancofinejewelry](https://www.instagram.com/blancofinejewelry/), added at the owner's request. The photographs retain their original framing and brand marks. The homepage features the Malayan garnet ring, and the gallery opens each piece in an accessible detail view. This is a personal student portfolio, with no store or checkout.

Names are descriptive working titles except **Past, Present & Future Necklace**. Short descriptions and materials are based on the supplied post captions; unknown materials are left blank. The owner can revise all of this in the editor. [ASSET_SOURCES.md](ASSET_SOURCES.md) records the original posts and image dimensions.

The header displays the original 150 × 150 profile logo at no more than 64 pixels. The PWA still uses temporary typographic B icons; those can be replaced later with approved, appropriately sized artwork. No personal email, name, school, or invented biography has been added.

## Updating photographs and text

The prepared editor configuration is `.pages.yml`. The free hosted [Pages CMS editor](https://app.pagescms.org/) can be connected to this repository by its owner. It is a separate service from GitHub Pages; it edits content stored here.

1. Sign in to Pages CMS with the repository owner’s GitHub account and select this website repository.
2. Open **Website content**.
3. Edit the **Homepage** logo, heading, introduction and main photo, **About text**, or **Public contact details**. Add a short visual description for the main photo.
4. Under **Jewelry portfolio**, add a piece, its name, materials and description, and up to eight photos.
5. Turn on **Show on website** when ready. Set **Display order** if needed.
6. Save. GitHub Pages publishes the resulting commit; allow the deployment to complete before checking the live website.

The website reads `site.json`. Uploaded photographs belong in `images/`. Keep original camera files separately and upload optimized JPEG, PNG, WebP, or AVIF images; roughly 1600–2400 pixels on the longest side is normally sufficient. The editor itself is not assumed to compress photographs.

Both the main photo and gallery photos are shown in full, without cropping. A piece needs a name, at least one valid photo, and **Show on website** enabled to appear. If all pieces are hidden or removed, the homepage returns to “Portfolio in progress.” Leave a contact field blank to hide it. Publishing through the editor saves to this public repository, so use only information and images intended for the public website.

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
- `images/`: the original logo and portfolio photographs.
- `ASSET_SOURCES.md`: image provenance and content notes.
- `manifest.webmanifest`, `service-worker.js`, `offline.html`: PWA support.
- `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`: temporary typographic icons.

After the first deployment, check the gallery and a CMS save on desktop and mobile. The owner should review the working titles, captions, introductory copy, and photo selection before treating this first version as the finished portfolio.
