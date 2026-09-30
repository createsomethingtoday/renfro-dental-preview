# Renfro Family Dental — independent website concept

A focused, responsive website concept by **CREATE SOMETHING** for [Renfro Family Dental](https://www.renfrodental.com/) in Burleson, Texas. It demonstrates a clearer patient journey across services, dentists, first-visit information, the wellness plan, and contact. It is **not** Renfro's official site and does not imply the practice commissioned or adopted it.

## Run locally

Requires Node.js 20+ and Python 3.

```sh
npm run build
npm run check
npm start
```

Open `http://localhost:4173/`. The build uses only Node's standard library; it does not require a dependency install or environment variables.

## What works

- 18 static routes with responsive desktop and mobile navigation.
- Five service-category overviews and three representative treatment pages. Other treatment details link to Renfro's official site.
- Dentist profiles, first-visit information, wellness-plan summary, and contact/location.
- The homepage covers the original site's core areas: introduction, dentists, services, patient reviews, insurance carriers and wellness benefits, questions/contact, and three dental education videos. Reviews are an attributed September 2026 snapshot; coverage should be confirmed with the practice.
- Review cards can be scrolled by touch, trackpad, or the arrow controls. Education videos open in a dialog and retain direct YouTube links when scripting is unavailable.
- Appointment actions open Renfro's existing Apex scheduling portal. Payment actions open Renfro's official payment page. This concept has no forms, patient data handling, or payment processing.
- A [coverage page](/coverage/) identifies what is inside this focused preview. All pages include an independent-concept disclosure and `noindex` metadata.

## Content and assets

Information was checked against the current public site on 2026-09-29. Prices and clinical availability are intentionally left to Renfro's current official pages. Source URLs for the reused logo and photos are listed in [ASSETS.md](ASSETS.md) and [asset-manifest.json](asset-manifest.json). Micah expressly confirmed permission to use those current-site assets for this public concept and repository. The MIT license below applies to original code only; it does not grant third parties rights to Renfro's marks, photos, or source content.

The public preview should not be substituted for Renfro's official website without the practice's own review, current content confirmation, and integration/launch work.

## Build and deploy

`npm run build` writes the complete static site to `dist/`. Any static host that serves directory `index.html` files can host it. This concept is deployed to a separate Cloudflare Pages project; no credentials or runtime secrets are needed.

## License

Original code: MIT, see [LICENSE](LICENSE). Renfro's source assets and trademarks retain their respective ownership and are documented separately.
