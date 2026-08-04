/* ================================================================
   StickerVersz — script.js
   Single-page gallery with filtering, search, and animations
   ================================================================ */

'use strict';

/* ─── Sticker data lives in stickers.js — edit that file to add/change stickers ─── */

/* ─── Category gradient map ─── */
const CAT_STYLES = {
  anime:  { from:'#1e0a40', to:'#3b1a7a', accent:'#a78bfa' },
  kpop:   { from:'#1a0033', to:'#4a0080', accent:'#e879f9' },
  gaming: { from:'#001040', to:'#002880', accent:'#60a5fa' },
  sports: { from:'#001800', to:'#003800', accent:'#4ade80' },
  movies: { from:'#1a1000', to:'#3d2600', accent:'#fbbf24' },
  music:  { from:'#1a003a', to:'#3d0080', accent:'#c084fc' },
  study:  { from:'#001818', to:'#002e2e', accent:'#2dd4bf' },
  manga:  { from:'#200020', to:'#4a004a', accent:'#f472b6' },
  cars:   { from:'#200000', to:'#4a0000', accent:'#f87171' },
  memes:  { from:'#181800', to:'#383800', accent:'#facc15' },
  quotes: { from:'#0a0400', to:'#2a1200', accent:'#f59e0b' },
};

/* ─── State ─── */
let activeFilter = 'all';
let searchQuery  = '';
const selectedIds = new Set();

/* ─── DOM refs ─── */
const stickerGrid     = document.getElementById('stickerGrid');
const gridEmpty       = document.getElementById('gridEmpty');
const filterCount     = document.getElementById('filterCount');
const filterBtns      = document.querySelectorAll('.filter-btn');
const collectionSearch= document.getElementById('collectionSearch');
const collectionClear = document.getElementById('collectionClear');
const resetFilters    = document.getElementById('resetFilters');
const nav             = document.getElementById('nav');
const hamburger       = document.getElementById('hamburger');
const mobileMenu      = document.getElementById('mobileMenu');
const searchToggle    = document.getElementById('searchToggle');
const searchOverlay   = document.getElementById('searchOverlay');
const searchInput     = document.getElementById('searchInput');
const searchClose     = document.getElementById('searchClose');
const searchResults   = document.getElementById('searchResults');
const searchEmpty     = document.getElementById('searchEmpty');
const floatIgBtn      = document.getElementById('floatIgBtn');
const floatIgMenu     = document.getElementById('floatIgMenu');
const copyUsername    = document.getElementById('copyUsername');
const toast           = document.getElementById('toast');

/* ================================================================
   RENDER STICKER GRID
   ================================================================ */
function getFilteredStickers() {
  return STICKERS.filter(s => {
    const catMatch = activeFilter === 'all' || s.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const qMatch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q);
    return catMatch && qMatch;
  });
}

function renderGrid() {
  const list = getFilteredStickers();

  stickerGrid.innerHTML = '';
  gridEmpty.hidden = list.length > 0;
  stickerGrid.hidden = list.length === 0;

  const total = activeFilter === 'all' && !searchQuery ? STICKERS.length : list.length;
  filterCount.textContent = `${list.length} sticker${list.length !== 1 ? 's' : ''}`;

  list.forEach((s, i) => {
    const card = buildCard(s);
    stickerGrid.appendChild(card);
    /* stagger entrance */
    setTimeout(() => card.classList.add('card-visible'), i * 35);
  });
}

/* ----------------------------------------------------------------
   Custom SVG backgrounds — one per category, logo-inspired:
   crown · lightning · smiley · splatter · stars · graffiti marks
   ---------------------------------------------------------------- */
function getBgSVG(cat, rawId) {
  const g = 'g' + rawId.replace(/\W/g, '_'); // unique gradient id per card

  const svgs = {

/* ── ANIME ── sakura · crown · rising sun · stars · wave */
anime: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e0a40"/><stop offset="100%" stop-color="#4a1280"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<path d="M0 262 Q37 247 75 262 Q112 277 150 262 Q187 247 225 262 Q262 277 300 262 L300 300 L0 300 Z" fill="#6d28d9" opacity=".28"/>
<ellipse cx="42" cy="62" rx="14" ry="10" fill="#e879f9" opacity=".5" transform="rotate(-20 42 62)"/>
<ellipse cx="242" cy="78" rx="12" ry="9" fill="#f0abfc" opacity=".45" transform="rotate(15 242 78)"/>
<ellipse cx="72" cy="218" rx="13" ry="9" fill="#e879f9" opacity=".42" transform="rotate(-35 72 218)"/>
<ellipse cx="258" cy="238" rx="11" ry="8" fill="#f0abfc" opacity=".38" transform="rotate(25 258 238)"/>
<ellipse cx="160" cy="272" rx="12" ry="8" fill="#e879f9" opacity=".32" transform="rotate(10 160 272)"/>
<path d="M270 0 A58 58 0 0 0 212 0 Z" fill="#f97316" opacity=".22"/>
<line x1="242" y1="4" x2="232" y2="40" stroke="#f97316" stroke-width="1.5" opacity=".28"/>
<line x1="262" y1="4" x2="268" y2="40" stroke="#f97316" stroke-width="1.5" opacity=".28"/>
<path d="M112 50 L130 20 L150 35 L170 20 L188 50 Z" fill="none" stroke="#a78bfa" stroke-width="3.5" stroke-linejoin="round"/>
<rect x="109" y="48" width="82" height="11" rx="3" fill="#a78bfa" opacity=".6"/>
<path d="M52 147 L56 138 L60 147 L69 150 L60 153 L56 162 L52 153 L43 150 Z" fill="#c084fc" opacity=".72"/>
<path d="M238 142 L241 134 L244 142 L252 145 L244 148 L241 156 L238 148 L230 145 Z" fill="#a78bfa" opacity=".65"/>
<path d="M26 26 L29 19 L32 26 L40 29 L32 32 L29 40 L26 32 L18 29 Z" fill="#e879f9" opacity=".62"/>
<path d="M265 68 L267 62 L269 68 L275 70 L269 72 L267 78 L265 72 L259 70 Z" fill="#c084fc" opacity=".55"/>
<path d="M268 155 L261 178 L269 178 L260 203 L278 172 L269 172 Z" fill="#a78bfa" opacity=".58"/>
<circle cx="128" cy="108" r="5" fill="#c084fc" opacity=".45"/>
<circle cx="195" cy="132" r="3.5" fill="#e879f9" opacity=".42"/>
<circle cx="80" cy="178" r="4" fill="#a78bfa" opacity=".42"/>
<circle cx="218" cy="188" r="6" fill="#c084fc" opacity=".32"/>
<circle cx="148" cy="228" r="3.5" fill="#e879f9" opacity=".48"/>
<circle cx="48" cy="258" r="4.5" fill="#a78bfa" opacity=".38"/>
<circle cx="272" cy="252" r="3" fill="#c084fc" opacity=".42"/>
</svg>`,

/* ── K-POP ── crown · hearts · stars · confetti · smiley · light rays */
kpop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a0033"/><stop offset="100%" stop-color="#550090"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<path d="M150 0 L300 300 L0 300 Z" fill="#e879f9" opacity=".04"/>
<path d="M150 0 L280 300 L20 300 Z" fill="#c084fc" opacity=".04"/>
<path d="M112 52 L130 22 L150 37 L170 22 L188 52 Z" fill="none" stroke="#f0abfc" stroke-width="3.5" stroke-linejoin="round"/>
<rect x="110" y="50" width="80" height="11" rx="3" fill="#f0abfc" opacity=".55"/>
<path d="M52 98 C52 91 60 86 68 93 C76 86 84 91 84 98 C84 110 68 122 68 122 C68 122 52 110 52 98 Z" fill="#e879f9" opacity=".5"/>
<path d="M220 192 C220 186 227 182 233 188 C239 182 246 186 246 192 C246 204 233 214 233 214 C233 214 220 204 220 192 Z" fill="#f0abfc" opacity=".45"/>
<path d="M244 68 C244 63 249 59 254 64 C259 59 264 63 264 68 C264 78 254 86 254 86 C254 86 244 78 244 68 Z" fill="#e879f9" opacity=".42"/>
<path d="M32 228 C32 223 37 219 42 224 C47 219 52 223 52 228 C52 237 42 244 42 244 C42 244 32 237 32 228 Z" fill="#f0abfc" opacity=".38"/>
<path d="M33 148 L36 140 L39 148 L47 151 L39 154 L36 162 L33 154 L25 151 Z" fill="#c084fc" opacity=".7"/>
<path d="M258 138 L261 130 L264 138 L272 141 L264 144 L261 152 L258 144 L250 141 Z" fill="#f0abfc" opacity=".65"/>
<path d="M162 262 L164 256 L166 262 L172 264 L166 266 L164 272 L162 266 L156 264 Z" fill="#c084fc" opacity=".58"/>
<path d="M272 28 L274 22 L276 28 L282 30 L276 32 L274 38 L272 32 L266 30 Z" fill="#e879f9" opacity=".62"/>
<path d="M28 268 L30 262 L32 268 L38 270 L32 272 L30 278 L28 272 L22 270 Z" fill="#f0abfc" opacity=".48"/>
<rect x="72" y="198" width="18" height="8" rx="2" fill="#e879f9" opacity=".35" transform="rotate(30 72 198)"/>
<rect x="212" y="242" width="16" height="7" rx="2" fill="#c084fc" opacity=".3" transform="rotate(-25 212 242)"/>
<rect x="232" y="108" width="14" height="6" rx="2" fill="#f0abfc" opacity=".35" transform="rotate(50 232 108)"/>
<rect x="48" y="168" width="12" height="5" rx="2" fill="#e879f9" opacity=".32" transform="rotate(-40 48 168)"/>
<rect x="260" y="185" width="15" height="6" rx="2" fill="#f0abfc" opacity=".3" transform="rotate(20 260 185)"/>
<circle cx="68" cy="244" r="22" fill="none" stroke="#c084fc" stroke-width="2.5" opacity=".45"/>
<circle cx="61" cy="238" r="3.5" fill="#c084fc" opacity=".5"/>
<circle cx="75" cy="238" r="3.5" fill="#c084fc" opacity=".5"/>
<path d="M59 250 Q68 260 77 250" fill="none" stroke="#c084fc" stroke-width="2.5" opacity=".5"/>
<path d="M65 266 Q68 274 68 280" stroke="#c084fc" stroke-width="2" fill="none" opacity=".3"/>
<circle cx="132" cy="112" r="5" fill="#f0abfc" opacity=".4"/>
<circle cx="188" cy="165" r="3.5" fill="#c084fc" opacity=".38"/>
<circle cx="96" cy="148" r="4" fill="#e879f9" opacity=".35"/>
<circle cx="202" cy="78" r="3" fill="#f0abfc" opacity=".42"/>
</svg>`,

/* ── GAMING ── pixel grid · D-pad · buttons · lightning · pixel stars */
gaming: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#001040"/><stop offset="100%" stop-color="#002e8a"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<line x1="0" y1="60" x2="300" y2="60" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="0" y1="120" x2="300" y2="120" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="0" y1="180" x2="300" y2="180" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="0" y1="240" x2="300" y2="240" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="60" y1="0" x2="60" y2="300" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="120" y1="0" x2="120" y2="300" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="180" y1="0" x2="180" y2="300" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<line x1="240" y1="0" x2="240" y2="300" stroke="#60a5fa" stroke-width=".6" opacity=".15"/>
<circle cx="150" cy="150" r="82" fill="#3b82f6" opacity=".06"/>
<path d="M112 52 L130 22 L150 37 L170 22 L188 52 Z" fill="none" stroke="#60a5fa" stroke-width="3.5" stroke-linejoin="round" opacity=".75"/>
<rect x="110" y="50" width="80" height="11" rx="2" fill="#60a5fa" opacity=".48"/>
<rect x="126" y="118" width="20" height="50" rx="3" fill="#60a5fa" opacity=".22"/>
<rect x="111" y="133" width="50" height="20" rx="3" fill="#60a5fa" opacity=".22"/>
<circle cx="220" cy="140" r="9" fill="#60a5fa" opacity=".28"/>
<circle cx="238" cy="152" r="9" fill="#3b82f6" opacity=".28"/>
<circle cx="220" cy="164" r="9" fill="#60a5fa" opacity=".28"/>
<circle cx="202" cy="152" r="9" fill="#93c5fd" opacity=".22"/>
<path d="M50 52 L42 77 L50 77 L41 103 L60 70 L50 70 Z" fill="#60a5fa" opacity=".65"/>
<path d="M248 195 L240 220 L248 220 L239 246 L258 213 L248 213 Z" fill="#3b82f6" opacity=".58"/>
<rect x="32" y="153" width="8" height="8" fill="#60a5fa" opacity=".52"/>
<rect x="36" y="149" width="8" height="8" fill="#60a5fa" opacity=".52"/>
<rect x="36" y="157" width="8" height="8" fill="#60a5fa" opacity=".52"/>
<rect x="258" y="62" width="7" height="7" fill="#93c5fd" opacity=".48"/>
<rect x="262" y="58" width="7" height="7" fill="#93c5fd" opacity=".48"/>
<rect x="262" y="66" width="7" height="7" fill="#93c5fd" opacity=".48"/>
<rect x="32" y="220" width="7" height="7" fill="#60a5fa" opacity=".38"/>
<rect x="36" y="216" width="7" height="7" fill="#60a5fa" opacity=".38"/>
<rect x="36" y="224" width="7" height="7" fill="#60a5fa" opacity=".38"/>
<circle cx="90" cy="222" r="5.5" fill="#60a5fa" opacity=".35"/>
<circle cx="216" cy="68" r="4" fill="#93c5fd" opacity=".38"/>
<circle cx="58" cy="192" r="3.5" fill="#3b82f6" opacity=".42"/>
<circle cx="268" cy="268" r="5" fill="#60a5fa" opacity=".32"/>
<circle cx="186" cy="248" r="3" fill="#93c5fd" opacity=".42"/>
</svg>`,

/* ── SPORTS ── speed lines · ball · trophy · crown · swoosh · lightning */
sports: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#001800"/><stop offset="100%" stop-color="#004500"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<line x1="0" y1="128" x2="300" y2="78" stroke="#4ade80" stroke-width="2" opacity=".18"/>
<line x1="0" y1="150" x2="300" y2="100" stroke="#4ade80" stroke-width="3" opacity=".15"/>
<line x1="0" y1="172" x2="300" y2="122" stroke="#4ade80" stroke-width="2" opacity=".18"/>
<line x1="0" y1="196" x2="300" y2="146" stroke="#4ade80" stroke-width="1.5" opacity=".12"/>
<circle cx="230" cy="212" r="56" fill="none" stroke="#4ade80" stroke-width="2.5" opacity=".2"/>
<path d="M183 182 Q230 167 277 192" fill="none" stroke="#4ade80" stroke-width="2" opacity=".2"/>
<path d="M188 220 Q230 242 274 220" fill="none" stroke="#4ade80" stroke-width="2" opacity=".2"/>
<path d="M112 50 L130 22 L150 37 L170 22 L188 50 Z" fill="none" stroke="#4ade80" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="48" width="80" height="11" rx="3" fill="#4ade80" opacity=".48"/>
<rect x="58" y="182" width="50" height="65" rx="4" fill="none" stroke="#86efac" stroke-width="2" opacity=".3"/>
<path d="M50 182 Q38 162 50 147 Q60 168 83 168 Q106 168 116 147 Q128 162 116 182" fill="none" stroke="#86efac" stroke-width="2" opacity=".3"/>
<rect x="70" y="247" width="26" height="8" rx="2" fill="#86efac" opacity=".3"/>
<path d="M242 42 L246 33 L250 42 L259 45 L250 48 L246 57 L242 48 L233 45 Z" fill="#4ade80" opacity=".62"/>
<path d="M33 82 L36 74 L39 82 L47 85 L39 88 L36 96 L33 88 L25 85 Z" fill="#86efac" opacity=".58"/>
<path d="M267 130 L270 123 L273 130 L280 133 L273 136 L270 143 L267 136 L260 133 Z" fill="#4ade80" opacity=".52"/>
<path d="M262 50 L254 73 L262 73 L253 97 L270 65 L261 65 Z" fill="#4ade80" opacity=".58"/>
<path d="M0 258 Q80 232 160 255 Q240 278 300 255" fill="none" stroke="#4ade80" stroke-width="2" opacity=".2"/>
<circle cx="112" cy="118" r="5" fill="#4ade80" opacity=".32"/>
<circle cx="175" cy="85" r="3.5" fill="#86efac" opacity=".38"/>
<circle cx="52" cy="252" r="4.5" fill="#4ade80" opacity=".3"/>
<circle cx="192" cy="155" r="3" fill="#86efac" opacity=".38"/>
<circle cx="138" cy="262" r="5" fill="#4ade80" opacity=".26"/>
</svg>`,

/* ── MOVIES ── film strip · spotlight · star burst · crown · lightning flash */
movies: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1000"/><stop offset="100%" stop-color="#4a2800"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<path d="M0 0 L230 300 L160 300 Z" fill="#fbbf24" opacity=".05"/>
<path d="M0 0 L290 300 L220 300 Z" fill="#f59e0b" opacity=".04"/>
<rect x="0" y="0" width="22" height="300" fill="#000" opacity=".38"/>
<rect x="4" y="12" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="4" y="52" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="4" y="92" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="4" y="132" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="4" y="172" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="4" y="212" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="4" y="252" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="278" y="0" width="22" height="300" fill="#000" opacity=".38"/>
<rect x="282" y="12" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="282" y="52" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="282" y="92" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="282" y="132" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="282" y="172" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="282" y="212" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<rect x="282" y="252" width="14" height="22" rx="2" fill="#111" stroke="#fbbf24" stroke-width="1" opacity=".55"/>
<path d="M150 38 L156 22 L162 38 L178 44 L162 50 L156 66 L150 50 L134 44 Z" fill="#fbbf24" opacity=".68"/>
<path d="M112 68 L130 40 L150 55 L170 40 L188 68 Z" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="66" width="80" height="11" rx="3" fill="#fbbf24" opacity=".52"/>
<path d="M238 92 L242 82 L246 92 L256 96 L246 100 L242 110 L238 100 L228 96 Z" fill="#f59e0b" opacity=".62"/>
<path d="M52 202 L55 194 L58 202 L66 205 L58 208 L55 216 L52 208 L44 205 Z" fill="#fbbf24" opacity=".58"/>
<path d="M272 222 L275 215 L278 222 L285 225 L278 228 L275 235 L272 228 L265 225 Z" fill="#f59e0b" opacity=".52"/>
<path d="M242 195 L234 218 L242 218 L233 242 L251 210 L242 210 Z" fill="#fbbf24" opacity=".52"/>
<circle cx="102" cy="142" r="5" fill="#fbbf24" opacity=".36"/>
<circle cx="186" cy="202" r="3.5" fill="#f59e0b" opacity=".42"/>
<circle cx="68" cy="88" r="4" fill="#fbbf24" opacity=".32"/>
<circle cx="232" cy="165" r="5.5" fill="#f59e0b" opacity=".3"/>
<circle cx="162" cy="252" r="3" fill="#fbbf24" opacity=".42"/>
</svg>`,

/* ── MUSIC ── vinyl record · sound wave · eq bars · music note · crown */
music: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a003a"/><stop offset="100%" stop-color="#450090"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<circle cx="212" cy="212" r="76" fill="none" stroke="#c084fc" stroke-width="1.5" opacity=".2"/>
<circle cx="212" cy="212" r="58" fill="none" stroke="#c084fc" stroke-width="1" opacity=".17"/>
<circle cx="212" cy="212" r="38" fill="none" stroke="#c084fc" stroke-width="1" opacity=".2"/>
<circle cx="212" cy="212" r="18" fill="#c084fc" opacity=".26"/>
<circle cx="212" cy="212" r="7" fill="#e879f9" opacity=".45"/>
<path d="M22 148 Q42 108 62 148 Q82 188 102 148 Q122 108 142 148 Q162 188 182 148 Q202 108 222 148 Q242 188 262 148" fill="none" stroke="#c084fc" stroke-width="2.5" opacity=".35"/>
<path d="M22 168 Q42 138 62 168 Q82 198 102 168 Q122 138 142 168 Q162 198 182 168 Q202 138 222 168 Q242 198 262 168" fill="none" stroke="#e879f9" stroke-width="1.5" opacity=".22"/>
<rect x="36" y="222" width="12" height="50" rx="3" fill="#c084fc" opacity=".32"/>
<rect x="54" y="237" width="12" height="35" rx="3" fill="#e879f9" opacity=".26"/>
<rect x="72" y="212" width="12" height="60" rx="3" fill="#c084fc" opacity=".32"/>
<rect x="90" y="230" width="12" height="42" rx="3" fill="#e879f9" opacity=".26"/>
<rect x="58" y="58" width="7" height="52" rx="2" fill="#c084fc" opacity=".52"/>
<ellipse cx="53" cy="112" rx="13" ry="8" fill="#c084fc" opacity=".48" transform="rotate(-15 53 112)"/>
<rect x="65" y="58" width="20" height="5" rx="1" fill="#c084fc" opacity=".52"/>
<path d="M112 52 L130 22 L150 37 L170 22 L188 52 Z" fill="none" stroke="#e879f9" stroke-width="3.5" stroke-linejoin="round" opacity=".68"/>
<rect x="110" y="50" width="80" height="11" rx="3" fill="#e879f9" opacity=".42"/>
<path d="M258 62 L261 54 L264 62 L272 65 L264 68 L261 76 L258 68 L250 65 Z" fill="#c084fc" opacity=".68"/>
<path d="M32 232 L35 224 L38 232 L46 235 L38 238 L35 246 L32 238 L24 235 Z" fill="#e879f9" opacity=".58"/>
<path d="M270 165 L273 158 L276 165 L283 168 L276 171 L273 178 L270 171 L263 168 Z" fill="#c084fc" opacity=".52"/>
<path d="M262 100 L254 123 L262 123 L253 147 L270 115 L261 115 Z" fill="#c084fc" opacity=".52"/>
<circle cx="142" cy="78" r="5" fill="#c084fc" opacity=".38"/>
<circle cx="172" cy="118" r="3.5" fill="#e879f9" opacity=".42"/>
<circle cx="75" cy="165" r="4" fill="#c084fc" opacity=".32"/>
<circle cx="237" cy="88" r="3" fill="#e879f9" opacity=".42"/>
</svg>`,

/* ── STUDY ── notebook grid · margin line · pencil · coffee cup · crown · stars */
study: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#001818"/><stop offset="100%" stop-color="#003535"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<line x1="28" y1="98" x2="272" y2="98" stroke="#2dd4bf" stroke-width="1" opacity=".2"/>
<line x1="28" y1="118" x2="272" y2="118" stroke="#2dd4bf" stroke-width="1" opacity=".18"/>
<line x1="28" y1="138" x2="272" y2="138" stroke="#2dd4bf" stroke-width="1" opacity=".2"/>
<line x1="28" y1="158" x2="272" y2="158" stroke="#2dd4bf" stroke-width="1" opacity=".18"/>
<line x1="28" y1="178" x2="272" y2="178" stroke="#2dd4bf" stroke-width="1" opacity=".2"/>
<line x1="28" y1="198" x2="272" y2="198" stroke="#2dd4bf" stroke-width="1" opacity=".18"/>
<line x1="28" y1="218" x2="272" y2="218" stroke="#2dd4bf" stroke-width="1" opacity=".2"/>
<line x1="55" y1="88" x2="55" y2="232" stroke="#f87171" stroke-width="1.5" opacity=".26"/>
<path d="M112 52 L130 22 L150 37 L170 22 L188 52 Z" fill="none" stroke="#2dd4bf" stroke-width="3.5" stroke-linejoin="round" opacity=".68"/>
<rect x="110" y="50" width="80" height="11" rx="3" fill="#2dd4bf" opacity=".42"/>
<rect x="210" y="55" width="16" height="65" rx="3" fill="#2dd4bf" opacity=".26" transform="rotate(35 210 55)"/>
<path d="M223 100 L232 123 L214 117 Z" fill="#f59e0b" opacity=".38" transform="rotate(35 223 100)"/>
<rect x="56" y="238" width="46" height="46" rx="5" fill="none" stroke="#2dd4bf" stroke-width="2" opacity=".38"/>
<path d="M102 248 Q117 256 102 265" fill="none" stroke="#2dd4bf" stroke-width="2" opacity=".38"/>
<path d="M70 236 Q74 228 70 220" fill="none" stroke="#2dd4bf" stroke-width="1.5" opacity=".3"/>
<path d="M83 236 Q87 226 83 216" fill="none" stroke="#2dd4bf" stroke-width="1.5" opacity=".3"/>
<path d="M232 48 L235 40 L238 48 L246 51 L238 54 L235 62 L232 54 L224 51 Z" fill="#2dd4bf" opacity=".68"/>
<path d="M264 193 L267 186 L270 193 L277 196 L270 199 L267 206 L264 199 L257 196 Z" fill="#2dd4bf" opacity=".58"/>
<path d="M33 238 L36 230 L39 238 L47 241 L39 244 L36 252 L33 244 L25 241 Z" fill="#2dd4bf" opacity=".52"/>
<path d="M257 258 L260 251 L263 258 L270 261 L263 264 L260 271 L257 264 L250 261 Z" fill="#2dd4bf" opacity=".46"/>
<path d="M267 83 L259 106 L267 106 L258 130 L275 98 L266 98 Z" fill="#2dd4bf" opacity=".52"/>
<circle cx="116" cy="82" r="5" fill="#2dd4bf" opacity=".38"/>
<circle cx="192" cy="94" r="3.5" fill="#34d399" opacity=".38"/>
<circle cx="157" cy="232" r="4" fill="#2dd4bf" opacity=".32"/>
<circle cx="247" cy="148" r="3" fill="#34d399" opacity=".38"/>
</svg>`,

/* ── MANGA ── speed lines · halftone dots · action burst · crown · exclamation */
manga: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#200020"/><stop offset="100%" stop-color="#550055"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<circle cx="220" cy="38" r="3" fill="#f472b6" opacity=".32"/>
<circle cx="240" cy="38" r="3" fill="#f472b6" opacity=".28"/>
<circle cx="260" cy="38" r="3" fill="#f472b6" opacity=".25"/>
<circle cx="280" cy="38" r="2.5" fill="#f472b6" opacity=".22"/>
<circle cx="220" cy="56" r="3" fill="#f472b6" opacity=".28"/>
<circle cx="240" cy="56" r="2.5" fill="#f472b6" opacity=".24"/>
<circle cx="260" cy="56" r="2" fill="#f472b6" opacity=".2"/>
<circle cx="280" cy="56" r="2" fill="#f472b6" opacity=".17"/>
<circle cx="230" cy="74" r="2.5" fill="#f472b6" opacity=".22"/>
<circle cx="250" cy="74" r="2" fill="#f472b6" opacity=".18"/>
<circle cx="270" cy="74" r="2" fill="#f472b6" opacity=".15"/>
<line x1="272" y1="150" x2="0" y2="58" stroke="#f472b6" stroke-width="1.5" opacity=".18"/>
<line x1="272" y1="150" x2="0" y2="98" stroke="#f472b6" stroke-width="2" opacity=".16"/>
<line x1="272" y1="150" x2="0" y2="138" stroke="#f472b6" stroke-width="2.5" opacity=".14"/>
<line x1="272" y1="150" x2="0" y2="178" stroke="#f472b6" stroke-width="2.5" opacity=".14"/>
<line x1="272" y1="150" x2="0" y2="218" stroke="#f472b6" stroke-width="2" opacity=".16"/>
<line x1="272" y1="150" x2="0" y2="258" stroke="#f472b6" stroke-width="1.5" opacity=".18"/>
<line x1="272" y1="150" x2="78" y2="0" stroke="#f472b6" stroke-width="1" opacity=".15"/>
<line x1="272" y1="150" x2="198" y2="0" stroke="#f472b6" stroke-width="1" opacity=".15"/>
<line x1="272" y1="150" x2="78" y2="300" stroke="#f472b6" stroke-width="1" opacity=".15"/>
<line x1="272" y1="150" x2="198" y2="300" stroke="#f472b6" stroke-width="1" opacity=".15"/>
<polygon points="150,55 158,85 188,82 168,102 178,132 150,115 122,132 132,102 112,82 142,85" fill="none" stroke="#f472b6" stroke-width="2" opacity=".42"/>
<path d="M112 200 L130 172 L150 187 L170 172 L188 200 Z" fill="none" stroke="#f472b6" stroke-width="3.5" stroke-linejoin="round" opacity=".65"/>
<rect x="110" y="198" width="80" height="11" rx="3" fill="#f472b6" opacity=".42"/>
<rect x="50" y="78" width="10" height="42" rx="3" fill="#f472b6" opacity=".48"/>
<circle cx="55" cy="130" r="6" fill="#f472b6" opacity=".48"/>
<rect x="244" y="183" width="8" height="34" rx="3" fill="#f472b6" opacity=".42"/>
<circle cx="248" cy="226" r="5" fill="#f472b6" opacity=".42"/>
<path d="M30 233 L33 225 L36 233 L44 236 L36 239 L33 247 L30 239 L22 236 Z" fill="#f472b6" opacity=".62"/>
<path d="M260 53 L263 45 L266 53 L274 56 L266 59 L263 67 L260 59 L252 56 Z" fill="#ec4899" opacity=".58"/>
<circle cx="93" cy="228" r="5.5" fill="#f472b6" opacity=".36"/>
<circle cx="196" cy="258" r="4" fill="#ec4899" opacity=".36"/>
<circle cx="58" cy="168" r="3.5" fill="#f472b6" opacity=".36"/>
<circle cx="232" cy="222" r="5" fill="#ec4899" opacity=".3"/>
</svg>`,

/* ── CARS ── speed lines · tire tracks · flames · lightning · skid marks */
cars: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#200000"/><stop offset="100%" stop-color="#550000"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<line x1="0" y1="108" x2="300" y2="108" stroke="#f87171" stroke-width="3" opacity=".18"/>
<line x1="0" y1="122" x2="300" y2="122" stroke="#f87171" stroke-width="2" opacity=".15"/>
<line x1="0" y1="135" x2="300" y2="135" stroke="#fca5a5" stroke-width="1.5" opacity=".15"/>
<line x1="0" y1="148" x2="300" y2="148" stroke="#f87171" stroke-width="4.5" opacity=".13"/>
<line x1="0" y1="162" x2="300" y2="162" stroke="#fca5a5" stroke-width="1.5" opacity=".15"/>
<line x1="0" y1="175" x2="300" y2="175" stroke="#f87171" stroke-width="2" opacity=".15"/>
<line x1="0" y1="188" x2="300" y2="188" stroke="#f87171" stroke-width="2.5" opacity=".18"/>
<path d="M0 258 L18 248 L36 258 L54 248 L72 258 L90 248 L108 258 L126 248 L144 258 L162 248 L180 258 L198 248 L216 258 L234 248 L252 258 L270 248 L288 258" fill="none" stroke="#f87171" stroke-width="2" opacity=".22"/>
<path d="M0 274 L18 264 L36 274 L54 264 L72 274 L90 264 L108 274 L126 264 L144 274 L162 264 L180 274 L198 264 L216 274 L234 264 L252 274 L270 264 L288 274" fill="none" stroke="#fca5a5" stroke-width="1.5" opacity=".18"/>
<path d="M52 300 Q42 268 56 252 Q61 272 72 262 Q68 286 82 300 Z" fill="#f97316" opacity=".42"/>
<path d="M76 300 Q66 270 80 256 Q86 275 96 266 Q92 288 108 300 Z" fill="#ef4444" opacity=".38"/>
<path d="M36 300 Q28 272 40 260 Q45 276 52 268 Q50 290 62 300 Z" fill="#fb923c" opacity=".36"/>
<path d="M112 52 L130 24 L150 38 L170 24 L188 52 Z" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="50" width="80" height="11" rx="3" fill="#f87171" opacity=".52"/>
<path d="M247 63 L239 88 L247 88 L238 113 L256 81 L247 81 Z" fill="#f87171" opacity=".62"/>
<path d="M53 78 L45 101 L53 101 L45 125 L62 93 L53 93 Z" fill="#fca5a5" opacity=".52"/>
<path d="M36 167 L39 159 L42 167 L50 170 L42 173 L39 181 L36 173 L28 170 Z" fill="#f87171" opacity=".68"/>
<path d="M262 198 L265 190 L268 198 L276 201 L268 204 L265 212 L262 204 L254 201 Z" fill="#fca5a5" opacity=".58"/>
<path d="M142 222 Q172 202 202 222" fill="none" stroke="#f87171" stroke-width="3" opacity=".24"/>
<path d="M102 242 Q142 217 182 242" fill="none" stroke="#fca5a5" stroke-width="2.5" opacity=".2"/>
<circle cx="202" cy="78" r="5.5" fill="#f87171" opacity=".36"/>
<circle cx="88" cy="202" r="4" fill="#fca5a5" opacity=".36"/>
<circle cx="242" cy="252" r="5" fill="#f87171" opacity=".3"/>
<circle cx="152" cy="88" r="3.5" fill="#fca5a5" opacity=".42"/>
</svg>`,

/* ── MEMES ── chaotic waves · smiley+drip · question marks · crown · exclamation */
memes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#181800"/><stop offset="100%" stop-color="#404000"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<path d="M0 78 Q30 58 60 78 Q90 98 120 73 Q150 48 180 78 Q210 108 240 78 Q270 53 300 78" fill="none" stroke="#facc15" stroke-width="2" opacity=".2"/>
<path d="M0 218 Q40 198 80 218 Q120 238 160 213 Q200 188 240 218 Q270 238 300 218" fill="none" stroke="#fde047" stroke-width="2" opacity=".18"/>
<circle cx="196" cy="212" r="52" fill="none" stroke="#facc15" stroke-width="3" opacity=".3"/>
<circle cx="182" cy="201" r="6" fill="#facc15" opacity=".32"/>
<circle cx="210" cy="201" r="6" fill="#facc15" opacity=".32"/>
<path d="M179 222 Q196 236 213 222" fill="none" stroke="#facc15" stroke-width="3" opacity=".32"/>
<path d="M186 264 Q188 278 186 286" fill="none" stroke="#facc15" stroke-width="2.5" opacity=".25"/>
<path d="M196 268 Q198 284 196 296" fill="none" stroke="#facc15" stroke-width="2.5" opacity=".22"/>
<path d="M52 78 Q52 60 69 60 Q86 60 86 75 Q86 86 69 91 L69 101" fill="none" stroke="#facc15" stroke-width="4" stroke-linecap="round" opacity=".46"/>
<circle cx="69" cy="111" r="3.5" fill="#facc15" opacity=".46"/>
<path d="M228 152 Q228 137 242 137 Q256 137 256 150 Q256 160 242 164 L242 172" fill="none" stroke="#fde047" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>
<circle cx="242" cy="180" r="3" fill="#fde047" opacity=".4"/>
<path d="M112 50 L130 22 L150 37 L170 22 L188 50 Z" fill="none" stroke="#facc15" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="48" width="80" height="11" rx="3" fill="#facc15" opacity=".52"/>
<rect x="153" y="70" width="10" height="38" rx="3" fill="#facc15" opacity=".48"/>
<circle cx="158" cy="118" r="5.5" fill="#facc15" opacity=".48"/>
<path d="M33 143 L36 135 L39 143 L47 146 L39 149 L36 157 L33 149 L25 146 Z" fill="#facc15" opacity=".68"/>
<path d="M264 73 L267 65 L270 73 L278 76 L270 79 L267 87 L264 79 L256 76 Z" fill="#fde047" opacity=".62"/>
<path d="M272 223 L275 216 L278 223 L285 226 L278 229 L275 236 L272 229 L265 226 Z" fill="#facc15" opacity=".58"/>
<path d="M28 257 L31 249 L34 257 L42 260 L34 263 L31 271 L28 263 L20 260 Z" fill="#fde047" opacity=".52"/>
<path d="M257 113 L249 136 L257 136 L248 160 L265 128 L256 128 Z" fill="#facc15" opacity=".52"/>
<circle cx="112" cy="168" r="5.5" fill="#facc15" opacity=".3"/>
<circle cx="58" cy="212" r="4" fill="#fde047" opacity=".3"/>
<circle cx="98" cy="268" r="5" fill="#facc15" opacity=".28"/>
<circle cx="202" cy="98" r="3.5" fill="#fde047" opacity=".36"/>
</svg>`

  };

  /* ── QUOTES ── quotation marks · ink drops · pen · ruled lines · crown */
  svgs.quotes = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0400"/><stop offset="100%" stop-color="#2a1200"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<line x1="28" y1="145" x2="272" y2="145" stroke="#f59e0b" stroke-width="1" opacity=".18"/>
<line x1="28" y1="163" x2="272" y2="163" stroke="#f59e0b" stroke-width="1" opacity=".15"/>
<line x1="28" y1="181" x2="272" y2="181" stroke="#f59e0b" stroke-width="1" opacity=".18"/>
<line x1="28" y1="199" x2="272" y2="199" stroke="#f59e0b" stroke-width="1" opacity=".15"/>
<path d="M38 88 C38 72 48 65 58 65 C68 65 74 72 74 82 C74 94 64 102 52 108 L44 120 L38 116 Z" fill="#f59e0b" opacity=".38"/>
<path d="M86 88 C86 72 96 65 106 65 C116 65 122 72 122 82 C122 94 112 102 100 108 L92 120 L86 116 Z" fill="#f59e0b" opacity=".32"/>
<path d="M178 168 C178 152 188 145 198 145 C208 145 214 152 214 162 C214 174 204 182 192 188 L184 200 L178 196 Z" fill="#f59e0b" opacity=".28"/>
<path d="M222 168 C222 152 232 145 242 145 C252 145 258 152 258 162 C258 174 248 182 236 188 L228 200 L222 196 Z" fill="#f59e0b" opacity=".24"/>
<path d="M200 232 L216 210 L224 215 L224 260 L200 260 Z" fill="#f59e0b" opacity=".22"/>
<circle cx="212" cy="270" r="7" fill="#f59e0b" opacity=".25"/>
<rect x="196" y="200" width="30" height="5" rx="2" fill="#f59e0b" opacity=".28"/>
<path d="M112 50 L130 22 L150 37 L170 22 L188 50 Z" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="48" width="80" height="11" rx="3" fill="#f59e0b" opacity=".52"/>
<path d="M258 95 L250 118 L258 118 L249 142 L267 110 L258 110 Z" fill="#f59e0b" opacity=".55"/>
<circle cx="52" cy="210" r="6" fill="#f59e0b" opacity=".32"/>
<circle cx="68" cy="225" r="4" fill="#fbbf24" opacity=".28"/>
<circle cx="44" cy="232" r="3" fill="#f59e0b" opacity=".24"/>
<circle cx="60" cy="245" r="5" fill="#fbbf24" opacity=".22"/>
<circle cx="75" cy="240" r="2.5" fill="#f59e0b" opacity=".26"/>
<path d="M32 148 L35 140 L38 148 L46 151 L38 154 L35 162 L32 154 L24 151 Z" fill="#f59e0b" opacity=".65"/>
<path d="M262 218 L265 210 L268 218 L276 221 L268 224 L265 232 L262 224 L254 221 Z" fill="#fbbf24" opacity=".58"/>
<path d="M268 48 L271 40 L274 48 L282 51 L274 54 L271 62 L268 54 L260 51 Z" fill="#f59e0b" opacity=".62"/>
<path d="M26 268 L29 260 L32 268 L40 271 L32 274 L29 282 L26 274 L18 271 Z" fill="#fbbf24" opacity=".48"/>
<circle cx="148" cy="248" r="5" fill="#f59e0b" opacity=".35"/>
<circle cx="232" cy="80" r="4" fill="#fbbf24" opacity=".38"/>
<circle cx="76" cy="168" r="3.5" fill="#f59e0b" opacity=".32"/>
</svg>`;

  return svgs[cat] || svgs.anime;
}

function buildCard(s) {
  const style = CAT_STYLES[s.category] || CAT_STYLES.anime;

  const article = document.createElement('article');
  article.className = 'sticker-card';
  article.setAttribute('role', 'listitem');
  article.setAttribute('data-category', s.category);
  article.setAttribute('data-id', s.id);

  article.innerHTML = `
    <div class="card-img-wrap">
      <div class="card-img-bg">${getBgSVG(s.category, s.id)}</div>
      ${s.image
        ? `<img class="card-img-photo" src="${s.image}" alt="${s.name}" loading="lazy">`
        : `<div class="card-img-emoji" aria-hidden="true">${s.emoji}</div>`}
      ${s.isNew ? '<div class="card-new-badge" aria-label="New sticker">New</div>' : ''}
      <div class="card-waterproof" aria-label="Waterproof sticker">💧 Waterproof</div>
    </div>
    <div class="card-body">
      <div class="card-meta-row">
        <p class="card-category">${s.category}</p>
        <p class="card-price" aria-label="Price: ${s.price ?? 1} MAD">${s.price ?? 1} MAD</p>
      </div>
      <h3 class="card-name" title="${s.name}">${s.name}</h3>
      <p class="card-id">${s.id}</p>
      <div class="card-actions">
        <button class="card-add-btn ${selectedIds.has(s.id) ? 'added' : ''}" data-id="${s.id}" aria-label="${selectedIds.has(s.id) ? 'Remove' : 'Add'} sticker ${s.id}">
          ${selectedIds.has(s.id)
            ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Added`
            : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add ID`}
        </button>
      </div>
    </div>
  `;

  /* Add / Remove ID */
  const addBtn = article.querySelector('.card-add-btn');
  addBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleId(s.id, addBtn);
  });

  return article;
}

/* ================================================================
   FILTER BUTTONS
   ================================================================ */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed','true');
    activeFilter = btn.dataset.filter;
    searchQuery = '';
    collectionSearch.value = '';
    collectionClear.hidden = true;
    renderGrid();
  });
});

/* ================================================================
   INLINE SEARCH (in collection)
   ================================================================ */
collectionSearch.addEventListener('input', () => {
  searchQuery = collectionSearch.value.trim();
  collectionClear.hidden = !searchQuery;
  renderGrid();
});

collectionClear.addEventListener('click', () => {
  searchQuery = '';
  collectionSearch.value = '';
  collectionClear.hidden = true;
  renderGrid();
  collectionSearch.focus();
});

resetFilters.addEventListener('click', () => {
  activeFilter = 'all';
  searchQuery = '';
  collectionSearch.value = '';
  collectionClear.hidden = true;
  filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
  filterBtns[0].classList.add('active');
  filterBtns[0].setAttribute('aria-pressed','true');
  renderGrid();
});

/* ================================================================
   SEARCH OVERLAY
   ================================================================ */
function openSearch() {
  searchOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  searchInput.focus();
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  document.body.style.overflow = '';
  searchInput.value = '';
  searchResults.innerHTML = '';
  searchEmpty.hidden = true;
}

searchToggle.addEventListener('click', openSearch);
searchClose.addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') { if (searchOverlay.classList.contains('open')) closeSearch(); }
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  searchEmpty.hidden = true;

  if (!q) return;

  const matches = STICKERS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q)
  ).slice(0, 10);

  if (!matches.length) { searchEmpty.hidden = false; return; }

  const style = CAT_STYLES;
  matches.forEach(s => {
    const cs = style[s.category] || style.anime;
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.setAttribute('role', 'listitem');
    item.innerHTML = `
      <div class="search-result-thumb" style="background:linear-gradient(135deg,${cs.from},${cs.to})">${s.emoji}</div>
      <div class="search-result-info">
        <p class="search-result-name">${highlight(s.name, q)}</p>
        <p class="search-result-meta">${s.category}</p>
      </div>
      <span class="search-result-id">${s.id}</span>
    `;
    item.addEventListener('click', () => {
      toggleId(s.id);
      showToast(`${selectedIds.has(s.id) ? 'Added' : 'Removed'}: ${s.id}`);
      closeSearch();
    });
    searchResults.appendChild(item);
  });
});

function highlight(text, q) {
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background:rgba(139,92,246,.35);color:inherit;border-radius:3px">$1</mark>');
}

/* ================================================================
   THEME TOGGLE
   ================================================================ */
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('sv-theme', theme);
  themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
}

/* Restore saved preference, fall back to dark */
applyTheme(localStorage.getItem('sv-theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => { themeToggle.style.transform = ''; }, 400);
  applyTheme(next);
});

/* ================================================================
   NAV — scroll + hamburger
   ================================================================ */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('[data-mobile-link]').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  });
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => io.observe(s));

/* ================================================================
   FLOATING INSTAGRAM BUTTON
   ================================================================ */
floatIgBtn.addEventListener('click', () => {
  const open = floatIgMenu.classList.toggle('open');
  floatIgBtn.setAttribute('aria-expanded', open);
});
document.addEventListener('click', e => {
  if (!e.target.closest('.float-ig')) {
    floatIgMenu.classList.remove('open');
    floatIgBtn.setAttribute('aria-expanded','false');
  }
});
copyUsername.addEventListener('click', () => {
  copyToClipboard('@stickerversz');
  floatIgMenu.classList.remove('open');
});

/* ================================================================
   CLIPBOARD UTILITY
   ================================================================ */
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied: ${text}`);
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 2000);
    }
  }).catch(() => {
    /* Fallback for older browsers */
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`Copied: ${text}`);
  });
}

/* ================================================================
   TOAST
   ================================================================ */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ================================================================
   REVEAL ANIMATIONS (Intersection Observer)
   ================================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ================================================================
   HERO COUNTER ANIMATION
   ================================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const suffix = el.querySelector('span')?.textContent || '';
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    const span = document.createElement('span');
    span.textContent = suffix;
    el.appendChild(span);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ================================================================
   SMOOTH SCROLL for anchor links
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ================================================================
   LAZY IMAGE LOADING (for future real images)
   ================================================================ */
function observeImages() {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.addEventListener('load', () => img.classList.add('loaded'));
          imgObserver.unobserve(img);
        }
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ================================================================
   ORDER BAR
   ================================================================ */
const orderBar    = document.getElementById('orderBar');
const orderChips  = document.getElementById('orderChips');
const orderCount  = document.getElementById('orderCount');
const clearOrder  = document.getElementById('clearOrder');
const copyAllIds  = document.getElementById('copyAllIds');

/* Toggle a sticker ID in/out of the selection */
function toggleId(id, btn) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
  } else {
    selectedIds.add(id);
  }
  /* Sync every visible card button for this id */
  document.querySelectorAll(`.card-add-btn[data-id="${id}"]`).forEach(b => syncBtn(b, selectedIds.has(id)));
  renderOrderBar();
  if (btn) syncBtn(btn, selectedIds.has(id));
}

/* Update a single card button's visual state */
function syncBtn(btn, added) {
  const plusSVG  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  const checkSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
  btn.classList.toggle('added', added);
  btn.setAttribute('aria-label', `${added ? 'Remove' : 'Add'} sticker ${btn.dataset.id}`);
  btn.innerHTML = added ? `${checkSVG} Added` : `${plusSVG} Add ID`;
}

/* Remove one ID via chip × button */
function removeId(id) {
  selectedIds.delete(id);
  document.querySelectorAll(`.card-add-btn[data-id="${id}"]`).forEach(b => syncBtn(b, false));
  renderOrderBar();
}

/* Rebuild the chip list and toggle bar visibility */
function renderOrderBar() {
  const ids = [...selectedIds];
  const count = ids.length;

  orderCount.textContent = count;
  orderCount.classList.add('bump');
  setTimeout(() => orderCount.classList.remove('bump'), 300);

  if (count === 0) {
    orderBar.classList.remove('open');
    document.body.classList.remove('bar-open');
    orderChips.innerHTML = '';
    return;
  }

  orderBar.classList.add('open');
  document.body.classList.add('bar-open');

  orderChips.innerHTML = ids.map(id => `
    <div class="order-chip" role="listitem">
      <span class="order-chip-id">${id}</span>
      <button class="order-chip-remove" data-id="${id}" aria-label="Remove ${id}" title="Remove">×</button>
    </div>
  `).join('');

  orderChips.querySelectorAll('.order-chip-remove').forEach(btn => {
    btn.addEventListener('click', () => removeId(btn.dataset.id));
  });

  /* Auto-scroll chips to the newest entry */
  orderChips.scrollLeft = orderChips.scrollWidth;
}

/* Clear all */
clearOrder.addEventListener('click', () => {
  selectedIds.clear();
  document.querySelectorAll('.card-add-btn.added').forEach(b => syncBtn(b, false));
  renderOrderBar();
});

/* Copy all IDs */
copyAllIds.addEventListener('click', () => {
  if (!selectedIds.size) return;
  const text = [...selectedIds].join(', ');
  copyToClipboard(text);
  copyAllIds.textContent = '✓ Copied!';
  setTimeout(() => {
    copyAllIds.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy All IDs`;
  }, 2000);
});

/* ================================================================
   INIT
   ================================================================ */
function init() {
  renderGrid();
  observeImages();
}

document.addEventListener('DOMContentLoaded', init);
