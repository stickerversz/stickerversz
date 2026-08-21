# StickerVersz

**Premium Waterproof Stickers** — a single-page storefront built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies. Deployable to GitHub Pages in one step.

---

## ✨ Features

- **Dark mode by default** — saved to `localStorage`, with a toggle button
- **Live search overlay** — search by name, category, or serial ID (`Ctrl+K`)
- **Sticker grid** — copy-to-clipboard ID button on every card
- **Filter & sort** — by category, newest, A–Z, price
- **New Arrivals** section auto-populated from the data array
- **How to Order** timeline — 5-step process
- **Responsive** — desktop, tablet, and mobile
- **Intersection Observer** animations — fade-up, scale-in, stagger
- **SEO** — meta tags, Open Graph, structured headings
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, skip link

---

## 📁 Folder Structure

```
stickerversz/
├── index.html        # Homepage — hero, categories, new arrivals, all stickers, how to order
├── anime.html        # Anime category page
├── kpop.html         # K-pop category page
├── gaming.html       # Gaming category page
├── sports.html       # Sports category page
├── movies.html       # Movies category page
├── music.html        # Music category page
├── study.html        # Study category page
├── about.html        # About StickerVersz
├── contact.html      # Contact page
│
├── css/
│   └── style.css     # All styles — variables, layout, components, animations, responsive
│
├── js/
│   └── script.js     # All logic — sticker data, rendering, search, filters, dark mode
│
├── images/           # Place your sticker images here (see naming below)
└── README.md
```

---

## 🚀 Run Locally

No build step required. Just open the files:

```bash
# Option 1 — open directly in browser
open index.html

# Option 2 — use a local server (avoids CORS on file:// if you add fetch() later)
npx serve .
# or
python3 -m http.server 8000
```

---

## 🌐 Deploy to GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Click **Save** — your site will be live at `https://<username>.github.io/<repo-name>/`

> No build step, no CI needed. GitHub Pages serves static files directly.

---

## ➕ How to Add New Stickers

All sticker data lives in one array at the top of `js/script.js`.

### 1. Add the sticker object

```js
// In js/script.js → const STICKERS = [ ... ]
{ 
  id:         'AN-009',        // Unique serial number (prefix = category)
  name:       'Sukuna Ryomen', // Display name
  category:   'anime',         // Must match a key in CATEGORIES object
  price:      3,               // Price in MAD
  image:      null,            // null = emoji placeholder; 'images/an-009.webp' = real image
  waterproof: true,
  isNew:      true,            // Shows "NEW" badge if true
  emoji:      '👹',            // Shown when image is null
},
```

### 2. (Optional) Add an image

Save the image as `images/<id-lowercase>.webp` (e.g. `images/an-009.webp`), then set `image: 'images/an-009.webp'` in the sticker object.

Recommended image specs:
- **Size:** 400×400 px minimum
- **Format:** WebP (smaller file, better quality) or JPG/PNG
- **Aspect ratio:** 1:1 (square)

### 3. Done

The sticker automatically appears in:
- The correct category page
- The "All Stickers" section on the homepage
- The "New Arrivals" section (if `isNew: true`)
- Search results

---

## 🎨 Customisation

### Change brand colors

Edit the CSS variables in `css/style.css` → `:root` block:

```css
--accent:       #8B5CF6;   /* Purple — buttons, badges, highlights */
--accent-hover: #7C3AED;   /* Darker purple for hover states */
--accent-light: #A78BFA;   /* Lighter purple for text on dark bg */
```

### Change fonts

In each HTML `<head>`, update the Google Fonts URL, then in `css/style.css`:

```css
--font-heading: 'Poppins', sans-serif;
--font-body:    'Inter', sans-serif;
```

### Update Instagram handle

Replace all occurrences of `stickerversz` in the HTML files with your real Instagram handle.

### Future: Switch from static data to an API

When you're ready to scale:

1. Move the `STICKERS` array into a JSON file or database
2. Replace the `const STICKERS = [...]` line in `script.js` with:

```js
const STICKERS = await fetch('/api/stickers').then(r => r.json());
```

The rest of the rendering code works unchanged.

---

## 📋 Sticker ID Convention

| Prefix | Category |
|--------|----------|
| AN-    | Anime    |
| KP-    | K-pop    |
| GM-    | Gaming   |
| SP-    | Sports   |
| MV-    | Movies   |
| MU-    | Music    |
| ST-    | Study    |

Sequential within each category: `AN-001`, `AN-002`, …

---

## 🛠 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Markup     | HTML5 semantic elements |
| Styling    | CSS3 + Custom Properties|
| Logic      | Vanilla JS ES6+         |
| Fonts      | Google Fonts (Poppins, Inter) |
| Animations | CSS + Intersection Observer API |
| Hosting    | GitHub Pages            |

No frameworks, no build tools, no runtime dependencies.

---

## 📄 License

© 2025 StickerVersz. All rights reserved.
