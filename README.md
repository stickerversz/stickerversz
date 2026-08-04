# StickerVersz

Premium waterproof sticker brand website — dark, minimal, and fast. Built with
plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, ready for
GitHub Pages.

## Features

- Sticky navigation with dark/light mode (dark by default, saved to `localStorage`)
- Animated search overlay — live search by name, category, or serial number
- Filterable, sortable sticker grid (category, price, newest, alphabetical) with no page reload
- "Copy ID" button on every card copies the serial number to the clipboard
- New Arrivals section, ordering timeline, About and Contact pages
- Scroll-reveal animations via Intersection Observer (respects `prefers-reduced-motion`)
- Lazy-loaded images, semantic HTML, ARIA labels, keyboard-friendly
- SEO meta tags + Open Graph on every page

## Folder structure

```
stickerversz/
├── index.html          Home: hero, categories, new arrivals, full catalogue, how to order
├── anime.html          Category pages (all share one layout, filtered by category)
├── kpop.html
├── gaming.html
├── sports.html
├── movies.html
├── music.html
├── study.html
├── about.html          Brand story + ordering timeline
├── contact.html        Instagram, email, location
├── css/
│   └── style.css       All styling and design tokens
├── js/
│   └── script.js       Sticker data + all interactivity
├── images/             Put your real sticker photos here
└── README.md
```

## Run locally

No build tools needed. Either:

1. Double-click `index.html`, or
2. Serve the folder (recommended, avoids any browser quirks):

```bash
cd stickerversz
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `stickerversz`).
2. Push this folder to it:

```bash
cd stickerversz
git init
git add .
git commit -m "Launch StickerVersz"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/stickerversz.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. Your site goes live at `https://YOUR-USERNAME.github.io/stickerversz/`.

## Add new stickers

All sticker data lives in one array at the top of `js/script.js`. Append an
object and every page (grids, search, filters, counts, new arrivals) updates
automatically:

```js
{
  id: "AN-007",            // unique serial number: PREFIX-NUMBER
  name: "New Character",   // display name
  category: "anime",       // anime | kpop | gaming | sports | movies | music | study
  price: 3,                // in MAD
  image: "images/an-007.jpg", // path to your photo, or "" for an auto placeholder
  waterproof: true,        // shows the Waterproof badge
  isNew: true              // shows in New Arrivals with a NEW badge
}
```

Serial prefixes used: `AN` anime, `KP` k-pop, `GM` gaming, `SP` sports,
`MV` movies, `MU` music, `ST` study.

**Adding photos:** drop square images into `images/` and set each sticker's
`image` field to the path. Leave it as `""` to keep the generated placeholder.

**Later, with hundreds of stickers:** replace the hardcoded array with a fetch
from a JSON file or an API — everything else keeps working because all
rendering reads from the same `STICKERS` array.

## Update your links

Search for `instagram.com/stickerversz` and `hello@stickerversz.com` across the
HTML files and `js/script.js`, and replace them with your real handles.

---

© StickerVersz — made in Morocco 🇲🇦
