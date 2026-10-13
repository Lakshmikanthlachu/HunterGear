# Ridgeline Outfitters — Hunting Gear & Outdoor Sports Store (HTML template)

A rugged, field-guide-inspired static template for a hunting and outdoor sports store.
Pure HTML, Tailwind CSS (compiled) and vanilla JavaScript. No framework, no build step needed to use it.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero with season board, seasonal gear, categories, featured products, safety callout, testimonials, newsletter |
| `pages/products.html` | Products by category: filter chips, search, price filter, sort, 18 sample products |
| `pages/safety-regulations.html` | Licensing steps, safe handling, season-dates table, gear care, free guides, FAQ |
| `pages/contact.html` | Enquiry form (date/time pickers), store details, opening hours, map placeholder |
| `404.html` | Not-found page with search and quick links |
| `coming-soon.html` | Coming soon / maintenance page with countdown and email capture |

No dashboard and no login/register pages (by design).

## Quick start

1. Open `index.html` in a browser (or upload the folder to any static host).
2. Edit text directly in the HTML files.
3. To change Tailwind classes or the design tokens, rebuild the CSS:

```bash
npm install
npm run build:css     # one-off, minified
npm run watch:css     # rebuild on change
```

## Structure

```
index.html, 404.html, coming-soon.html
pages/                 products, safety-regulations, contact
assets/css/style.css   compiled Tailwind (commit this; it is what the pages load)
assets/js/main.js      theme + RTL toggles, menu, product filter, form validation, countdown
assets/fonts/          self-hosted WOFF2 (Big Shoulders Display, Literata, Cairo, Heebo)
assets/img/            hero scenes, product illustrations, logo, favicons, OG image
src/input.css          design system: tokens, base styles, components
tailwind.config.js     colours, fonts, content paths
tools/                 optional generators (see below); not needed to use the template
```

## Customising

- **Colours:** palette lives in `tailwind.config.js` (`pine`, `lichen`, `blaze`, `kraft`). Light and dark
  values for page, surface, ink, muted, line and accent are CSS variables at the top of `src/input.css`.
- **Fonts:** change the `@font-face` rules in `src/input.css` and the `fontFamily` entries in `tailwind.config.js`.
- **Logo:** a scope-reticle + ridge mark. Header/footer use an inline SVG (see `logo()` in `tools/build.js`); files `assets/img/logo-mark.svg`, `logo-mark-light.svg` and `favicon.svg` are the standalone versions.
- **Products:** each card is a self-contained `<article data-product ...>`. The filter uses its
  `data-cat`, `data-price`, `data-name`, `data-rank` and `data-keywords` attributes.
- **Photos:** every hero, season tile and product image is an Unsplash photo loaded from `images.unsplash.com`
  (free for commercial use, no attribution required; credits below). The photo list is the `PH` table near the top of
  `tools/build.js` (key -> Unsplash photo id). To use your own photos, either edit `PH` and run `node tools/build.js`,
  or search the HTML for `images.unsplash.com` and replace those `src` URLs with your own files. For production,
  download the photos into `assets/img/` so the site does not depend on a third party being online.
  Recommended sizes: heroes 2400x900 (home and coming-soon 2400x1350), season tiles 1200x900, products 800x600.
  The old generated artwork in `assets/img/heroes`, `seasons`, `products` is no longer referenced and can be deleted.
- **Brand marquee:** `.marquee` in `src/input.css` (left-to-right, pauses on hover, static for reduced-motion). Edit brands in `tools/data.js`.
- **Dark mode / RTL:** both toggles are in the header. Choices are saved in `localStorage` and applied before
  first paint. The layout uses logical utilities (`ms-`, `pe-`, `text-start`, `start-0`) so it mirrors correctly.
- **SEO:** each page has a title, description, canonical URL, Open Graph tags and JSON-LD (store, breadcrumbs,
  product list, FAQ). Replace `https://www.example.com` everywhere (search the project) and in `sitemap.xml`.

## Forms

Forms validate in the browser and show a success message, but do not send anywhere. Connect one:

- Set the form's `action` and replace the demo block in `assets/js/main.js` (marked `DEMO`) with a `fetch()` call, or
- point `action` at a service such as Formspree, Netlify Forms or your own PHP/Node endpoint.

## Notes

- **Sample content:** season dates, prices, brands, address, phone and testimonials are placeholders.
  The safety page is general guidance, not legal advice. Replace dates with your region's official data.
- **404 page:** when your server serves `404.html` for deep URLs, add `<base href="/">` inside its `<head>`.
- **Coming soon:** change the launch date in `data-countdown="2027-03-01T09:00:00"`.
- **Optional tools:** `tools/build.js` regenerates all pages from shared partials (`node tools/build.js`),
  `tools/gen-art.js` the logo/product SVGs, `tools/gen-scenes.js` + `tools/render_scenes.py` the hero JPGs, `tools/raster.py` the favicons/OG image, `tools/qa.py` and
  `tools/axe.py` run the browser checks. If you edit the HTML by hand, do not run `build.js` (it overwrites it).

## Credits

Fonts: Big Shoulders Display, Literata, Cairo, Heebo (SIL Open Font License 1.1). Photos: Unsplash contributors (Sergei A, Inggrid Koe, Artem Sapegin, Sebastian Pociecha, Shai Pal, Tapio Haaja, Norbert Braun, Aaron Burden, Dave Hoefler, David Jusko, Ran Berkovich, Clay Banks, Michael Kyule, Woody Kelly, Ali Kazal, Brandon Williams, Nicole Almendrada, HEAD Accessories, Marija Zaric, mandylin, Igor bispo, Olga Budko, Josiah Weiss, Gavin Allanwood, Tony Litvyak, Vladimir Fedotov, Old Youth, Karl Köhler) under the Unsplash licence. Logo and map artwork are original.

## v3 additions
- Real map: OpenStreetMap embed on the contact page; set `site.map = {lat, lng}` in `tools/data.js`.
- Custom dropdowns (`select[data-select]`) and product combobox, phone digits-only filter, scroll-reveal, stacked category layers, animated Safety page photos. All motion respects `prefers-reduced-motion`.
