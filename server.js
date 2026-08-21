'use strict';
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { db, setup } = require('./db');

setup();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'stickerversz-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// Static: uploads and public customer site
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
const { requireAdmin, redirectIfLoggedIn } = require('./middleware/auth');

// ── Auth routes (login / logout) ────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/admin', authRoutes);

// ── Public API (customer-facing) ────────────────────────────────
const publicApiRoutes = require('./routes/api');
app.use('/api', publicApiRoutes);

// ── Admin API (/api/admin/*) ─────────────────────────────────────
const productsAdminRoutes  = require('./routes/admin/products');
const categoriesAdminRoutes= require('./routes/admin/categories');
const ordersAdminRoutes    = require('./routes/admin/orders');
const deliveryAdminRoutes  = require('./routes/admin/delivery');
const contentAdminRoutes   = require('./routes/admin/content');

app.use('/api/admin/products',   requireAdmin, productsAdminRoutes);
app.use('/api/admin/categories', requireAdmin, categoriesAdminRoutes);
app.use('/api/admin/orders',     requireAdmin, ordersAdminRoutes);
app.use('/api/admin/delivery',   requireAdmin, deliveryAdminRoutes);
app.use('/api/admin/content',    requireAdmin, contentAdminRoutes);

// ── Admin session endpoints ──────────────────────────────────────
app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ username: req.session.adminUsername || 'admin', id: req.session.adminId });
});

app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Both passwords required' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.session.adminId);
    if (!admin) return res.status(401).json({ error: 'Not authenticated' });
    const ok = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 12);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, admin.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin SPA (protected static) ────────────────────────────────
app.get('/admin', (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/admin/', (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Serve admin static assets (css, js) — no auth required for assets
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Customer SPA fallback ────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`StickerVersz running → http://localhost:${PORT}`);
  console.log(`Admin panel         → http://localhost:${PORT}/admin`);
});
