/**
 * StickerVersz — Main JavaScript
 * Version: 1.0.0
 *
 * Responsibilities:
 *  - Sticker data store (swap for a fetch() call when backend is ready)
 *  - Dark/light mode with localStorage
 *  - Mobile menu
 *  - Search overlay with live filtering
 *  - Sticker card rendering & category page hydration
 *  - Filter bar (category, price, sort)
 *  - Copy-to-clipboard for sticker IDs
 *  - Scroll-driven navbar style
 *  - Intersection Observer entrance animations
 */

'use strict';

/* ─────────────────────────────────────────────────
   1. Sticker Data
   Replace `image` with a real path (e.g. "images/an-001.webp")
   to show an actual photo. Leave null for the CSS gradient placeholder.
───────────────────────────────────────────────── */
const STICKERS = [
  // ── Anime ──────────────────────────────────────
  { id: 'AN-001', name: 'Gojo Satoru',       category: 'anime',   price: 3, image: null, waterproof: true, isNew: true,  emoji: '🥷' },
  { id: 'AN-002', name: 'Naruto Uzumaki',    category: 'anime',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🍥' },
  { id: 'AN-003', name: 'Levi Ackerman',     category: 'anime',   price: 3, image: null, waterproof: true, isNew: false, emoji: '⚔️' },
  { id: 'AN-004', name: 'Itachi Uchiha',     category: 'anime',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🔴' },
  { id: 'AN-005', name: 'Monkey D. Luffy',   category: 'anime',   price: 3, image: null, waterproof: true, isNew: true,  emoji: '🏴‍☠️' },
  { id: 'AN-006', name: 'Nezuko Kamado',     category: 'anime',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🌸' },
  { id: 'AN-007', name: 'Killua Zoldyck',   category: 'anime',   price: 3, image: null, waterproof: true, isNew: false, emoji: '⚡' },
  { id: 'AN-008', name: 'Totoro',            category: 'anime',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🌿' },

  // ── K-pop ──────────────────────────────────────
  { id: 'KP-001', name: 'BTS Army',          category: 'kpop',    price: 3, image: null, waterproof: true, isNew: false, emoji: '💜' },
  { id: 'KP-002', name: 'BLACKPINK',         category: 'kpop',    price: 3, image: null, waterproof: true, isNew: true,  emoji: '🖤' },
  { id: 'KP-003', name: 'Stray Kids',        category: 'kpop',    price: 3, image: null, waterproof: true, isNew: true,  emoji: '🐺' },
  { id: 'KP-004', name: 'TWICE',             category: 'kpop',    price: 3, image: null, waterproof: true, isNew: false, emoji: '🌈' },
  { id: 'KP-005', name: 'EXO Planet',        category: 'kpop',    price: 3, image: null, waterproof: true, isNew: false, emoji: '🪐' },
  { id: 'KP-006', name: 'NewJeans',          category: 'kpop',    price: 3, image: null, waterproof: true, isNew: true,  emoji: '👖' },

  // ── Gaming ─────────────────────────────────────
  { id: 'GM-001', name: 'Among Us Crewmate', category: 'gaming',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🚀' },
  { id: 'GM-002', name: 'Minecraft Creeper', category: 'gaming',  price: 3, image: null, waterproof: true, isNew: false, emoji: '💚' },
  { id: 'GM-003', name: 'Valorant Agent',    category: 'gaming',  price: 3, image: null, waterproof: true, isNew: true,  emoji: '🎯' },
  { id: 'GM-004', name: 'GTA V',             category: 'gaming',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🚗' },
  { id: 'GM-005', name: 'Controller Iconic', category: 'gaming',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🎮' },
  { id: 'GM-006', name: 'Fortnite Victory',  category: 'gaming',  price: 3, image: null, waterproof: true, isNew: true,  emoji: '🏆' },

  // ── Sports ─────────────────────────────────────
  { id: 'SP-001', name: 'Real Madrid CF',    category: 'sports',  price: 3, image: null, waterproof: true, isNew: false, emoji: '⚽' },
  { id: 'SP-002', name: 'FC Barcelona',      category: 'sports',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🔵' },
  { id: 'SP-003', name: 'Kylian Mbappé',     category: 'sports',  price: 3, image: null, waterproof: true, isNew: true,  emoji: '⚡' },
  { id: 'SP-004', name: 'CR7 Signature',     category: 'sports',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🐐' },
  { id: 'SP-005', name: 'NBA Lakers',        category: 'sports',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🏀' },
  { id: 'SP-006', name: 'Wimbledon Serve',   category: 'sports',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🎾' },

  // ── Movies ─────────────────────────────────────
  { id: 'MV-001', name: 'The Dark Knight',   category: 'movies',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🦇' },
  { id: 'MV-002', name: 'Avengers Assemble', category: 'movies',  price: 3, image: null, waterproof: true, isNew: true,  emoji: '🛡️' },
  { id: 'MV-003', name: 'Star Wars Force',   category: 'movies',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🌟' },
  { id: 'MV-004', name: 'Joker Smile',       category: 'movies',  price: 3, image: null, waterproof: true, isNew: false, emoji: '🃏' },
  { id: 'MV-005', name: 'Spider-Man Web',    category: 'movies',  price: 3, image: null, waterproof: true, isNew: true,  emoji: '🕷️' },
  { id: 'MV-006', name: 'Harry Potter',      category: 'movies',  price: 3, image: null, waterproof: true, isNew: false, emoji: '⚡' },

  // ── Music ──────────────────────────────────────
  { id: 'MU-001', name: 'Billie Eilish',     category: 'music',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🖤' },
  { id: 'MU-002', name: 'Travis Scott',      category: 'music',   price: 3, image: null, waterproof: true, isNew: true,  emoji: '🌵' },
  { id: 'MU-003', name: 'The Weeknd XO',     category: 'music',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🌃' },
  { id: 'MU-004', name: 'Drake OVO',         category: 'music',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🦉' },
  { id: 'MU-005', name: 'Arctic Monkeys',    category: 'music',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🎸' },
  { id: 'MU-006', name: 'Doja Cat',          category: 'music',   price: 3, image: null, waterproof: true, isNew: true,  emoji: '🐱' },

  // ── Study ──────────────────────────────────────
  { id: 'ST-001', name: 'Coffee & Code',     category: 'study',   price: 3, image: null, waterproof: true, isNew: true,  emoji: '☕' },
  { id: 'ST-002', name: 'Study Mode On',     category: 'study',   price: 3, image: null, waterproof: true, isNew: false, emoji: '📚' },
  { id: 'ST-003', name: 'Brain Power',       category: 'study',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🧠' },
  { id: 'ST-004', name: 'Bookworm',          category: 'study',   price: 3, image: null, waterproof: true, isNew: false, emoji: '📖' },
  { id: 'ST-005', name: 'WiFi & Grades',     category: 'study',   price: 3, image: null, waterproof: true, isNew: true,  emoji: '📶' },
  { id: 'ST-006', name: 'Aesthetic Notes',   category: 'study',   price: 3, image: null, waterproof: true, isNew: false, emoji: '🖊️' },
];

/* ─────────────────────────────────────────────────
   2. Category Metadata
───────────────────────────────────────────────── */
const CATEGORIES = {
  anime:   { label: 'Anime',   icon: '🍥', page: 'anime.html',   desc: 'Your favourite characters, beautifully crafted.' },
  kpop:    { label: 'K-pop',   icon: '💜', page: 'kpop.html',    desc: 'Stan culture meets premium sticker art.' },
  gaming:  { label: 'Gaming',  icon: '🎮', page: 'gaming.html',  desc: 'Level up your setup with iconic gaming stickers.' },
  sports:  { label: 'Sports',  icon: '⚽', page: 'sports.html',  desc: 'Rep your team wherever you go.' },
  movies:  { label: 'Movies',  icon: '🎬', page: 'movies.html',  desc: 'Cinematic icons for every surface.' },
  music:   { label: 'Music',   icon: '🎵', page: 'music.html',   desc: 'Show the world what's in your playlist.' },
  study:   { label: 'Study',   icon: '📚', page: 'study.html',   desc: 'Aesthetic stickers for your workspace.' },
};

/* ─────────────────────────────────────────────────
   3. State
───────────────────────────────────────────────── */
const state = {
  theme:          'dark',
  menuOpen:       false,
  searchOpen:     false,
  activeFilter:   'all',
  activeSort:     'default',
  searchQuery:    '',
  currentPage:    null,
};

/* ─────────────────────────────────────────────────
   4. Theme
───────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('sv-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  state.theme = saved || preferred || 'dark';
  applyTheme(state.theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
  localStorage.setItem('sv-theme', theme);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  const icon = document.querySelector('.theme-toggle .t-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

/* ─────────────────────────────────────────────────
   5. Navbar scroll behaviour
───────────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────────────────
   6. Mobile Menu
───────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    state.menuOpen = !state.menuOpen;
    hamburger.classList.toggle('open', state.menuOpen);
    mobileMenu.classList.toggle('open', state.menuOpen);
    hamburger.setAttribute('aria-expanded', state.menuOpen);
    document.body.style.overflow = state.menuOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      state.menuOpen = false;
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─────────────────────────────────────────────────
   7. Search Overlay
───────────────────────────────────────────────── */
function initSearch() {
  const overlay   = document.querySelector('.search-overlay');
  const input     = document.querySelector('.search-input');
  const closeBtn  = document.querySelector('.search-close');
  const toggleBtn = document.querySelector('.search-toggle');
  const resultsEl = document.querySelector('.search-results');
  const emptyEl   = document.querySelector('.search-empty');

  if (!overlay) return;

  const open = () => {
    state.searchOpen = true;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 80);
  };

  const close = () => {
    state.searchOpen = false;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
    renderSearchResults('');
  };

  toggleBtn && toggleBtn.addEventListener('click', open);
  closeBtn  && closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.searchOpen) close();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      state.searchOpen ? close() : open();
    }
  });

  input && input.addEventListener('input', () => {
    renderSearchResults(input.value.trim());
  });

  function renderSearchResults(query) {
    if (!resultsEl) return;
    const q = query.toLowerCase();

    if (!q) {
      resultsEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'none';
      return;
    }

    const matches = STICKERS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );

    if (emptyEl) emptyEl.style.display = matches.length === 0 ? 'block' : 'none';
    resultsEl.innerHTML = matches.map(s => buildStickerCard(s)).join('');
    attachCopyButtons(resultsEl);
  }
}

/* ─────────────────────────────────────────────────
   8. Sticker Card Builder
───────────────────────────────────────────────── */
function buildStickerCard(sticker) {
  const newFlag = sticker.isNew ? ' is-new' : '';
  const imgContent = sticker.image
    ? `<img src="${sticker.image}" alt="${sticker.name}" loading="lazy">`
    : `<span class="sticker-emoji">${sticker.emoji}</span>`;

  return `
    <article class="sticker-card${newFlag} scale-in" data-id="${sticker.id}" data-category="${sticker.category}" role="listitem">
      <div class="sticker-img-wrap" data-cat="${sticker.category}">
        ${imgContent}
      </div>
      <div class="sticker-body">
        <span class="sticker-category-tag">${CATEGORIES[sticker.category]?.label || sticker.category}</span>
        <h3 class="sticker-name">${sticker.name}</h3>
        <div class="sticker-meta">
          <span class="sticker-id">${sticker.id}</span>
          <span class="sticker-price">${sticker.price} <span>MAD</span></span>
        </div>
        <div class="sticker-footer">
          ${sticker.waterproof ? '<span class="sticker-waterproof">💧 Waterproof</span>' : ''}
          <button class="copy-btn" data-copy="${sticker.id}" aria-label="Copy sticker ID ${sticker.id}">
            <span>📋</span> Copy ID
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ─────────────────────────────────────────────────
   9. Copy to Clipboard
───────────────────────────────────────────────── */
function attachCopyButtons(container) {
  container.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(id);
      } catch {
        // Fallback for older browsers / Safari
        const ta = document.createElement('textarea');
        ta.value = id;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.textContent = '✅ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '<span>📋</span> Copy ID';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

/* ─────────────────────────────────────────────────
   10. Sticker Grid Renderer
───────────────────────────────────────────────── */
function renderGrid(container, stickers) {
  if (!container) return;

  if (stickers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p class="empty-state-title">No stickers found.</p>
        <p class="empty-state-desc">Try a different filter or check back soon.</p>
      </div>`;
    return;
  }

  container.innerHTML = stickers.map(s => buildStickerCard(s)).join('');
  attachCopyButtons(container);
  // Trigger entrance animations for newly added cards
  observeElements(container.querySelectorAll('.scale-in'));
}

/* ─────────────────────────────────────────────────
   11. Filter & Sort Logic
───────────────────────────────────────────────── */
function getFilteredStickers(baseCategory) {
  let list = baseCategory
    ? STICKERS.filter(s => s.category === baseCategory)
    : [...STICKERS];

  // Category filter (only on index where all categories shown)
  if (!baseCategory && state.activeFilter !== 'all') {
    list = list.filter(s => s.category === state.activeFilter);
  }

  // Sort
  switch (state.activeSort) {
    case 'az':      list.sort((a, b) => a.name.localeCompare(b.name));   break;
    case 'za':      list.sort((a, b) => b.name.localeCompare(a.name));   break;
    case 'newest':  list.sort((a, b) => b.isNew - a.isNew);              break;
    case 'price-asc':  list.sort((a, b) => a.price - b.price);           break;
    case 'price-desc': list.sort((a, b) => b.price - a.price);           break;
    default: break; // keep original order
  }

  return list;
}

function initFilters(gridEl, baseCategory) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect  = document.querySelector('.filter-select');
  const countEl     = document.querySelector('.filter-count');

  const refresh = () => {
    const list = getFilteredStickers(baseCategory);
    renderGrid(gridEl, list);
    if (countEl) countEl.textContent = `${list.length} sticker${list.length !== 1 ? 's' : ''}`;
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      refresh();
    });
  });

  sortSelect && sortSelect.addEventListener('change', () => {
    state.activeSort = sortSelect.value;
    refresh();
  });

  refresh(); // Initial render
}

/* ─────────────────────────────────────────────────
   12. New Arrivals Section
───────────────────────────────────────────────── */
function initNewArrivals() {
  const grid = document.querySelector('.arrivals-grid');
  if (!grid) return;
  const newOnes = STICKERS.filter(s => s.isNew).slice(0, 8);
  renderGrid(grid, newOnes);
}

/* ─────────────────────────────────────────────────
   13. Category Cards on Home
───────────────────────────────────────────────── */
function initCategoryCards() {
  const grid = document.querySelector('.categories-grid');
  if (!grid) return;

  grid.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => {
    const count = STICKERS.filter(s => s.category === key).length;
    return `
      <a href="${cat.page}" class="cat-card fade-up" data-cat="${key}" aria-label="Browse ${cat.label} stickers">
        <span class="cat-icon">${cat.icon}</span>
        <p class="cat-name">${cat.label}</p>
        <p class="cat-count">${count} stickers</p>
      </a>
    `;
  }).join('');
}

/* ─────────────────────────────────────────────────
   14. Hero Float Cards (home page)
───────────────────────────────────────────────── */
function initHeroFloatCards() {
  const floatCards = document.querySelectorAll('.hero-float-card');
  const featured = [
    STICKERS.find(s => s.id === 'AN-001'),
    STICKERS.find(s => s.id === 'KP-002'),
    STICKERS.find(s => s.id === 'GM-003'),
  ].filter(Boolean);

  floatCards.forEach((card, i) => {
    const s = featured[i];
    if (!s) return;
    const catMeta = CATEGORIES[s.category];
    card.innerHTML = `
      <div class="hfc-img" style="background: var(--bg-3)">${s.emoji}</div>
      <div class="hfc-body">
        <p class="hfc-name">${s.name}</p>
        <div class="hfc-meta">
          <span class="hfc-id">${s.id}</span>
          <span class="hfc-price">${s.price} MAD</span>
        </div>
        ${s.waterproof ? '<span class="hfc-badge">💧 Waterproof</span>' : ''}
      </div>
    `;
  });
}

/* ─────────────────────────────────────────────────
   15. Intersection Observer Animations
───────────────────────────────────────────────── */
function observeElements(elements) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => io.observe(el));
}

function initAnimations() {
  observeElements(document.querySelectorAll(
    '.fade-up, .fade-in, .scale-in, .stagger-children, .timeline-item'
  ));
}

/* ─────────────────────────────────────────────────
   16. Active Nav Link
───────────────────────────────────────────────── */
function markActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === 'index.html' && href === '#')) {
      link.classList.add('active');
    }
  });
}

/* ─────────────────────────────────────────────────
   17. Page Detection & Hydration
───────────────────────────────────────────────── */
function detectPage() {
  const body = document.body;
  return body.dataset.page || null;
}

function hydrateCategoryPage(category) {
  const grid = document.querySelector('.sticker-grid');
  if (!grid) return;
  initFilters(grid, category);
}

function hydrateHomePage() {
  initCategoryCards();
  initHeroFloatCards();
  initNewArrivals();

  const homeGrid = document.querySelector('.home-sticker-grid');
  if (homeGrid) {
    initFilters(homeGrid, null);
  }
}

/* ─────────────────────────────────────────────────
   18. Boot
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavScroll();
  initMobileMenu();
  initSearch();
  markActiveLink();

  // Theme toggle button
  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

  // Page-specific hydration
  const page = detectPage();
  if (page === 'home') {
    hydrateHomePage();
  } else if (CATEGORIES[page]) {
    hydrateCategoryPage(page);
  }

  // Animations (after grid render)
  setTimeout(initAnimations, 50);
});
