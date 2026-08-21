'use strict';

/* ================================================================
   StickerVersz Admin SPA — admin.js
   ================================================================ */

// ── State ──────────────────────────────────────────────────────
var State = {
  currentPage: 'dashboard',
  categories: [],
  products: [],
  orders: [],
  orderStats: {},
  delivery: [],
  content: [],
};

// ── Helpers ─────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  var dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) +
    ', ' + dt.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
}
function fmtPrice(n) { return ((n||0).toFixed(2)) + ' MAD'; }
function imgEl(path, emoji, size) {
  size = size || 44;
  if (path && (path.startsWith('/uploads/') || path.startsWith('/images/'))) {
    return '<img src="'+path+'" class="td-img" style="width:'+size+'px;height:'+size+'px" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="td-img-placeholder" style="width:'+size+'px;height:'+size+'px;display:none">'+(emoji||'✨')+'</div>';
  }
  return '<div class="td-img-placeholder" style="width:'+size+'px;height:'+size+'px">'+(emoji||'✨')+'</div>';
}
function statusBadge(s) {
  var L = {pending:'Pending',confirmed:'Confirmed',preparing:'Preparing',shipped:'Shipped',out_for_delivery:'Out for Delivery',delivered:'Delivered',cancelled:'Cancelled',in_stock:'In Stock',low_stock:'Low Stock',sold_out:'Sold Out',coming_soon:'Coming Soon'};
  return '<span class="badge badge-'+s+'">'+(L[s]||s)+'</span>';
}
function labelChips(p) {
  var h = '';
  if (p.is_new) h += '<span class="label-chip label-new">New</span>';
  if (p.is_best_seller) h += '<span class="label-chip label-bestseller">⭐ Best</span>';
  if (p.is_featured) h += '<span class="label-chip label-featured">Featured</span>';
  return h ? '<div class="labels-cell">'+h+'</div>' : '—';
}
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── API ─────────────────────────────────────────────────────────
function api(method, url, data, isFormData) {
  var opts = { method: method, credentials: 'include' };
  if (data) {
    if (isFormData) { opts.body = data; }
    else { opts.headers = {'Content-Type':'application/json'}; opts.body = JSON.stringify(data); }
  }
  return fetch(url, opts).then(function(res) {
    if (res.status === 401) { window.location.href = '/admin/login'; throw new Error('Unauthorized'); }
    return res.json().catch(function(){ return {}; }).then(function(json) {
      if (!res.ok) throw new Error(json.error || 'Request failed');
      return json;
    });
  });
}
function apiGet(url)          { return api('GET',    url); }
function apiPost(url, d, fd)  { return api('POST',   url, d, fd); }
function apiPut(url, d, fd)   { return api('PUT',    url, d, fd); }
function apiPatch(url, d)     { return api('PATCH',  url, d); }
function apiDel(url)          { return api('DELETE', url); }

// ── Toast ────────────────────────────────────────────────────────
function toast(msg, type) {
  type = type || 'success';
  var icons = {success:'✓', error:'✕', warning:'⚠'};
  var el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.innerHTML = '<span class="toast-icon">'+(icons[type]||'•')+'</span><span class="toast-text">'+esc(msg)+'</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>';
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(function() { el.classList.add('removing'); setTimeout(function(){ el.remove(); }, 250); }, 3500);
}

// ── Modal ────────────────────────────────────────────────────────
var _modalResolve = null;
function openModal(title, bodyHtml, footerHtml, opts) {
  opts = opts || {};
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalFooter').innerHTML = footerHtml || '';
  var modal = document.getElementById('modal');
  modal.className = 'modal' + (opts.lg ? ' modal-lg' : '') + (opts.sm ? ' modal-sm' : '');
  document.getElementById('modalOverlay').hidden = false;
}
function closeModal() {
  document.getElementById('modalOverlay').hidden = true;
  document.getElementById('modalBody').innerHTML = '';
  document.getElementById('modalFooter').innerHTML = '';
  if (_modalResolve) { _modalResolve(false); _modalResolve = null; }
}
function confirmDialog(title, message, opts) {
  opts = opts || {};
  return new Promise(function(resolve) {
    _modalResolve = resolve;
    openModal(title,
      '<div class="text-center"><div class="confirm-icon">'+(opts.icon||(opts.danger?'🗑':'⚠️'))+'</div><p class="confirm-title">'+esc(title)+'</p><p class="confirm-text">'+esc(message)+'</p></div>',
      '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn '+(opts.danger?'btn-danger':'btn-primary')+'" id="confirmOkBtn">'+esc(opts.okLabel||'Confirm')+'</button>',
      {sm:true}
    );
    document.getElementById('confirmOkBtn').onclick = function() { closeModal(); resolve(true); };
  });
}
document.getElementById('modalClose').onclick = closeModal;
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeModal();
});

// ── Navigation ───────────────────────────────────────────────────
function navigate(page) {
  State.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.page === page);
  });
  var titles = {dashboard:'Dashboard',products:'Products',categories:'Categories',orders:'Orders',inventory:'Inventory',delivery:'Delivery',content:'Website Content',settings:'Settings'};
  document.getElementById('pageTitle').textContent = titles[page] || page;
  var renders = {dashboard:renderDashboard,products:renderProducts,categories:renderCategories,orders:renderOrders,inventory:renderInventory,delivery:renderDelivery,content:renderContent,settings:renderSettings};
  if (renders[page]) renders[page]();
  closeSidebar();
}
document.querySelectorAll('.nav-item[data-page]').forEach(function(el) {
  el.addEventListener('click', function(e) { e.preventDefault(); navigate(el.dataset.page); });
});

// ── Sidebar ──────────────────────────────────────────────────────
function openSidebar()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('show'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('show'); }
document.getElementById('hamburger').onclick = openSidebar;
document.getElementById('sidebarOverlay').onclick = closeSidebar;
document.getElementById('refreshBtn').onclick = function() { navigate(State.currentPage); };
document.getElementById('logoutBtn').onclick = function() {
  confirmDialog('Logout', 'Are you sure you want to logout?').then(function(ok) {
    if (!ok) return;
    apiPost('/admin/logout', {}).catch(function(){}).then(function(){
      window.location.href = '/admin/login';
    });
  });
};

// ── Init user ────────────────────────────────────────────────────
function initUser() {
  return apiGet('/api/admin/me').then(function(me) {
    document.getElementById('userName').textContent = me.username || 'Admin';
    document.getElementById('userAvatar').textContent = (me.username||'A')[0].toUpperCase();
  }).catch(function(){});
}

// ── Nav badges ────────────────────────────────────────────────────
function updateNavBadges() {
  return apiGet('/api/admin/content/dashboard-stats').then(function(stats) {
    var pending  = (stats.orders  && stats.orders.pending)   || 0;
    var lowStock = ((stats.products && stats.products.lowStock) || 0) + ((stats.products && stats.products.soldOut) || 0);
    var ob = document.getElementById('navBadgeOrders');
    var pb = document.getElementById('navBadgeProducts');
    if (ob) ob.textContent = pending  > 0 ? String(pending)  : '';
    if (pb) pb.textContent = lowStock > 0 ? String(lowStock) : '';
  }).catch(function(){});
}

// ================================================================
//   DASHBOARD
// ================================================================
function renderDashboard() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  apiGet('/api/admin/content/dashboard-stats').then(function(stats) {
    var p = stats.products || {}; var o = stats.orders || {}; var r = stats.revenue || {};
    el.innerHTML =
      '<div class="page-transition">' +
        '<div class="stats-grid">' +
          '<div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Total Products</span><div class="stat-card-icon stat-card-icon--purple">📦</div></div><div class="stat-card-value">'+(p.total||0)+'</div><div class="stat-card-sub">'+(p.inStock||0)+' in stock · '+(p.lowStock||0)+' low · '+(p.soldOut||0)+' sold out</div></div>' +
          '<div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Total Orders</span><div class="stat-card-icon stat-card-icon--blue">🛍</div></div><div class="stat-card-value">'+(o.total||0)+'</div><div class="stat-card-sub">Today: '+(o.todayCount||0)+' new</div></div>' +
          '<div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Total Revenue</span><div class="stat-card-icon stat-card-icon--green">💰</div></div><div class="stat-card-value" style="font-size:1.2rem">'+fmtPrice(r.total)+'</div><div class="stat-card-sub">This month: '+fmtPrice(r.thisMonth)+'</div></div>' +
          '<div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Pending</span><div class="stat-card-icon stat-card-icon--yellow">⏳</div></div><div class="stat-card-value">'+(o.pending||0)+'</div><div class="stat-card-sub">Confirmed: '+(o.confirmed||0)+'</div></div>' +
          '<div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Delivered</span><div class="stat-card-icon stat-card-icon--green">✅</div></div><div class="stat-card-value">'+(o.delivered||0)+'</div><div class="stat-card-sub">Today: '+fmtPrice(r.today)+'</div></div>' +
          '<div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Categories</span><div class="stat-card-icon stat-card-icon--purple">🗂</div></div><div class="stat-card-value">'+(stats.categories||0)+'</div><div class="stat-card-sub">Active</div></div>' +
        '</div>' +
        ((p.lowStock>0||p.soldOut>0) ? '<div class="alert-banner"><span class="alert-banner-icon">⚠️</span><div class="alert-banner-text"><div class="alert-banner-title">Stock Alert</div><div>'+(p.soldOut||0)+' sold out · '+(p.lowStock||0)+' low. <a href="#" onclick="navigate(\'inventory\')" style="color:var(--warning);text-decoration:underline">Manage →</a></div></div></div>' : '') +
        '<div class="dashboard-grid">' +
          '<div class="dashboard-card"><div class="dashboard-card-header"><span class="dashboard-card-title">Recent Orders</span><button class="btn btn-ghost btn-sm" onclick="navigate(\'orders\')">View all →</button></div><div class="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
          ((stats.recentOrders||[]).length===0 ? '<tr><td colspan="4" style="text-align:center;padding:1.5rem;color:var(--muted)">No orders yet</td></tr>' :
            (stats.recentOrders||[]).map(function(ord){ return '<tr class="clickable" onclick="navigate(\'orders\')"><td><span class="td-id">'+esc(ord.order_number)+'</span></td><td>'+esc(ord.customer_name)+'</td><td>'+fmtPrice(ord.total)+'</td><td>'+statusBadge(ord.status)+'</td></tr>'; }).join('')) +
          '</tbody></table></div></div>' +
          '<div class="dashboard-card"><div class="dashboard-card-header"><span class="dashboard-card-title">Recent Products</span><button class="btn btn-ghost btn-sm" onclick="navigate(\'products\')">View all →</button></div><div class="table-scroll"><table><thead><tr><th>Img</th><th>Name</th><th>Stock</th><th>Status</th></tr></thead><tbody>' +
          ((stats.recentProducts||[]).length===0 ? '<tr><td colspan="4" style="text-align:center;padding:1.5rem;color:var(--muted)">No products yet</td></tr>' :
            (stats.recentProducts||[]).map(function(p2){ return '<tr class="clickable" onclick="navigate(\'products\')"><td>'+imgEl(p2.image,p2.emoji)+'</td><td><div class="td-name">'+esc(p2.name)+'</div><div class="td-id">'+esc(p2.sticker_id)+'</div></td><td>'+p2.stock+'</td><td>'+statusBadge(p2.status)+'</td></tr>'; }).join('')) +
          '</tbody></table></div></div>' +
        '</div>' +
      '</div>';
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Failed to load dashboard</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

// ================================================================
//   PRODUCTS
// ================================================================
var productFilters = {search:'',category:'all',status:'all',sort:'newest',isNew:false,isBestSeller:false,isFeatured:false};

function renderProducts() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  Promise.all([apiGet('/api/admin/products'), apiGet('/api/admin/categories')]).then(function(results) {
    State.products = results[0]; State.categories = results[1];
    renderProductsView();
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Error</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

function renderProductsView() {
  var prods = applyProductFilters(State.products);
  var el = document.getElementById('pageContent');
  var catOptions = State.categories.map(function(c){ return '<option value="'+esc(c.slug)+'" '+(productFilters.category===c.slug?'selected':'')+'>'+esc(c.name)+'</option>'; }).join('');
  el.innerHTML =
    '<div class="page-transition">' +
      '<div class="page-header"><div class="page-header-left"><h2>Products</h2><p>'+State.products.length+' total stickers</p></div>' +
      '<button class="btn btn-primary" onclick="openProductModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Product</button></div>' +
      '<div class="toolbar"><div class="toolbar-left">' +
        '<div class="search-wrap"><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="search" class="search-input" placeholder="Search name or ID…" value="'+esc(productFilters.search)+'" id="prodSearch"></div>' +
        '<select class="filter-select" id="prodCatFilter"><option value="all" '+(productFilters.category==='all'?'selected':'')+'>All Categories</option>'+catOptions+'</select>' +
        '<select class="filter-select" id="prodStatusFilter"><option value="all" '+(productFilters.status==='all'?'selected':'')+'>All Statuses</option><option value="in_stock" '+(productFilters.status==='in_stock'?'selected':'')+'>In Stock</option><option value="low_stock" '+(productFilters.status==='low_stock'?'selected':'')+'>Low Stock</option><option value="sold_out" '+(productFilters.status==='sold_out'?'selected':'')+'>Sold Out</option><option value="coming_soon" '+(productFilters.status==='coming_soon'?'selected':'')+'>Coming Soon</option></select>' +
        '<select class="filter-select" id="prodSort"><option value="newest" '+(productFilters.sort==='newest'?'selected':'')+'>Newest</option><option value="oldest" '+(productFilters.sort==='oldest'?'selected':'')+'>Oldest</option><option value="name_asc" '+(productFilters.sort==='name_asc'?'selected':'')+'>Name A–Z</option><option value="price_asc" '+(productFilters.sort==='price_asc'?'selected':'')+'>Price ↑</option><option value="price_desc" '+(productFilters.sort==='price_desc'?'selected':'')+'>Price ↓</option><option value="stock_asc" '+(productFilters.sort==='stock_asc'?'selected':'')+'>Stock ↑</option><option value="stock_desc" '+(productFilters.sort==='stock_desc'?'selected':'')+'>Stock ↓</option></select>' +
        '<label class="filter-check-label"><input type="checkbox" '+(productFilters.isNew?'checked':'')+' id="filterNew"> New</label>' +
        '<label class="filter-check-label"><input type="checkbox" '+(productFilters.isBestSeller?'checked':'')+' id="filterBest"> Best Seller</label>' +
        '<label class="filter-check-label"><input type="checkbox" '+(productFilters.isFeatured?'checked':'')+' id="filterFeat"> Featured</label>' +
      '</div></div>' +
      '<div class="table-wrap"><div class="table-scroll"><table><thead><tr><th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Labels</th><th>Actions</th></tr></thead><tbody>' +
      (prods.length===0 ? '<tr><td colspan="9"><div class="empty-state"><div class="empty-icon">📦</div><p class="empty-title">No products found</p></div></td></tr>' :
        prods.map(function(p) {
          return '<tr><td>'+imgEl(p.image,p.emoji)+'</td><td><span class="td-id">'+esc(p.sticker_id)+'</span></td><td><div class="td-name">'+esc(p.name)+'</div></td><td><span class="td-muted">'+esc(p.category_slug)+'</span></td><td>'+fmtPrice(p.price)+'</td><td><span class="'+(p.stock<=0?'text-red':p.stock<=5?'text-yellow':'text-green')+' fw-bold">'+p.stock+'</span></td><td>'+statusBadge(p.status)+'</td><td>'+labelChips(p)+'</td><td><div class="actions-cell"><button class="btn btn-ghost btn-icon btn-sm" onclick="openProductModal('+p.id+')" title="Edit">✏️</button><button class="btn btn-danger btn-icon btn-sm" onclick="deleteProduct('+p.id+',\''+esc(p.name)+'\')" title="Delete">🗑</button></div></td></tr>';
        }).join('')) +
      '</tbody></table></div><div class="table-footer"><span>Showing '+prods.length+' of '+State.products.length+'</span></div></div>' +
    '</div>';
  document.getElementById('prodSearch').addEventListener('input', function(e){ productFilters.search=e.target.value; renderProductsView(); });
  document.getElementById('prodCatFilter').addEventListener('change', function(e){ productFilters.category=e.target.value; renderProductsView(); });
  document.getElementById('prodStatusFilter').addEventListener('change', function(e){ productFilters.status=e.target.value; renderProductsView(); });
  document.getElementById('prodSort').addEventListener('change', function(e){ productFilters.sort=e.target.value; renderProductsView(); });
  document.getElementById('filterNew').addEventListener('change', function(e){ productFilters.isNew=e.target.checked; renderProductsView(); });
  document.getElementById('filterBest').addEventListener('change', function(e){ productFilters.isBestSeller=e.target.checked; renderProductsView(); });
  document.getElementById('filterFeat').addEventListener('change', function(e){ productFilters.isFeatured=e.target.checked; renderProductsView(); });
}

function applyProductFilters(products) {
  var list = products.slice();
  var q = productFilters.search.toLowerCase();
  if (q) list = list.filter(function(p){ return p.name.toLowerCase().indexOf(q)>=0||p.sticker_id.toLowerCase().indexOf(q)>=0; });
  if (productFilters.category!=='all') list = list.filter(function(p){ return p.category_slug===productFilters.category; });
  if (productFilters.status!=='all')   list = list.filter(function(p){ return p.status===productFilters.status; });
  if (productFilters.isNew)        list = list.filter(function(p){ return p.is_new; });
  if (productFilters.isBestSeller) list = list.filter(function(p){ return p.is_best_seller; });
  if (productFilters.isFeatured)   list = list.filter(function(p){ return p.is_featured; });
  var sortFns = {
    newest: function(a,b){ return new Date(b.created_at)-new Date(a.created_at); },
    oldest: function(a,b){ return new Date(a.created_at)-new Date(b.created_at); },
    name_asc: function(a,b){ return a.name.localeCompare(b.name); },
    price_asc: function(a,b){ return a.price-b.price; },
    price_desc: function(a,b){ return b.price-a.price; },
    stock_asc: function(a,b){ return a.stock-b.stock; },
    stock_desc: function(a,b){ return b.stock-a.stock; },
  };
  if (sortFns[productFilters.sort]) list.sort(sortFns[productFilters.sort]);
  return list;
}

function openProductModal(id) {
  var cats = State.categories; var p = null;
  var loadPromise = id ? apiGet('/api/admin/products/'+id) : Promise.resolve(null);
  loadPromise.then(function(prod) {
    p = prod;
    var catOpts = cats.map(function(c){ return '<option value="'+esc(c.slug)+'" '+(p&&p.category_slug===c.slug?'selected':'')+'>'+esc(c.name)+'</option>'; }).join('');
    var statusOpts = ['in_stock','low_stock','sold_out','coming_soon'].map(function(s){ return '<option value="'+s+'" '+(p&&p.status===s?'selected':'')+'>'+s.replace(/_/g,' ').replace(/\b\w/g,function(l){return l.toUpperCase();})+'</option>'; }).join('');
    openModal(id?'Edit Product':'Add Product',
      '<form id="productForm" enctype="multipart/form-data"><div class="form-grid">' +
        '<div class="form-group"><label class="form-label form-label-required">Sticker ID</label><input class="form-input" name="sticker_id" placeholder="e.g. AN-018" value="'+esc(p&&p.sticker_id||'')+'" required></div>' +
        '<div class="form-group"><label class="form-label form-label-required">Name</label><input class="form-input" name="name" placeholder="Sticker name" value="'+esc(p&&p.name||'')+'" required></div>' +
        '<div class="form-group"><label class="form-label form-label-required">Category</label><select class="form-select" name="category_slug" required><option value="">Select…</option>'+catOpts+'</select></div>' +
        '<div class="form-group"><label class="form-label">Price</label><div class="input-with-unit"><input class="form-input" name="price" type="number" min="0" step="0.5" value="'+(p!=null?p.price:3)+'"><span class="input-unit">MAD</span></div></div>' +
        '<div class="form-group"><label class="form-label">Stock</label><input class="form-input" name="stock" type="number" min="0" value="'+(p!=null?p.stock:100)+'"></div>' +
        '<div class="form-group"><label class="form-label">Low Stock Threshold</label><input class="form-input" name="low_stock_threshold" type="number" min="1" value="'+(p!=null?p.low_stock_threshold:5)+'"></div>' +
        '<div class="form-group"><label class="form-label">Status</label><select class="form-select" name="status">'+statusOpts+'</select></div>' +
        '<div class="form-group"><label class="form-label">Emoji</label><input class="form-input" name="emoji" value="'+esc(p&&p.emoji||'✨')+'" maxlength="4"></div>' +
        '<div class="form-group form-full"><label class="form-label">Description</label><textarea class="form-textarea" name="description" placeholder="Optional">'+esc(p&&p.description||'')+'</textarea></div>' +
        '<div class="form-group form-full"><label class="form-label">Product Image</label>'+(p&&p.image?'<div style="margin-bottom:.5rem"><img src="'+esc(p.image)+'" style="height:80px;border-radius:8px;object-fit:cover"></div>':'')+
          '<input type="file" class="form-input" name="image" accept="image/*" style="padding:.375rem"><p class="form-hint">JPG, PNG, WebP (max 10MB). Leave blank to keep existing.</p></div>' +
        '<div class="form-group"><label class="form-check-group"><input type="checkbox" class="form-check-input" name="is_new" value="1" '+(p&&p.is_new?'checked':'')+'>  <span class="form-check-label">🆕 New Arrival</span></label></div>' +
        '<div class="form-group"><label class="form-check-group"><input type="checkbox" class="form-check-input" name="is_best_seller" value="1" '+(p&&p.is_best_seller?'checked':'')+'>  <span class="form-check-label">⭐ Best Seller</span></label></div>' +
        '<div class="form-group"><label class="form-check-group"><input type="checkbox" class="form-check-input" name="is_featured" value="1" '+(p&&p.is_featured?'checked':'')+'>  <span class="form-check-label">🌟 Featured</span></label></div>' +
      '</div></form>',
      '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveProductBtn">💾 '+(id?'Save Changes':'Add Product')+'</button>',
      {lg:true}
    );
    document.getElementById('saveProductBtn').onclick = function() {
      var form = document.getElementById('productForm');
      var fd = new FormData(form);
      if (!fd.get('is_new')) fd.set('is_new','0');
      if (!fd.get('is_best_seller')) fd.set('is_best_seller','0');
      if (!fd.get('is_featured')) fd.set('is_featured','0');
      var btn = document.getElementById('saveProductBtn');
      btn.disabled=true; btn.textContent='Saving…';
      var req = id ? apiPut('/api/admin/products/'+id, fd, true) : apiPost('/api/admin/products', fd, true);
      req.then(function(){ toast(id?'Product updated!':'Product added!'); closeModal(); renderProducts(); updateNavBadges(); })
         .catch(function(err){ toast(err.message,'error'); })
         .finally(function(){ btn.disabled=false; btn.textContent=id?'Save Changes':'Add Product'; });
    };
  }).catch(function(err){ toast(err.message,'error'); });
}

function deleteProduct(id, name) {
  confirmDialog('Delete Product', 'Delete "'+name+'"? This cannot be undone.', {danger:true,okLabel:'Delete'}).then(function(ok) {
    if (!ok) return;
    apiDel('/api/admin/products/'+id).then(function(){ toast('Product deleted'); renderProducts(); updateNavBadges(); })
      .catch(function(err){ toast(err.message,'error'); });
  });
}

// ================================================================
//   CATEGORIES
// ================================================================
function renderCategories() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  apiGet('/api/admin/categories').then(function(cats) {
    State.categories = cats;
    el.innerHTML =
      '<div class="page-transition">' +
        '<div class="page-header"><div class="page-header-left"><h2>Categories</h2><p>'+cats.length+' categories</p></div>' +
        '<button class="btn btn-primary" onclick="openCategoryModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Category</button></div>' +
        (cats.length===0 ? '<div class="empty-state"><div class="empty-icon">🗂</div><p class="empty-title">No categories</p></div>' :
          '<div class="cat-grid">'+cats.map(function(c){ return '<div class="cat-card"><div class="cat-card-icon">📁</div><div class="cat-card-name">'+esc(c.name)+'</div><div class="cat-card-slug">'+esc(c.slug)+'</div><div class="cat-card-count">'+(c.product_count||0)+' products</div><div class="cat-card-actions"><button class="btn btn-ghost btn-icon btn-sm" onclick="openCategoryModal('+c.id+')" title="Edit">✏️</button><button class="btn btn-danger btn-icon btn-sm" onclick="deleteCategory('+c.id+',\''+esc(c.name)+'\',' +(c.product_count||0)+')" title="Delete">🗑</button></div></div>'; }).join('')+'</div>') +
      '</div>';
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Error</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

function openCategoryModal(id) {
  var c = id ? State.categories.find(function(x){ return x.id===id; }) : null;
  openModal(id?'Edit Category':'Add Category',
    '<form id="catForm">' +
      '<div class="form-group mb-2"><label class="form-label form-label-required">Name</label><input class="form-input" name="name" placeholder="e.g. Anime" value="'+esc(c&&c.name||'')+'" required></div>' +
      (!id ? '<div class="form-group mb-2"><label class="form-label form-label-required">Slug</label><input class="form-input" name="slug" placeholder="e.g. anime" required><p class="form-hint">Lowercase, no spaces</p></div>' : '') +
      '<div class="form-group"><label class="form-label">Icon filename</label><input class="form-input" name="icon" placeholder="e.g. anime.svg" value="'+esc(c&&c.icon||'')+'"></div>' +
    '</form>',
    '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveCatBtn">💾 '+(id?'Save':'Add Category')+'</button>',
    {sm:true}
  );
  document.getElementById('saveCatBtn').onclick = function() {
    var form = document.getElementById('catForm');
    var data = Object.fromEntries(new FormData(form));
    var btn = document.getElementById('saveCatBtn'); btn.disabled=true;
    var req = id ? apiPut('/api/admin/categories/'+id, data) : apiPost('/api/admin/categories', data);
    req.then(function(){ toast(id?'Category updated!':'Category added!'); closeModal(); renderCategories(); })
       .catch(function(err){ toast(err.message,'error'); })
       .finally(function(){ btn.disabled=false; });
  };
}

function deleteCategory(id, name, productCount) {
  if (productCount>0){ toast('Cannot delete "'+name+'" — it has '+productCount+' products. Reassign them first.','warning'); return; }
  confirmDialog('Delete Category','Delete "'+name+'"?',{danger:true,okLabel:'Delete'}).then(function(ok) {
    if (!ok) return;
    apiDel('/api/admin/categories/'+id).then(function(){ toast('Category deleted'); renderCategories(); })
      .catch(function(err){ toast(err.message,'error'); });
  });
}

// ================================================================
//   ORDERS
// ================================================================
var orderFilters = {search:'',status:'all',sort:'newest',dateFrom:'',dateTo:''};

function renderOrders() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  Promise.all([apiGet('/api/admin/orders'), apiGet('/api/admin/orders/stats')]).then(function(results) {
    State.orders = results[0]; State.orderStats = results[1];
    renderOrdersView();
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Error</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

function renderOrdersView() {
  var el = document.getElementById('pageContent');
  var stats = State.orderStats;
  var orders = applyOrderFilters(State.orders);
  var sfBtns = [
    {key:'all',label:'All',count:stats.total},
    {key:'pending',label:'Pending',count:stats.pending},
    {key:'confirmed',label:'Confirmed',count:stats.confirmed},
    {key:'preparing',label:'Preparing',count:stats.preparing},
    {key:'shipped',label:'Shipped',count:stats.shipped},
    {key:'out_for_delivery',label:'Out for Delivery',count:stats.out_for_delivery},
    {key:'delivered',label:'Delivered',count:stats.delivered},
    {key:'cancelled',label:'Cancelled',count:stats.cancelled},
  ].map(function(s){ return '<button class="filter-stat-btn '+(orderFilters.status===s.key?'active':'')+'" onclick="setOrderStatus(\''+s.key+'\')"><span class="filter-stat-count">'+(s.count||0)+'</span><span>'+esc(s.label)+'</span></button>'; }).join('');
  el.innerHTML =
    '<div class="page-transition">' +
      '<div class="page-header"><div class="page-header-left"><h2>Orders</h2><p>'+State.orders.length+' total orders</p></div></div>' +
      '<div class="orders-filter-stats">'+sfBtns+'</div>' +
      '<div class="toolbar"><div class="toolbar-left">' +
        '<div class="search-wrap"><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="search" class="search-input" placeholder="Search order#, name, phone…" value="'+esc(orderFilters.search)+'" id="orderSearch"></div>' +
        '<select class="filter-select" id="orderSort"><option value="newest" '+(orderFilters.sort==='newest'?'selected':'')+'>Newest first</option><option value="oldest" '+(orderFilters.sort==='oldest'?'selected':'')+'>Oldest first</option><option value="total_desc" '+(orderFilters.sort==='total_desc'?'selected':'')+'>Total ↓</option><option value="total_asc" '+(orderFilters.sort==='total_asc'?'selected':'')+'>Total ↑</option></select>' +
        '<input type="date" class="filter-select" id="orderDateFrom" value="'+orderFilters.dateFrom+'" title="From date">' +
        '<input type="date" class="filter-select" id="orderDateTo" value="'+orderFilters.dateTo+'" title="To date">' +
      '</div></div>' +
      '<div class="table-wrap"><div class="table-scroll"><table><thead><tr><th>Order #</th><th>Customer</th><th>Phone</th><th>City</th><th>Total</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
      (orders.length===0 ? '<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">🛍</div><p class="empty-title">No orders found</p></div></td></tr>' :
        orders.map(function(o){ return '<tr class="clickable" onclick="openOrderDetail('+o.id+')"><td><span class="td-id">'+esc(o.order_number)+'</span></td><td><div class="td-name">'+esc(o.customer_name)+'</div></td><td><span class="td-muted">'+esc(o.customer_phone)+'</span></td><td><span class="td-muted">'+esc(o.customer_city)+'</span></td><td><strong>'+fmtPrice(o.total)+'</strong></td><td><span class="td-muted">'+fmtDate(o.created_at)+'</span></td><td>'+statusBadge(o.status)+'</td><td><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openOrderDetail('+o.id+')">View</button></td></tr>'; }).join('')) +
      '</tbody></table></div><div class="table-footer"><span>Showing '+orders.length+' of '+State.orders.length+'</span><span>Revenue (delivered): <strong>'+fmtPrice(stats.totalRevenue)+'</strong></span></div></div>' +
    '</div>';
  document.getElementById('orderSearch').addEventListener('input', function(e){ orderFilters.search=e.target.value; renderOrdersView(); });
  document.getElementById('orderSort').addEventListener('change', function(e){ orderFilters.sort=e.target.value; renderOrdersView(); });
  document.getElementById('orderDateFrom').addEventListener('change', function(e){ orderFilters.dateFrom=e.target.value; renderOrdersView(); });
  document.getElementById('orderDateTo').addEventListener('change', function(e){ orderFilters.dateTo=e.target.value; renderOrdersView(); });
}

function setOrderStatus(s) { orderFilters.status=s; renderOrdersView(); }

function applyOrderFilters(orders) {
  var list = orders.slice();
  var q = orderFilters.search.toLowerCase();
  if (q) list = list.filter(function(o){ return o.order_number.toLowerCase().indexOf(q)>=0||o.customer_name.toLowerCase().indexOf(q)>=0||o.customer_phone.toLowerCase().indexOf(q)>=0; });
  if (orderFilters.status!=='all') list = list.filter(function(o){ return o.status===orderFilters.status; });
  if (orderFilters.dateFrom) list = list.filter(function(o){ return o.created_at.slice(0,10)>=orderFilters.dateFrom; });
  if (orderFilters.dateTo)   list = list.filter(function(o){ return o.created_at.slice(0,10)<=orderFilters.dateTo; });
  var sortFns = {
    newest: function(a,b){ return new Date(b.created_at)-new Date(a.created_at); },
    oldest: function(a,b){ return new Date(a.created_at)-new Date(b.created_at); },
    total_desc: function(a,b){ return b.total-a.total; },
    total_asc: function(a,b){ return a.total-b.total; },
  };
  if (sortFns[orderFilters.sort]) list.sort(sortFns[orderFilters.sort]);
  return list;
}

function openOrderDetail(id) {
  openModal('Loading order…','<div class="loading-spinner"></div>','',{lg:true});
  apiGet('/api/admin/orders/'+id).then(function(o) {
    var statusList = ['pending','confirmed','preparing','shipped','out_for_delivery','delivered','cancelled'];
    var statusLabels = {pending:'Pending',confirmed:'Confirmed',preparing:'Preparing',shipped:'Shipped',out_for_delivery:'Out for Delivery',delivered:'Delivered',cancelled:'Cancelled'};
    document.getElementById('modalTitle').textContent = 'Order '+o.order_number;
    document.getElementById('modalBody').innerHTML =
      '<div class="order-detail-grid">' +
        '<div class="order-detail-section"><div class="order-detail-section-title">Customer Information</div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Name</span><span class="order-detail-value">'+esc(o.customer_name)+'</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Phone</span><span class="order-detail-value">'+esc(o.customer_phone)+'</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">City</span><span class="order-detail-value">'+esc(o.customer_city)+'</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Address</span><span class="order-detail-value">'+esc(o.customer_address)+'</span></div>' +
          (o.customer_notes ? '<div class="order-detail-row"><span class="order-detail-label">Notes</span><span class="order-detail-value">'+esc(o.customer_notes)+'</span></div>' : '') +
        '</div>' +
        '<div class="order-detail-section"><div class="order-detail-section-title">Order Summary</div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Order #</span><span class="order-detail-value td-id">'+esc(o.order_number)+'</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Date</span><span class="order-detail-value">'+fmtDate(o.created_at)+'</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Payment</span><span class="order-detail-value">Cash on Delivery</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Status</span><span class="order-detail-value">'+statusBadge(o.status)+'</span></div>' +
          '<hr class="order-summary-divider">' +
          '<div class="order-detail-row"><span class="order-detail-label">Subtotal</span><span class="order-detail-value">'+fmtPrice(o.subtotal)+'</span></div>' +
          '<div class="order-detail-row"><span class="order-detail-label">Delivery</span><span class="order-detail-value">'+fmtPrice(o.delivery_fee)+'</span></div>' +
          '<div class="order-total-row"><span>Total</span><span class="order-total-val">'+fmtPrice(o.total)+'</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="section-title mt-2">Products ('+(o.items||[]).length+' items)</div>' +
      '<div class="table-wrap mb-2"><div class="table-scroll"><table><thead><tr><th>Image</th><th>ID</th><th>Name</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead><tbody>' +
      (o.items||[]).map(function(item){ return '<tr><td>'+imgEl(item.image,'✨')+'</td><td><span class="td-id">'+esc(item.sticker_id)+'</span></td><td>'+esc(item.name)+'</td><td>'+item.quantity+'</td><td>'+fmtPrice(item.unit_price)+'</td><td><strong>'+fmtPrice(item.subtotal)+'</strong></td></tr>'; }).join('') +
      '</tbody></table></div></div>' +
      '<div class="status-change-bar">' +
        '<span class="td-muted" style="white-space:nowrap">Update Status:</span>' +
        '<select class="form-select" id="newStatusSelect" style="max-width:220px">' +
          statusList.map(function(s){ return '<option value="'+s+'" '+(o.status===s?'selected':'')+'>'+statusLabels[s]+'</option>'; }).join('') +
        '</select>' +
        '<button class="btn btn-primary" id="updateStatusBtn">Update</button>' +
      '</div>';
    document.getElementById('modalFooter').innerHTML = '<button class="btn btn-secondary" onclick="closeModal()">Close</button>';
    document.getElementById('updateStatusBtn').onclick = function() {
      var newStatus = document.getElementById('newStatusSelect').value;
      var doUpdate = function() {
        var btn = document.getElementById('updateStatusBtn'); btn.disabled=true; btn.textContent='Saving…';
        apiPatch('/api/admin/orders/'+id+'/status', {status:newStatus})
          .then(function(){ toast('Status updated!'); closeModal(); renderOrders(); updateNavBadges(); })
          .catch(function(err){ toast(err.message,'error'); })
          .finally(function(){ btn.disabled=false; btn.textContent='Update'; });
      };
      if (newStatus==='cancelled' && o.status!=='cancelled') {
        confirmDialog('Cancel Order','Cancel '+o.order_number+'? Stock will be restored.',{danger:true,okLabel:'Cancel Order'}).then(function(ok){ if(ok) doUpdate(); });
      } else { doUpdate(); }
    };
  }).catch(function(err) {
    document.getElementById('modalBody').innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Failed to load</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

// ================================================================
//   INVENTORY
// ================================================================
var inventoryFilter = 'all';

function renderInventory() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  apiGet('/api/admin/products').then(function(products) {
    State.products = products; renderInventoryView();
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Error</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

function renderInventoryView() {
  var list = State.products.slice();
  if (inventoryFilter==='low') list = list.filter(function(p){ return p.status==='low_stock'; });
  if (inventoryFilter==='out') list = list.filter(function(p){ return p.status==='sold_out'; });
  list.sort(function(a,b){ return a.stock-b.stock; });
  var el = document.getElementById('pageContent');
  el.innerHTML =
    '<div class="page-transition">' +
      '<div class="page-header"><div class="page-header-left"><h2>Inventory</h2><p>Manage stock levels</p></div>' +
      '<div style="display:flex;gap:.5rem"><button class="btn '+(inventoryFilter==='all'?'btn-primary':'btn-secondary')+'" onclick="setInvFilter(\'all\')">All</button><button class="btn '+(inventoryFilter==='low'?'btn-primary':'btn-secondary')+'" onclick="setInvFilter(\'low\')">Low Stock</button><button class="btn '+(inventoryFilter==='out'?'btn-danger':'btn-secondary')+'" onclick="setInvFilter(\'out\')">Sold Out</button></div></div>' +
      '<div class="table-wrap"><div class="table-scroll"><table><thead><tr><th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Status</th><th>Stock</th><th>Adjust</th></tr></thead><tbody>' +
      (list.length===0 ? '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">✅</div><p class="empty-title">All clear!</p><p class="empty-text">No stock issues.</p></div></td></tr>' :
        list.map(function(p){ return '<tr><td>'+imgEl(p.image,p.emoji)+'</td><td><span class="td-id">'+esc(p.sticker_id)+'</span></td><td><div class="td-name">'+esc(p.name)+'</div></td><td><span class="td-muted">'+esc(p.category_slug)+'</span></td><td>'+statusBadge(p.status)+'</td><td><span class="'+(p.stock<=0?'text-red':p.stock<=5?'text-yellow':'text-green')+' fw-bold" id="stockVal-'+p.id+'">'+p.stock+'</span></td><td><div class="stock-control"><button class="stock-btn stock-btn--sub" onclick="adjustStock('+p.id+',-1,'+p.stock+')">−</button><span class="stock-val" id="stockDisp-'+p.id+'">'+p.stock+'</span><button class="stock-btn stock-btn--add" onclick="adjustStock('+p.id+',1,'+p.stock+')">+</button><button class="btn btn-ghost btn-sm" onclick="openStockModal('+p.id+',\''+esc(p.name)+'\','+p.stock+')" style="margin-left:.25rem">✏️</button></div></td></tr>'; }).join('')) +
      '</tbody></table></div></div>' +
    '</div>';
}

function setInvFilter(f) { inventoryFilter=f; renderInventoryView(); }

function adjustStock(id, delta, current) {
  var newStock = Math.max(0, current+delta);
  apiPatch('/api/admin/products/'+id+'/stock', {stock:newStock}).then(function() {
    var prod = State.products.find(function(p){ return p.id===id; });
    if (prod){ prod.stock=newStock; prod.status=newStock<=0?'sold_out':newStock<=(prod.low_stock_threshold||5)?'low_stock':'in_stock'; }
    var d=document.getElementById('stockDisp-'+id); var v=document.getElementById('stockVal-'+id);
    if(d) d.textContent=newStock; if(v) v.textContent=newStock;
    updateNavBadges();
  }).catch(function(err){ toast(err.message,'error'); });
}

function openStockModal(id, name, current) {
  openModal('Adjust Stock: '+name,
    '<div class="form-group mb-2"><label class="form-label">Current Stock</label><div style="font-size:2rem;font-weight:800;color:var(--accent-light)">'+current+'</div></div><div class="form-group"><label class="form-label">Set New Value</label><input class="form-input" type="number" min="0" id="newStockInput" value="'+current+'"></div>',
    '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="setStockBtn">Set Stock</button>',
    {sm:true}
  );
  document.getElementById('setStockBtn').onclick = function() {
    var val = parseInt(document.getElementById('newStockInput').value,10);
    if (isNaN(val)||val<0){ toast('Invalid value','error'); return; }
    apiPatch('/api/admin/products/'+id+'/stock', {stock:val}).then(function() {
      var prod = State.products.find(function(p){ return p.id===id; });
      if (prod){ prod.stock=val; prod.status=val<=0?'sold_out':val<=(prod.low_stock_threshold||5)?'low_stock':'in_stock'; }
      toast('Stock updated!'); closeModal(); renderInventoryView(); updateNavBadges();
    }).catch(function(err){ toast(err.message,'error'); });
  };
}

// ================================================================
//   DELIVERY
// ================================================================
function renderDelivery() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  apiGet('/api/admin/delivery').then(function(zones) {
    State.delivery = zones;
    el.innerHTML =
      '<div class="page-transition">' +
        '<div class="page-header"><div class="page-header-left"><h2>Delivery Pricing</h2><p>Set delivery fees per city</p></div><button class="btn btn-primary" onclick="openDeliveryModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Zone</button></div>' +
        (zones.length===0 ? '<div class="empty-state"><div class="empty-icon">🚚</div><p class="empty-title">No delivery zones</p></div>' :
          '<div class="zone-cards">'+zones.map(function(z){ return '<div class="zone-card '+(z.is_default?'zone-card--default':'')+'">'+(z.is_default?'<div class="zone-card-default-badge">Default</div>':'')+' <div class="zone-card-city">📍 '+esc(z.city)+'</div><div class="zone-card-price">'+z.price.toFixed(2)+'</div><div class="zone-card-currency">MAD</div><div class="zone-card-actions"><button class="btn btn-secondary btn-sm" onclick="openDeliveryModal('+z.id+')">Edit</button><button class="btn btn-danger btn-sm" onclick="deleteZone('+z.id+',\''+esc(z.city)+'\')">Delete</button></div></div>'; }).join('')+'</div>') +
      '</div>';
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Error</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

function openDeliveryModal(id) {
  var z = id ? State.delivery.find(function(x){ return x.id===id; }) : null;
  openModal(id?'Edit Delivery Zone':'Add Delivery Zone',
    '<form id="zoneForm">' +
      '<div class="form-group mb-2"><label class="form-label form-label-required">City / Region</label><input class="form-input" name="city" placeholder="e.g. Casablanca" value="'+esc(z&&z.city||'')+'" required></div>' +
      '<div class="form-group mb-2"><label class="form-label form-label-required">Delivery Price</label><div class="input-with-unit"><input class="form-input" name="price" type="number" min="0" step="0.5" value="'+(z!=null?z.price:'')+'" placeholder="25" required><span class="input-unit">MAD</span></div></div>' +
      '<div class="form-group"><label class="form-check-group"><input type="checkbox" class="form-check-input" name="is_default" value="1" '+(z&&z.is_default?'checked':'')+'>  <span class="form-check-label">Default (used when city not listed)</span></label></div>' +
    '</form>',
    '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveZoneBtn">💾 '+(id?'Save':'Add Zone')+'</button>',
    {sm:true}
  );
  document.getElementById('saveZoneBtn').onclick = function() {
    var form = document.getElementById('zoneForm'); var fd = new FormData(form);
    var data = {city:fd.get('city'), price:parseFloat(fd.get('price')), is_default:fd.get('is_default')==='1'};
    if (!data.city||isNaN(data.price)){ toast('City and price required','error'); return; }
    var btn = document.getElementById('saveZoneBtn'); btn.disabled=true;
    var req = id ? apiPut('/api/admin/delivery/'+id, data) : apiPost('/api/admin/delivery', data);
    req.then(function(){ toast(id?'Zone updated!':'Zone added!'); closeModal(); renderDelivery(); })
       .catch(function(err){ toast(err.message,'error'); })
       .finally(function(){ btn.disabled=false; });
  };
}

function deleteZone(id, city) {
  confirmDialog('Delete Zone','Delete delivery zone for "'+city+'"?',{danger:true,okLabel:'Delete'}).then(function(ok) {
    if (!ok) return;
    apiDel('/api/admin/delivery/'+id).then(function(){ toast('Zone deleted'); renderDelivery(); })
      .catch(function(err){ toast(err.message,'error'); });
  });
}

// ================================================================
//   CONTENT / CMS
// ================================================================
var contentTab = 'general';

function renderContent() {
  var el = document.getElementById('pageContent');
  el.innerHTML = '<div class="loading-spinner"></div>';
  Promise.all([apiGet('/api/admin/content/site'), apiGet('/api/admin/content/faqs')]).then(function(results) {
    State.content = results[0];
    renderContentView(results[1]);
  }).catch(function(err) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><p class="empty-title">Error</p><p class="empty-text">'+esc(err.message)+'</p></div>';
  });
}

function contentVal(key) {
  var row = State.content.find(function(r){ return r.key===key; });
  return row ? row.value : '';
}

function fieldHtml(fields) {
  return fields.map(function(f) {
    var input = f.ta ?
      '<textarea class="form-textarea mt-1" id="cf-'+f.key+'" placeholder="'+esc(f.placeholder||'')+'" style="width:100%">'+esc(contentVal(f.key))+'</textarea>' :
      '<input class="form-input mt-1" id="cf-'+f.key+'" value="'+esc(contentVal(f.key))+'" placeholder="'+esc(f.placeholder||'')+'">';
    return '<div class="content-field-wrap"><div class="content-field-meta"><div class="content-field-label">'+esc(f.label)+'</div><div class="td-id mb-1">'+esc(f.key)+'</div>'+input+'</div><button class="btn btn-primary btn-sm" style="margin-top:auto;flex-shrink:0" onclick="saveContentField(\''+f.key+'\')">Save</button></div>';
  }).join('');
}

function renderContentView(faqs) {
  var el = document.getElementById('pageContent');
  var genF  = [{key:'hero_title',label:'Hero Title',placeholder:'STICK YOUR STYLE.'},{key:'hero_subtitle',label:'Hero Subtitle',placeholder:'premium stickers…',ta:true},{key:'hero_cta_primary',label:'Primary Button',placeholder:'SHOP STICKERS'},{key:'about_text',label:'About Text',ta:true}];
  var socF  = [{key:'instagram_handle',label:'Instagram Handle',placeholder:'stickerversz'},{key:'contact_email',label:'Contact Email',placeholder:'stickerversz@gmail.com'},{key:'contact_location',label:'Location',placeholder:'Morocco 🇲🇦'}];
  var promoF= [{key:'promo_title',label:'Promo Title',placeholder:'Order More, Score Free!'},{key:'promo_subtitle',label:'Promo Subtitle',ta:true},{key:'hero_cta_free',label:'Free Stickers Button',placeholder:'🎁 GET FREE STICKERS'}];
  el.innerHTML =
    '<div class="page-transition">' +
      '<div class="page-header"><div class="page-header-left"><h2>Website Content</h2><p>Manage your shop content</p></div></div>' +
      '<div class="content-tabs">' +
        '<div class="content-tab '+(contentTab==='general'?'active':'')+'" onclick="switchContentTab(\'general\')">General</div>' +
        '<div class="content-tab '+(contentTab==='social'?'active':'')+'" onclick="switchContentTab(\'social\')">Social & Contact</div>' +
        '<div class="content-tab '+(contentTab==='promotions'?'active':'')+'" onclick="switchContentTab(\'promotions\')">Promotions</div>' +
        '<div class="content-tab '+(contentTab==='faqs'?'active':'')+'" onclick="switchContentTab(\'faqs\')">FAQs</div>' +
      '</div>' +
      '<div class="content-section '+(contentTab==='general'?'active':'')+'" id="tab-general">'+fieldHtml(genF)+'</div>' +
      '<div class="content-section '+(contentTab==='social'?'active':'')+'" id="tab-social">'+fieldHtml(socF)+'</div>' +
      '<div class="content-section '+(contentTab==='promotions'?'active':'')+'" id="tab-promotions">'+fieldHtml(promoF)+'</div>' +
      '<div class="content-section '+(contentTab==='faqs'?'active':'')+'" id="tab-faqs">' +
        '<div class="flex-between mb-2"><div class="section-title" style="margin:0">FAQs ('+faqs.length+')</div><button class="btn btn-primary btn-sm" onclick="openFaqModal()">+ Add FAQ</button></div>' +
        '<div id="faqList">' +
          (faqs.length===0 ? '<div class="empty-state"><div class="empty-icon">❓</div><p class="empty-title">No FAQs yet</p></div>' :
            faqs.map(function(f){ return '<div class="faq-item"><div class="faq-item-content"><div class="faq-question">'+esc(f.question)+'</div><div class="faq-answer">'+esc(f.answer)+'</div></div><div class="actions-cell"><button class="btn btn-ghost btn-icon btn-sm" onclick="openFaqModal('+f.id+',\''+esc(f.question).replace(/'/g,"\\'")+'\'  ,\''+esc(f.answer).replace(/'/g,"\\'")+'\')">✏️</button><button class="btn btn-danger btn-icon btn-sm" onclick="deleteFaq('+f.id+')">🗑</button></div></div>'; }).join('')) +
        '</div>' +
      '</div>' +
    '</div>';
}

function switchContentTab(tab) {
  contentTab = tab;
  var tabs = ['general','social','promotions','faqs'];
  document.querySelectorAll('.content-tab').forEach(function(el,i){ el.classList.toggle('active', tabs[i]===tab); });
  document.querySelectorAll('.content-section').forEach(function(el){ el.classList.toggle('active', el.id==='tab-'+tab); });
}

function saveContentField(key) {
  var el = document.getElementById('cf-'+key);
  if (!el) return;
  apiPut('/api/admin/content/site/'+key, {value:el.value, type:'text'}).then(function() {
    var row = State.content.find(function(r){ return r.key===key; });
    if (row) row.value = el.value;
    toast('"'+key+'" saved!');
  }).catch(function(err){ toast(err.message,'error'); });
}

function openFaqModal(id, question, answer) {
  question = question || ''; answer = answer || '';
  openModal(id?'Edit FAQ':'Add FAQ',
    '<div class="form-group mb-2"><label class="form-label form-label-required">Question</label><input class="form-input" id="faqQ" value="'+esc(question)+'" placeholder="e.g. Are stickers waterproof?" required></div>' +
    '<div class="form-group"><label class="form-label form-label-required">Answer</label><textarea class="form-textarea" id="faqA" placeholder="Your answer…" style="min-height:120px">'+esc(answer)+'</textarea></div>',
    '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveFaqBtn">💾 '+(id?'Save':'Add FAQ')+'</button>',
    {sm:true}
  );
  document.getElementById('saveFaqBtn').onclick = function() {
    var q=document.getElementById('faqQ').value.trim(); var a=document.getElementById('faqA').value.trim();
    if (!q||!a){ toast('Both question and answer are required','error'); return; }
    var btn=document.getElementById('saveFaqBtn'); btn.disabled=true;
    var req = id ? apiPut('/api/admin/content/faqs/'+id, {question:q,answer:a}) : apiPost('/api/admin/content/faqs', {question:q,answer:a});
    req.then(function(){ toast(id?'FAQ updated!':'FAQ added!'); closeModal(); renderContent(); })
       .catch(function(err){ toast(err.message,'error'); })
       .finally(function(){ btn.disabled=false; });
  };
}

function deleteFaq(id) {
  confirmDialog('Delete FAQ','Delete this FAQ?',{danger:true,okLabel:'Delete'}).then(function(ok) {
    if (!ok) return;
    apiDel('/api/admin/content/faqs/'+id).then(function(){ toast('FAQ deleted'); renderContent(); })
      .catch(function(err){ toast(err.message,'error'); });
  });
}

// ================================================================
//   SETTINGS
// ================================================================
function renderSettings() {
  var el = document.getElementById('pageContent');
  el.innerHTML =
    '<div class="page-transition">' +
      '<div class="page-header"><div class="page-header-left"><h2>Settings</h2><p>Admin account and shop configuration</p></div></div>' +
      '<div class="settings-section"><div class="settings-section-title">🔐 Change Password</div><div style="max-width:400px">' +
        '<div class="form-group mb-2"><label class="form-label">Current Password</label><input type="password" class="form-input" id="currPass"></div>' +
        '<div class="form-group mb-2"><label class="form-label">New Password</label><input type="password" class="form-input" id="newPass"></div>' +
        '<div class="form-group mb-2"><label class="form-label">Confirm New Password</label><input type="password" class="form-input" id="confPass"></div>' +
        '<button class="btn btn-primary" id="changePassBtn">Change Password</button>' +
        '<p class="form-error mt-1" id="passError"></p>' +
      '</div></div>' +
      '<div class="settings-section"><div class="settings-section-title">🏪 Shop Info</div>' +
        '<div class="order-detail-row"><span class="order-detail-label">Shop Name</span><span class="order-detail-value">StickerVersz</span></div>' +
        '<div class="order-detail-row"><span class="order-detail-label">Location</span><span class="order-detail-value">Morocco 🇲🇦</span></div>' +
        '<div class="order-detail-row"><span class="order-detail-label">Payment</span><span class="order-detail-value">Cash on Delivery (COD)</span></div>' +
        '<div class="order-detail-row"><span class="order-detail-label">Currency</span><span class="order-detail-value">MAD</span></div>' +
        '<div class="order-detail-row"><span class="order-detail-label">Database</span><span class="order-detail-value">SQLite (stickerversz.db)</span></div>' +
      '</div>' +
    '</div>';
  document.getElementById('changePassBtn').onclick = function() {
    var curr=document.getElementById('currPass').value;
    var newP=document.getElementById('newPass').value;
    var conf=document.getElementById('confPass').value;
    var errEl=document.getElementById('passError');
    errEl.classList.remove('show'); errEl.textContent='';
    if (!curr||!newP||!conf){ errEl.textContent='All fields are required'; errEl.classList.add('show'); return; }
    if (newP.length<6){ errEl.textContent='Password must be at least 6 characters'; errEl.classList.add('show'); return; }
    if (newP!==conf){ errEl.textContent='Passwords do not match'; errEl.classList.add('show'); return; }
    var btn=document.getElementById('changePassBtn'); btn.disabled=true; btn.textContent='Saving…';
    apiPost('/api/admin/change-password', {currentPassword:curr, newPassword:newP})
      .then(function(){ toast('Password changed!'); document.getElementById('currPass').value=''; document.getElementById('newPass').value=''; document.getElementById('confPass').value=''; })
      .catch(function(err){ errEl.textContent=err.message; errEl.classList.add('show'); })
      .finally(function(){ btn.disabled=false; btn.textContent='Change Password'; });
  };
}

// ================================================================
//   INIT
// ================================================================
// Global bindings for inline onclick handlers
window.navigate          = navigate;
window.closeModal        = closeModal;
window.openProductModal  = openProductModal;
window.deleteProduct     = deleteProduct;
window.openCategoryModal = openCategoryModal;
window.deleteCategory    = deleteCategory;
window.openOrderDetail   = openOrderDetail;
window.setOrderStatus    = setOrderStatus;
window.setInvFilter      = setInvFilter;
window.adjustStock       = adjustStock;
window.openStockModal    = openStockModal;
window.openDeliveryModal = openDeliveryModal;
window.deleteZone        = deleteZone;
window.switchContentTab  = switchContentTab;
window.saveContentField  = saveContentField;
window.openFaqModal      = openFaqModal;
window.deleteFaq         = deleteFaq;

initUser().then(function() { return updateNavBadges(); }).then(function() { navigate('dashboard'); });
