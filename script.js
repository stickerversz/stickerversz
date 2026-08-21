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
  series: { from:'#1a0010', to:'#3d0028', accent:'#fb7185' },
  kdrama: { from:'#1a0030', to:'#3a0050', accent:'#f9a8d4' },
  cartoon: { from:'#002820', to:'#005840', accent:'#34d399' },
  others: { from:'#050520', to:'#0f1535', accent:'#7dd3fc' },
};

/* ─── State ─── */
let activeFilter = 'all';
let searchQuery  = '';
const selectedQtys = new Map(); // id → quantity

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

/* ── SERIES ── clapperboard · film strip · TV screen · stars · spotlight */
  svgs.series = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a0010"/><stop offset="100%" stop-color="#3d0028"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<path d="M0 0 L260 300 L180 300 Z" fill="#fb7185" opacity=".04"/>
<rect x="0" y="0" width="20" height="300" fill="#000" opacity=".4"/>
<rect x="3" y="10" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="3" y="48" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="3" y="86" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="3" y="124" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="3" y="162" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="3" y="200" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="3" y="238" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="278" y="0" width="22" height="300" fill="#000" opacity=".4"/>
<rect x="281" y="10" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="281" y="48" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="281" y="86" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="281" y="124" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="281" y="162" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="281" y="200" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="281" y="238" width="14" height="20" rx="2" fill="#111" stroke="#fb7185" stroke-width="1" opacity=".55"/>
<rect x="60" y="170" width="130" height="90" rx="8" fill="none" stroke="#fb7185" stroke-width="2" opacity=".35"/>
<line x1="60" y1="188" x2="190" y2="188" stroke="#fb7185" stroke-width="1" opacity=".2"/>
<circle cx="72" cy="180" r="4" fill="#fb7185" opacity=".35"/>
<circle cx="85" cy="180" r="4" fill="#fda4af" opacity=".3"/>
<rect x="65" y="195" width="50" height="8" rx="2" fill="#fb7185" opacity=".18"/>
<rect x="65" y="210" width="70" height="6" rx="2" fill="#fda4af" opacity=".14"/>
<rect x="65" y="222" width="40" height="6" rx="2" fill="#fb7185" opacity=".14"/>
<rect x="60" y="130" width="130" height="28" rx="4" fill="#fb7185" opacity=".18"/>
<line x1="60" y1="130" x2="190" y2="158" stroke="#fb7185" stroke-width="1" opacity=".25"/>
<rect x="70" y="120" width="110" height="12" rx="2" fill="#000" opacity=".5"/>
<line x1="85" y1="120" x2="85" y2="132" stroke="#fb7185" stroke-width="2" opacity=".4"/>
<line x1="105" y1="120" x2="105" y2="132" stroke="#fb7185" stroke-width="2" opacity=".4"/>
<line x1="125" y1="120" x2="125" y2="132" stroke="#fb7185" stroke-width="2" opacity=".4"/>
<line x1="145" y1="120" x2="145" y2="132" stroke="#fb7185" stroke-width="2" opacity=".4"/>
<line x1="165" y1="120" x2="165" y2="132" stroke="#fb7185" stroke-width="2" opacity=".4"/>
<path d="M112 50 L130 22 L150 37 L170 22 L188 50 Z" fill="none" stroke="#fb7185" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="48" width="80" height="11" rx="3" fill="#fb7185" opacity=".52"/>
<path d="M242 62 L246 52 L250 62 L260 66 L250 70 L246 80 L242 70 L232 66 Z" fill="#fb7185" opacity=".65"/>
<path d="M38 208 L42 199 L46 208 L56 212 L46 216 L42 226 L38 216 L28 212 Z" fill="#fda4af" opacity=".55"/>
<path d="M268 220 L271 213 L274 220 L281 223 L274 226 L271 233 L268 226 L261 223 Z" fill="#fb7185" opacity=".5"/>
<path d="M248 160 L240 183 L248 183 L239 207 L258 175 L248 175 Z" fill="#fb7185" opacity=".55"/>
<circle cx="212" cy="82" r="5" fill="#fb7185" opacity=".38"/>
<circle cx="82" cy="98" r="4" fill="#fda4af" opacity=".36"/>
<circle cx="232" cy="248" r="5.5" fill="#fb7185" opacity=".3"/>
<circle cx="168" cy="262" r="3.5" fill="#fda4af" opacity=".38"/>
</svg>`;

/* ── K-DRAMA ── cherry blossoms · hearts · ribbon · lantern · crown */
  svgs.kdrama = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a0030"/><stop offset="100%" stop-color="#3a0050"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<path d="M150 0 L300 300 L0 300 Z" fill="#f9a8d4" opacity=".03"/>
<path d="M112 50 L130 22 L150 37 L170 22 L188 50 Z" fill="none" stroke="#f9a8d4" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="48" width="80" height="11" rx="3" fill="#f9a8d4" opacity=".52"/>
<ellipse cx="48" cy="72" rx="14" ry="9" fill="#f9a8d4" opacity=".5" transform="rotate(-25 48 72)"/>
<ellipse cx="252" cy="88" rx="12" ry="8" fill="#fbcfe8" opacity=".45" transform="rotate(18 252 88)"/>
<ellipse cx="78" cy="228" rx="13" ry="9" fill="#f9a8d4" opacity=".42" transform="rotate(-30 78 228)"/>
<ellipse cx="258" cy="238" rx="11" ry="8" fill="#fbcfe8" opacity=".38" transform="rotate(22 258 238)"/>
<ellipse cx="162" cy="278" rx="12" ry="8" fill="#f9a8d4" opacity=".35" transform="rotate(8 162 278)"/>
<ellipse cx="118" cy="118" rx="10" ry="7" fill="#fbcfe8" opacity=".32" transform="rotate(-15 118 118)"/>
<path d="M50 105 C50 98 58 93 66 100 C74 93 82 98 82 105 C82 117 66 128 66 128 C66 128 50 117 50 105 Z" fill="#f9a8d4" opacity=".5"/>
<path d="M218 198 C218 192 225 188 231 194 C237 188 244 192 244 198 C244 210 231 220 231 220 C231 220 218 210 218 198 Z" fill="#fbcfe8" opacity=".45"/>
<path d="M244 68 C244 63 249 59 254 64 C259 59 264 63 264 68 C264 78 254 86 254 86 C254 86 244 78 244 68 Z" fill="#f9a8d4" opacity=".42"/>
<path d="M32 232 C32 228 36 224 41 229 C46 224 50 228 50 232 C50 240 41 247 41 247 C41 247 32 240 32 232 Z" fill="#fbcfe8" opacity=".38"/>
<path d="M148 168 C148 162 155 158 161 164 C167 158 174 162 174 168 C174 180 161 190 161 190 C161 190 148 180 148 168 Z" fill="#f9a8d4" opacity=".32"/>
<path d="M0 262 Q40 240 80 262 Q120 284 160 262 Q200 240 240 262 Q270 278 300 262" fill="none" stroke="#f9a8d4" stroke-width="2" opacity=".2"/>
<path d="M0 278 Q40 258 80 278 Q120 298 160 278" fill="none" stroke="#fbcfe8" stroke-width="1.5" opacity=".16"/>
<path d="M33 150 L36 142 L39 150 L47 153 L39 156 L36 164 L33 156 L25 153 Z" fill="#f9a8d4" opacity=".7"/>
<path d="M258 140 L261 132 L264 140 L272 143 L264 146 L261 154 L258 146 L250 143 Z" fill="#fbcfe8" opacity=".65"/>
<path d="M164 264 L166 258 L168 264 L174 266 L168 268 L166 274 L164 268 L158 266 Z" fill="#f9a8d4" opacity=".58"/>
<path d="M272 30 L274 24 L276 30 L282 32 L276 34 L274 40 L272 34 L266 32 Z" fill="#fbcfe8" opacity=".62"/>
<path d="M268 158 L260 181 L268 181 L259 205 L278 174 L269 174 Z" fill="#f9a8d4" opacity=".52"/>
<circle cx="130" cy="112" r="5" fill="#f9a8d4" opacity=".4"/>
<circle cx="196" cy="138" r="3.5" fill="#fbcfe8" opacity=".38"/>
<circle cx="82" cy="182" r="4" fill="#f9a8d4" opacity=".38"/>
<circle cx="218" cy="92" r="3" fill="#fbcfe8" opacity=".42"/>
<circle cx="148" cy="242" r="5" fill="#f9a8d4" opacity=".3"/>
</svg>`;

/* ── OTHERS ── stars · question marks · planets · sparkles · cosmic */
  svgs.others = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#050520"/><stop offset="100%" stop-color="#0f1535"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<circle cx="200" cy="220" r="60" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity=".18"/>
<circle cx="200" cy="220" r="40" fill="none" stroke="#7dd3fc" stroke-width="1" opacity=".15"/>
<ellipse cx="200" cy="220" rx="80" ry="18" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity=".22"/>
<circle cx="200" cy="220" r="22" fill="#7dd3fc" opacity=".15"/>
<circle cx="200" cy="220" r="8" fill="#38bdf8" opacity=".35"/>
<path d="M52 82 Q52 65 68 65 Q84 65 84 80 Q84 91 68 96 L68 106" fill="none" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round" opacity=".48"/>
<circle cx="68" cy="116" r="4" fill="#7dd3fc" opacity=".48"/>
<path d="M218 162 Q218 148 231 148 Q244 148 244 161 Q244 171 231 175 L231 183" fill="none" stroke="#bae6fd" stroke-width="3.5" stroke-linecap="round" opacity=".42"/>
<circle cx="231" cy="191" r="3.5" fill="#bae6fd" opacity=".42"/>
<path d="M82 192 Q82 180 93 180 Q104 180 104 191 Q104 200 93 204 L93 211" fill="none" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round" opacity=".36"/>
<circle cx="93" cy="218" r="3" fill="#7dd3fc" opacity=".36"/>
<path d="M112 50 L130 22 L150 37 L170 22 L188 50 Z" fill="none" stroke="#7dd3fc" stroke-width="3.5" stroke-linejoin="round" opacity=".72"/>
<rect x="110" y="48" width="80" height="11" rx="3" fill="#7dd3fc" opacity=".52"/>
<path d="M33 148 L36 140 L39 148 L47 151 L39 154 L36 162 L33 154 L25 151 Z" fill="#7dd3fc" opacity=".7"/>
<path d="M259 60 L262 52 L265 60 L273 63 L265 66 L262 74 L259 66 L251 63 Z" fill="#bae6fd" opacity=".62"/>
<path d="M262 230 L265 222 L268 230 L276 233 L268 236 L265 244 L262 236 L254 233 Z" fill="#7dd3fc" opacity=".55"/>
<path d="M268 145 L260 168 L268 168 L259 192 L278 160 L268 160 Z" fill="#7dd3fc" opacity=".52"/>
<rect x="38" y="200" width="6" height="6" fill="#7dd3fc" opacity=".42"/>
<rect x="42" y="196" width="6" height="6" fill="#7dd3fc" opacity=".42"/>
<rect x="42" y="204" width="6" height="6" fill="#7dd3fc" opacity=".42"/>
<rect x="262" y="100" width="6" height="6" fill="#bae6fd" opacity=".38"/>
<rect x="266" y="96" width="6" height="6" fill="#bae6fd" opacity=".38"/>
<rect x="266" y="104" width="6" height="6" fill="#bae6fd" opacity=".38"/>
<circle cx="122" cy="108" r="2.5" fill="#7dd3fc" opacity=".55"/>
<circle cx="188" cy="82" r="2" fill="#bae6fd" opacity=".5"/>
<circle cx="62" cy="152" r="3" fill="#7dd3fc" opacity=".42"/>
<circle cx="248" cy="182" r="2.5" fill="#bae6fd" opacity=".42"/>
<circle cx="138" cy="252" r="2" fill="#7dd3fc" opacity=".48"/>
<circle cx="58" cy="252" r="3.5" fill="#7dd3fc" opacity=".3"/>
<circle cx="242" cy="52" r="2.5" fill="#bae6fd" opacity=".42"/>
<circle cx="42" cy="72" r="2" fill="#7dd3fc" opacity=".38"/>
<circle cx="272" cy="272" r="3" fill="#7dd3fc" opacity=".35"/>
</svg>`;

  /* ── CARTOON ── speech bubbles · comic stars · halftone dots · action marks · bold outlines */
  svgs.cartoon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" style="position:absolute;inset:0" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#002820"/><stop offset="100%" stop-color="#005840"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#${g})"/>
<!-- halftone dot grid -->
<circle cx="20"  cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="50"  cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="80"  cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="110" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="140" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="170" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="200" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="230" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="260" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="290" cy="20"  r="2.5" fill="#34d399" opacity=".18"/>
<circle cx="35"  cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="65"  cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="95"  cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="125" cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="155" cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="185" cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="215" cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="245" cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="275" cy="45"  r="2.5" fill="#34d399" opacity=".15"/>
<circle cx="20"  cy="70"  r="2"   fill="#34d399" opacity=".12"/>
<circle cx="50"  cy="70"  r="2"   fill="#34d399" opacity=".12"/>
<circle cx="80"  cy="70"  r="2"   fill="#34d399" opacity=".12"/>
<circle cx="110" cy="70"  r="2"   fill="#34d399" opacity=".12"/>
<circle cx="260" cy="70"  r="2"   fill="#34d399" opacity=".12"/>
<circle cx="290" cy="70"  r="2"   fill="#34d399" opacity=".12"/>
<!-- speech bubble top-left -->
<rect x="18" y="88" width="72" height="42" rx="10" fill="#34d399" opacity=".22" stroke="#34d399" stroke-width="2"/>
<polygon points="28,130 18,148 42,130" fill="#34d399" opacity=".22"/>
<circle cx="34" cy="109" r="4" fill="#34d399" opacity=".5"/>
<circle cx="54" cy="109" r="4" fill="#34d399" opacity=".5"/>
<circle cx="74" cy="109" r="4" fill="#34d399" opacity=".5"/>
<!-- speech bubble top-right -->
<rect x="210" y="72" width="78" height="44" rx="10" fill="#6ee7b7" opacity=".18" stroke="#6ee7b7" stroke-width="2"/>
<polygon points="268,116 288,134 258,116" fill="#6ee7b7" opacity=".18"/>
<line x1="222" y1="88"  x2="276" y2="88"  stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round" opacity=".45"/>
<line x1="222" y1="100" x2="262" y2="100" stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round" opacity=".38"/>
<line x1="222" y1="112" x2="270" y2="112" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round" opacity=".32"/>
<!-- comic action star (POW) top-right corner -->
<path d="M248 18 L252 8 L256 18 L266 14 L260 22 L270 26 L260 28 L264 38 L254 32 L252 42 L250 32 L240 38 L244 28 L234 26 L244 22 L238 14 Z" fill="#fbbf24" opacity=".72" stroke="#92400e" stroke-width="1.2" stroke-linejoin="round"/>
<!-- comic action star (ZAP) bottom-left -->
<path d="M38 238 L42 226 L46 238 L58 233 L51 243 L62 248 L51 250 L56 262 L44 255 L42 268 L40 255 L28 262 L33 250 L22 248 L33 243 L26 233 Z" fill="#f472b6" opacity=".65" stroke="#831843" stroke-width="1.2" stroke-linejoin="round"/>
<!-- small comic sparkle stars -->
<path d="M158 34 L160 28 L162 34 L168 36 L162 38 L160 44 L158 38 L152 36 Z" fill="#fde68a" opacity=".78"/>
<path d="M22 178 L24 172 L26 178 L32 180 L26 182 L24 188 L22 182 L16 180 Z" fill="#fde68a" opacity=".68"/>
<path d="M278 168 L280 162 L282 168 L288 170 L282 172 L280 178 L278 172 L272 170 Z" fill="#fde68a" opacity=".72"/>
<path d="M134 268 L136 263 L138 268 L143 270 L138 272 L136 277 L134 272 L129 270 Z" fill="#a7f3d0" opacity=".65"/>
<!-- lightning bolt action mark -->
<path d="M268 178 L261 198 L268 198 L260 222 L278 194 L270 194 Z" fill="#34d399" opacity=".62" stroke="#065f46" stroke-width="1"/>
<!-- squiggly underline -->
<path d="M80 272 Q90 266 100 272 Q110 278 120 272 Q130 266 140 272 Q150 278 160 272 Q170 266 180 272 Q190 278 200 272 Q210 266 220 272" stroke="#34d399" stroke-width="2.5" fill="none" opacity=".4" stroke-linecap="round"/>
<!-- small thought bubble -->
<circle cx="182" cy="228" r="3"  fill="#6ee7b7" opacity=".38"/>
<circle cx="192" cy="222" r="4.5" fill="#6ee7b7" opacity=".32"/>
<circle cx="204" cy="215" r="6.5" fill="#6ee7b7" opacity=".26"/>
<circle cx="218" cy="206" r="9" fill="#6ee7b7" opacity=".2" stroke="#6ee7b7" stroke-width="1.5"/>
<!-- scattered dots -->
<circle cx="102" cy="158" r="3"   fill="#34d399" opacity=".35"/>
<circle cx="192" cy="148" r="2.5" fill="#6ee7b7" opacity=".35"/>
<circle cx="68"  cy="198" r="2"   fill="#34d399" opacity=".3"/>
<circle cx="238" cy="258" r="2.5" fill="#6ee7b7" opacity=".3"/>
<circle cx="152" cy="188" r="2"   fill="#34d399" opacity=".28"/>
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
      <div class="card-img-bg"><img class="card-bg-img" src="${s.category}.svg" alt="" aria-hidden="true" loading="lazy"></div>
      ${s.image
        ? `<img class="card-img-photo" src="${s.image}" alt="${s.name}" loading="lazy">`
        : `<div class="card-img-emoji" aria-hidden="true">${s.emoji}</div>`}
      ${s.isNew ? '<div class="card-new-badge" aria-label="New sticker">New</div>' : ''}
      <div class="card-waterproof" aria-label="Waterproof sticker">💧 Waterproof</div>
      <div class="card-qty-ctrl" data-qty-id="${s.id}"></div>
    </div>
    <div class="card-body">
      <div class="card-meta-row">
        <p class="card-category">${s.category}</p>
        <p class="card-price" aria-label="Price: ${s.price ?? 1} MAD">${s.price ?? 1} MAD</p>
      </div>
      <h3 class="card-name" title="${s.name}">${s.name}</h3>
      <p class="card-id">${s.id}</p>
    </div>
  `;

  /* Render initial qty control and wire events */
  const ctrl = article.querySelector('.card-qty-ctrl');
  renderQtyCtrl(ctrl, s.id, getQty(s.id));
  ctrl.addEventListener('click', e => {
    e.stopPropagation();
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.classList.contains('card-add-btn'))  setQty(s.id, 1);
    if (btn.classList.contains('qty-dec'))        setQty(s.id, getQty(s.id) - 1);
    if (btn.classList.contains('qty-inc'))        setQty(s.id, getQty(s.id) + 1);
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
      showToast(`Selected: ${s.id}`);
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
/* Theme is fixed to warm cream — no toggle needed */

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

/* ── Quantity helpers ── */
function getQty(id) { return selectedQtys.get(id) ?? 0; }

function setQty(id, qty) {
  if (qty <= 0) {
    selectedQtys.delete(id);
  } else {
    selectedQtys.set(id, qty);
  }
  /* Sync every visible qty control for this id */
  document.querySelectorAll(`.card-qty-ctrl[data-qty-id="${id}"]`).forEach(ctrl => {
    renderQtyCtrl(ctrl, id, getQty(id));
  });
  renderOrderBar();
}

function renderQtyCtrl(el, id, qty) {
  if (qty === 0) {
    el.classList.remove('has-qty');
    el.innerHTML = `<button class="card-add-btn" aria-label="Add sticker ${id} to cart">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      Add to Cart
    </button>`;
  } else {
    el.classList.add('has-qty');
    el.innerHTML = `
      <button class="qty-dec" aria-label="Decrease quantity for ${id}">−</button>
      <span class="qty-num" aria-live="polite">${qty}</span>
      <button class="qty-inc" aria-label="Increase quantity for ${id}">+</button>`;
  }
}

/* Remove one sticker entirely via chip × button */
function removeId(id) {
  selectedQtys.delete(id);
  document.querySelectorAll(`.card-qty-ctrl[data-qty-id="${id}"]`).forEach(ctrl => {
    renderQtyCtrl(ctrl, id, 0);
  });
  renderOrderBar();
}

/* Rebuild the chip list and toggle bar visibility */
function renderOrderBar() {
  const entries = [...selectedQtys.entries()];
  const totalItems = entries.reduce((s, [, q]) => s + q, 0);

  /* Update nav cart badge */
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
    badge.dataset.empty = totalItems === 0 ? 'true' : 'false';
  }

  /* Keep the old bottom bar hidden — cart drawer replaces it */
  if (orderBar) orderBar.classList.remove('open');
  if (orderCount) orderCount.textContent = totalItems;

  /* Re-render cart drawer if it's currently open */
  if (cartDrawer && cartDrawer.classList.contains('is-open')) {
    renderCartDrawer();
  }
}

/* Clear all */
clearOrder.addEventListener('click', () => {
  const ids = [...selectedQtys.keys()];
  selectedQtys.clear();
  ids.forEach(id => {
    document.querySelectorAll(`.card-qty-ctrl[data-qty-id="${id}"]`).forEach(ctrl => {
      renderQtyCtrl(ctrl, id, 0);
    });
  });
  renderOrderBar();
});

/* Copy all IDs with quantities */
copyAllIds.addEventListener('click', () => {
  if (!selectedQtys.size) return;
  const entries = [...selectedQtys.entries()];
  const total = entries.reduce((sum, [id, qty]) => {
    const sticker = STICKERS.find(s => s.id === id);
    return sum + (sticker?.price ?? 1) * qty;
  }, 0);
  const lines = entries.map(([id, qty]) => `${id} × ${qty}`).join(', ');
  const text = `HELLO I WANT TO ORDER:\n${lines}\nTotal: ${total} MAD`;
  copyToClipboard(text);
  copyAllIds.textContent = '✓ Copied!';
  setTimeout(() => {
    copyAllIds.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy All IDs`;
  }, 2000);
});

/* ================================================================
   INIT — loads stickers from API when server is running,
   falls back to the static stickers.js array otherwise
   ================================================================ */
async function init() {
  try {
    const res = await fetch('/api/stickers');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        /* Replace static array with live database data */
        STICKERS.length = 0;
        data.forEach(s => STICKERS.push(s));
      }
    }
  } catch {
    /* Server not running — static stickers.js array is used as-is */
  }
  renderGrid();
  observeImages();
}

document.addEventListener('DOMContentLoaded', init);

/* ================================================================
   CART DRAWER
   ================================================================ */
const cartDrawer   = document.getElementById('cartDrawer');
const cartOverlay  = document.getElementById('cartOverlay');
const cartToggle   = document.getElementById('cartToggle');
const cartClose    = document.getElementById('cartClose');
const cartEmptyState = document.getElementById('cartEmptyState');
const cartItemsList  = document.getElementById('cartItemsList');
const cartFooter     = document.getElementById('cartFooter');
const cartItemCount  = document.getElementById('cartItemCount');
const cartTotalPrice = document.getElementById('cartTotalPrice');

function openCart() {
  cartDrawer.classList.add('is-ready');
  requestAnimationFrame(() => cartDrawer.classList.add('is-open'));
  cartOverlay.classList.add('open');
  renderCartDrawer();
  document.body.style.overflow = 'hidden';
  cartClose.focus();
}

function closeCart() {
  cartDrawer.classList.remove('is-open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => cartDrawer.classList.remove('is-ready'), 350);
}

cartToggle.addEventListener('click', () => {
  cartDrawer.classList.contains('is-open') ? closeCart() : openCart();
});
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && cartDrawer.classList.contains('is-open')) closeCart();
});

function renderCartDrawer() {
  const entries = [...selectedQtys.entries()];
  const totalItems = entries.reduce((s, [, q]) => s + q, 0);
  const total = entries.reduce((sum, [id, qty]) => {
    const sticker = STICKERS.find(s => s.id === id);
    return sum + (sticker?.price ?? 1) * qty;
  }, 0);

  const isEmpty = entries.length === 0;
  cartEmptyState.hidden = !isEmpty;
  cartItemsList.hidden = isEmpty;
  cartFooter.hidden = isEmpty;

  if (isEmpty) return;

  /* Update footer */
  cartItemCount.textContent = `${totalItems} sticker${totalItems !== 1 ? 's' : ''}`;
  cartTotalPrice.textContent = `${total} MAD`;

  /* Build item rows */
  cartItemsList.innerHTML = entries.map(([id, qty]) => {
    const sticker = STICKERS.find(s => s.id === id);
    const name    = sticker?.name ?? id;
    const price   = sticker?.price ?? 1;
    const lineTotal = price * qty;
    const thumb   = sticker?.image
      ? `<img src="${sticker.image}" alt="${name}" loading="lazy">`
      : `<span aria-hidden="true">${sticker?.emoji ?? '🎨'}</span>`;

    return `
      <div class="cart-item" data-cart-id="${id}">
        <div class="cart-item-thumb">${thumb}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${name}</p>
          <p class="cart-item-id">${id}</p>
          <p class="cart-item-price">${lineTotal} MAD</p>
        </div>
        <div class="cart-item-controls">
          <button class="cart-item-dec" data-id="${id}" aria-label="Decrease ${name}">−</button>
          <span class="cart-item-qty" aria-live="polite">${qty}</span>
          <button class="cart-item-inc" data-id="${id}" aria-label="Increase ${name}">+</button>
        </div>
        <button class="cart-item-remove" data-id="${id}" aria-label="Remove ${name} from cart" title="Remove">✕</button>
      </div>`;
  }).join('');

  /* Wire cart item buttons */
  cartItemsList.querySelectorAll('.cart-item-dec').forEach(btn => {
    btn.addEventListener('click', () => setQty(btn.dataset.id, getQty(btn.dataset.id) - 1));
  });
  cartItemsList.querySelectorAll('.cart-item-inc').forEach(btn => {
    btn.addEventListener('click', () => setQty(btn.dataset.id, getQty(btn.dataset.id) + 1));
  });
  cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => { removeId(btn.dataset.id); renderCartDrawer(); });
  });
}

/* ================================================================
   INSTAGRAM ORDER
   ================================================================ */
const igOrderBtn      = document.getElementById('igOrderBtn');
const igModalOverlay  = document.getElementById('igModalOverlay');
const igModal         = document.getElementById('igModal');
const igModalClose    = document.getElementById('igModalClose');
const igModalPreview  = document.getElementById('igModalPreview');

function buildOrderMessage() {
  const entries = [...selectedQtys.entries()];
  const total = entries.reduce((sum, [id, qty]) => {
    const sticker = STICKERS.find(s => s.id === id);
    return sum + (sticker?.price ?? 1) * qty;
  }, 0);

  const lines = entries.map(([id, qty]) => {
    const sticker = STICKERS.find(s => s.id === id);
    const name = sticker?.name ?? id;
    const price = (sticker?.price ?? 1) * qty;
    return `• ${id} — ${name} × ${qty} = ${price} MAD`;
  }).join('\n');

  return `Hello! I'd like to order the following stickers from @stickerversz:\n\n${lines}\n\n💰 Total: ${total} MAD\n\nPlease confirm availability and let me know the delivery details. Thank you! 🎉`;
}

function openIgModal(message) {
  igModalPreview.textContent = message;
  igModal.hidden = false;
  igModalOverlay.classList.add('open');
  igModal.classList.add('open');
  igModalClose.focus();
}

function closeIgModal() {
  igModalOverlay.classList.remove('open');
  igModal.classList.remove('open');
  setTimeout(() => { igModal.hidden = true; }, 300);
}

igOrderBtn.addEventListener('click', () => {
  if (!selectedQtys.size) return;
  closeCart();
  openCheckout();
});

igModalOverlay.addEventListener('click', e => { if (e.target === igModalOverlay) closeIgModal(); });
igModalClose.addEventListener('click', closeIgModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !igModal.hidden) closeIgModal();
});

/* ================================================================
   SPECIAL OFFERS — FREE STICKER SYSTEM
   ================================================================ */

/* State: Map of id → qty chosen as free */
const freeStickers = new Map();

/* Promo tier rules */
const PROMO_TIERS = [
  { min: 10, max: 14, free: 1  },
  { min: 15, max: 24, free: 3  },
  { min: 25, max: 34, free: 5  },
  { min: 35, max: Infinity, free: 10 },
];

function getTotalQty() {
  return [...selectedQtys.values()].reduce((s, q) => s + q, 0);
}

function getCurrentTier(qty) {
  return PROMO_TIERS.slice().reverse().find(t => qty >= t.min) ?? null;
}

function getNextTier(qty) {
  return PROMO_TIERS.find(t => qty < t.min) ?? null;
}

function countFreePicked() {
  return [...freeStickers.values()].reduce((s, q) => s + q, 0);
}

function getFreeSlots() {
  const tier = getCurrentTier(getTotalQty());
  return tier ? tier.free : 0;
}

/* ── Highlight active promo tier on the page banner ── */
function syncPromoBanner() {
  const qty = getTotalQty();
  document.querySelectorAll('.promo-tier').forEach((el, i) => {
    const tier = PROMO_TIERS[i];
    el.classList.toggle('active', tier && qty >= tier.min && qty <= tier.max);
  });
}

/* ── Render promo progress bar inside the cart ── */
function renderCartPromo() {
  const qty = getTotalQty();
  const promoBar = document.getElementById('cartPromoBar');
  const promoFill = document.getElementById('cartPromoFill');
  const promoLabel = document.getElementById('cartPromoLabel');
  const freeSection = document.getElementById('cartFreeSection');
  const freeTitle = document.getElementById('cartFreeTitle');
  const freeRow = document.getElementById('cartFreeRow');
  const freeCountEl = document.getElementById('cartFreeCount');

  if (!promoBar) return;

  const currentTier = getCurrentTier(qty);
  const nextTier = getNextTier(qty);
  const freeSlots = getFreeSlots();

  /* Progress bar — show progress to next tier, or full if at max */
  promoBar.hidden = qty === 0;
  if (qty > 0) {
    let pct, label;
    if (currentTier && !nextTier) {
      /* Max tier reached */
      pct = 100;
      label = `🎉 Max offer! You get <strong>${currentTier.free} free stickers</strong>!`;
    } else if (currentTier && nextTier) {
      /* Between tiers — show progress to next */
      const needed = nextTier.min - qty;
      pct = Math.min(100, ((qty - currentTier.min) / (nextTier.min - currentTier.min)) * 100 + 60);
      label = `You get <strong>${currentTier.free} free</strong> now! Add <em>${needed} more</em> to unlock ${nextTier.free} free stickers 🎁`;
    } else if (nextTier) {
      /* No tier yet */
      const needed = nextTier.min - qty;
      pct = Math.min(95, (qty / nextTier.min) * 100);
      label = `Add <em>${needed} more sticker${needed > 1 ? 's' : ''}</em> to get <strong>1 free sticker</strong> 🎁`;
    } else {
      pct = 0; label = '';
    }
    if (promoFill) promoFill.style.width = pct + '%';
    if (promoLabel) promoLabel.innerHTML = label;
  }

  /* Free sticker section */
  if (freeSection) {
    freeSection.hidden = freeSlots === 0;
    if (freeSlots > 0) {
      const picked = countFreePicked();
      if (freeTitle) freeTitle.textContent = `You earned ${freeSlots} free sticker${freeSlots > 1 ? 's' : ''}! (${picked}/${freeSlots} chosen)`;
      renderFreeChips();

      /* Update pick button label */
      const pickBtn = document.getElementById('cartFreePickBtn');
      if (pickBtn) {
        const remaining = freeSlots - picked;
        pickBtn.textContent = remaining > 0
          ? `+ Choose ${remaining} more free sticker${remaining > 1 ? 's' : ''}`
          : '✏️ Change free sticker selection';
        pickBtn.style.display = remaining === 0 && picked > 0 ? 'flex' : 'flex';
      }
    }
  }

  /* Free stickers row in summary */
  if (freeRow) freeRow.hidden = freeSlots === 0;
  if (freeCountEl) {
    const picked = countFreePicked();
    freeCountEl.textContent = `${picked}/${freeSlots} chosen (FREE)`;
  }

  syncPromoBanner();
}

/* Render free sticker chips inside the free section */
function renderFreeChips() {
  const container = document.getElementById('cartFreeItems');
  if (!container) return;

  if (freeStickers.size === 0) {
    container.innerHTML = '<span style="font-size:.75rem;color:var(--text-3)">No stickers chosen yet — click below to pick!</span>';
    return;
  }

  container.innerHTML = [...freeStickers.entries()].map(([id, qty]) => {
    const s = STICKERS.find(x => x.id === id);
    const name = s?.name ?? id;
    const times = qty > 1 ? ` ×${qty}` : '';
    return `<div class="cart-free-chip" data-free-id="${id}">
      ${name}${times}
      <button class="cart-free-chip-remove" data-free-id="${id}" aria-label="Remove ${name} from free selection">✕</button>
    </div>`;
  }).join('');

  container.querySelectorAll('.cart-free-chip-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      freeStickers.delete(btn.dataset.freeId);
      renderCartDrawer();
    });
  });
}

/* ── Override renderCartDrawer to include promo ── */
const _origRenderCartDrawer = renderCartDrawer;
window.renderCartDrawer = function () {
  _origRenderCartDrawer();
  renderCartPromo();
};

/* Also sync the banner whenever the grid loads */
const _origRenderGrid = renderGrid;
window.renderGrid = function () {
  _origRenderGrid();
  syncPromoBanner();
};

/* Hook into setQty to sync banner live */
const _origSetQty = setQty;
window.setQty = function (id, qty) {
  _origSetQty(id, qty);
  /* If free count exceeds new slots, trim freeStickers */
  const newSlots = getFreeSlots();
  let overflow = countFreePicked() - newSlots;
  if (overflow > 0) {
    for (const [fid, fqty] of [...freeStickers.entries()].reverse()) {
      if (overflow <= 0) break;
      const remove = Math.min(fqty, overflow);
      const newQty = fqty - remove;
      if (newQty <= 0) freeStickers.delete(fid);
      else freeStickers.set(fid, newQty);
      overflow -= remove;
    }
  }
  syncPromoBanner();
};

/* Wire "Choose free stickers" button */
document.getElementById('cartFreePickBtn')?.addEventListener('click', openFreePicker);

/* ================================================================
   FREE STICKER PICKER MODAL
   ================================================================ */
const freePickerOverlay  = document.getElementById('freePickerOverlay');
const freePickerModal    = document.getElementById('freePickerModal');
const freePickerClose    = document.getElementById('freePickerClose');
const freePickerConfirm  = document.getElementById('freePickerConfirm');
const freePickerGrid     = document.getElementById('freePickerGrid');
const freePickerSearch   = document.getElementById('freePickerSearch');
const freePickerSubEl    = document.getElementById('freePickerSub');
const freePickerCounter  = document.getElementById('freePickerCounter');
const freePickedCountEl  = document.getElementById('freePickedCount');
const freeSlotsCountEl   = document.getElementById('freeSlotsCount');

function openFreePicker() {
  freePickerModal.hidden = false;
  freePickerOverlay.classList.add('open');
  freePickerModal.classList.add('open');
  freePickerSearch.value = '';
  renderFreePickerGrid('');
  freePickerSearch.focus();
}

function closeFreePicker() {
  freePickerOverlay.classList.remove('open');
  freePickerModal.classList.remove('open');
  setTimeout(() => { freePickerModal.hidden = true; }, 300);
  renderCartDrawer();
}

function renderFreePickerGrid(query) {
  const slots = getFreeSlots();
  const picked = countFreePicked();
  const q = query.toLowerCase().trim();

  if (freeSlotsCountEl) freeSlotsCountEl.textContent = slots;
  if (freePickedCountEl) freePickedCountEl.textContent = picked;
  if (freePickerCounter) freePickerCounter.classList.toggle('full', picked >= slots);
  if (freePickerSubEl) {
    const rem = slots - picked;
    freePickerSubEl.textContent = rem > 0
      ? `Pick ${rem} more free sticker${rem > 1 ? 's' : ''} — any from the full catalog!`
      : `All ${slots} free sticker${slots > 1 ? 's' : ''} chosen ✓`;
  }

  const list = q
    ? STICKERS.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q))
    : STICKERS;

  const isFull = picked >= slots;

  freePickerGrid.innerHTML = list.map(s => {
    const pickedQty = freeStickers.get(s.id) ?? 0;
    const isPicked = pickedQty > 0;
    const isDisabled = !isPicked && isFull;
    const thumbHtml = s.image
      ? `<div class="free-picker-thumb"><img src="${s.image}" alt="${s.name}" loading="lazy"></div>`
      : ``;

    return `<div class="free-picker-card ${isPicked ? 'picked' : ''} ${isDisabled ? 'disabled' : ''}"
                 data-picker-id="${s.id}" role="button" tabindex="0"
                 aria-pressed="${isPicked}" aria-label="${s.name} — ${s.id}${isPicked ? ' (selected)' : ''}">
      ${thumbHtml}
      <p class="free-picker-card-name">${s.name}</p>
      <p class="free-picker-card-id">${s.id}</p>
    </div>`;
  }).join('');

  /* Wire clicks */
  freePickerGrid.querySelectorAll('.free-picker-card:not(.disabled)').forEach(card => {
    const handler = () => {
      const id = card.dataset.pickerId;
      const slots = getFreeSlots();
      const picked = countFreePicked();
      const currentQty = freeStickers.get(id) ?? 0;

      if (currentQty > 0) {
        /* Deselect */
        if (currentQty - 1 <= 0) freeStickers.delete(id);
        else freeStickers.set(id, currentQty - 1);
      } else if (picked < slots) {
        /* Select one more */
        freeStickers.set(id, (freeStickers.get(id) ?? 0) + 1);
      }
      renderFreePickerGrid(freePickerSearch.value);
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

freePickerSearch?.addEventListener('input', e => renderFreePickerGrid(e.target.value));
freePickerClose?.addEventListener('click', closeFreePicker);
freePickerOverlay?.addEventListener('click', e => { if (e.target === freePickerOverlay) closeFreePicker(); });
freePickerConfirm?.addEventListener('click', closeFreePicker);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !freePickerModal?.hidden) closeFreePicker();
});

/* ── Update order message to include free stickers ── */
const _origBuildOrderMessage = buildOrderMessage;
window.buildOrderMessage = function () {
  let msg = _origBuildOrderMessage();
  if (freeStickers.size > 0) {
    const freeLines = [...freeStickers.entries()]
      .map(([id, qty]) => {
        const s = STICKERS.find(x => x.id === id);
        const name = s?.name ?? id;
        return `• ${id} — ${name} × ${qty} (FREE 🎁)`;
      }).join('\n');
    msg += `\n\n🎁 FREE stickers (offer applied):\n${freeLines}`;
  }
  return msg;
};

/* Initial sync on page load */
document.addEventListener('DOMContentLoaded', () => {
  syncPromoBanner();
});

/* ================================================================
   CHECKOUT SYSTEM
   Collects customer info, submits order to backend, shows confirmation
   Falls back to Instagram DM flow if server is unavailable
   ================================================================ */

let deliveryZones = [];

/* Load delivery zones from API on page load */
async function loadDeliveryZones() {
  try {
    const res = await fetch('/api/delivery');
    if (res.ok) deliveryZones = await res.json();
  } catch { /* offline/static — no delivery zones from server */ }
}

/* Populate city select with zones */
function populateCitySelect(zones) {
  const select = document.getElementById('coCity');
  if (!select) return;
  select.innerHTML = '<option value="">Select your city…</option>';
  const sorted = [...zones].sort((a, b) => a.city.localeCompare(b.city));
  sorted.forEach(z => {
    const opt = document.createElement('option');
    opt.value = z.city;
    opt.dataset.price = z.price;
    opt.textContent = `${z.city} — ${z.price} MAD`;
    select.appendChild(opt);
  });
}

/* Get delivery fee for selected city */
function getDeliveryFee() {
  const select = document.getElementById('coCity');
  if (!select || !select.value) return 0;
  const opt = select.options[select.selectedIndex];
  return parseFloat(opt?.dataset.price || 0);
}

/* Build checkout order summary HTML */
function buildCheckoutSummary(deliveryFee) {
  const entries = [...selectedQtys.entries()];
  const subtotal = entries.reduce((sum, [id, qty]) => {
    const s = STICKERS.find(x => x.id === id);
    return sum + (s?.price ?? 3) * qty;
  }, 0);
  const total = subtotal + deliveryFee;

  const itemRows = entries.map(([id, qty]) => {
    const s = STICKERS.find(x => x.id === id);
    const name = s?.name ?? id;
    const price = (s?.price ?? 3) * qty;
    return `<div class="checkout-summary-row"><span>${name} × ${qty}</span><span>${price} MAD</span></div>`;
  }).join('');

  return `
    ${itemRows}
    <div class="checkout-summary-row"><span>Subtotal</span><span>${subtotal} MAD</span></div>
    <div class="checkout-summary-row"><span>Delivery</span><span>${deliveryFee > 0 ? deliveryFee + ' MAD' : '—'}</span></div>
    <div class="checkout-summary-row total"><span>Total</span><span>${total} MAD</span></div>
  `;
}

function openCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  if (!overlay) {
    /* Server not available — fall back to original Instagram DM flow */
    const message = buildOrderMessage();
    copyToClipboard(message);
    openIgModal(message);
    return;
  }
  overlay.hidden = false;
  overlay.removeAttribute('aria-hidden');

  /* Load delivery zones if not yet loaded */
  if (deliveryZones.length === 0) {
    loadDeliveryZones().then(() => populateCitySelect(deliveryZones));
  } else {
    populateCitySelect(deliveryZones);
  }

  /* Render initial summary (no delivery fee yet) */
  const summaryEl = document.getElementById('checkoutSummary');
  if (summaryEl) summaryEl.innerHTML = buildCheckoutSummary(0);

  /* Hide error */
  const errEl = document.getElementById('checkoutError');
  if (errEl) errEl.hidden = true;

  document.getElementById('coName')?.focus();
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  if (overlay) { overlay.hidden = true; overlay.setAttribute('aria-hidden', 'true'); }
  document.body.style.overflow = '';
}

/* Update summary when city changes */
document.getElementById('coCity')?.addEventListener('change', () => {
  const summaryEl = document.getElementById('checkoutSummary');
  if (summaryEl) summaryEl.innerHTML = buildCheckoutSummary(getDeliveryFee());
});

document.getElementById('checkoutClose')?.addEventListener('click', closeCheckout);
document.getElementById('checkoutOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
});

/* Handle checkout form submit */
document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const errEl = document.getElementById('checkoutError');
  const submitBtn = document.getElementById('checkoutSubmit');

  const name    = document.getElementById('coName')?.value.trim();
  const phone   = document.getElementById('coPhone')?.value.trim();
  const city    = document.getElementById('coCity')?.value;
  const address = document.getElementById('coAddress')?.value.trim();
  const notes   = document.getElementById('coNotes')?.value.trim();

  /* Validate */
  let hasError = false;
  [['coName', name], ['coPhone', phone], ['coCity', city], ['coAddress', address]].forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (!val) { el?.classList.add('invalid'); hasError = true; }
    else el?.classList.remove('invalid');
  });

  if (hasError) {
    if (errEl) { errEl.textContent = 'Please fill in all required fields.'; errEl.hidden = false; }
    return;
  }

  const deliveryFee = getDeliveryFee();
  const items = [...selectedQtys.entries()].map(([id, quantity]) => ({ id, quantity }));

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  if (errEl) errEl.hidden = true;

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name, customerPhone: phone, customerCity: city, customerAddress: address, customerNotes: notes, items, deliveryFee }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      /* Build and copy the DM message */
      const message = buildOrderMessage();
      copyToClipboard(message);

      /* Show confirmation */
      closeCheckout();
      const confOverlay = document.getElementById('orderConfirmedOverlay');
      const confNum = document.getElementById('orderConfirmedNum');
      if (confNum) confNum.textContent = `Order #${data.orderNumber} · ${data.total} MAD`;
      if (confOverlay) { confOverlay.hidden = false; document.body.style.overflow = 'hidden'; }

      /* Clear cart */
      const ids = [...selectedQtys.keys()];
      selectedQtys.clear();
      freeStickers.clear();
      ids.forEach(id => {
        document.querySelectorAll(`.card-qty-ctrl[data-qty-id="${id}"]`).forEach(ctrl => renderQtyCtrl(ctrl, id, 0));
      });
      renderOrderBar();
    } else {
      if (errEl) { errEl.textContent = data.error || 'Failed to place order. Please try again.'; errEl.hidden = false; }
    }
  } catch {
    /* Network error — fall back to Instagram DM */
    closeCheckout();
    const message = buildOrderMessage();
    copyToClipboard(message);
    openIgModal(message);
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

/* Close confirmed modal */
document.getElementById('closeConfirmed')?.addEventListener('click', () => {
  const overlay = document.getElementById('orderConfirmedOverlay');
  if (overlay) overlay.hidden = true;
  document.body.style.overflow = '';
});

/* Escape closes checkout */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('checkoutOverlay');
    if (overlay && !overlay.hidden) closeCheckout();
    const conf = document.getElementById('orderConfirmedOverlay');
    if (conf && !conf.hidden) { conf.hidden = true; document.body.style.overflow = ''; }
  }
});

/* Load delivery zones early */
document.addEventListener('DOMContentLoaded', loadDeliveryZones);
