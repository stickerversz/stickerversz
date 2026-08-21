'use strict';
const express = require('express');
const bcrypt = require('bcrypt');
const { db } = require('../../db');
const router = express.Router();

router.get('/dashboard-stats', (req, res) => {
  try {
    const totalProds   = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
    const inStock      = db.prepare("SELECT COUNT(*) as c FROM products WHERE status='in_stock'").get().c;
    const lowStock     = db.prepare("SELECT COUNT(*) as c FROM products WHERE status='low_stock'").get().c;
    const soldOut      = db.prepare("SELECT COUNT(*) as c FROM products WHERE status='sold_out'").get().c;
    const totalOrders  = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
    const pending      = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='pending'").get().c;
    const confirmed    = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='confirmed'").get().c;
    const preparing    = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='preparing'").get().c;
    const shipped      = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='shipped'").get().c;
    const outForDel    = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='out_for_delivery'").get().c;
    const delivered    = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='delivered'").get().c;
    const cancelled    = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='cancelled'").get().c;
    const todayCount   = db.prepare("SELECT COUNT(*) as c FROM orders WHERE DATE(created_at)=DATE('now')").get().c;
    const totalRev     = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status='delivered'").get().s;
    const monthRev     = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status='delivered' AND strftime('%Y-%m',created_at)=strftime('%Y-%m','now')").get().s;
    const todayRev     = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status='delivered' AND DATE(created_at)=DATE('now')").get().s;
    const cats         = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
    const recentOrders = db.prepare('SELECT id,order_number,customer_name,total,status,created_at FROM orders ORDER BY created_at DESC LIMIT 5').all();
    const recentProds  = db.prepare('SELECT id,sticker_id,name,status,stock,image,emoji FROM products ORDER BY created_at DESC LIMIT 5').all();
    res.json({
      products: { total:totalProds, inStock, lowStock, soldOut },
      orders:   { total:totalOrders, pending, confirmed, preparing, shipped, out_for_delivery:outForDel, delivered, cancelled, todayCount },
      revenue:  { total:totalRev, thisMonth:monthRev, today:todayRev },
      categories: cats,
      recentOrders,
      recentProducts: recentProds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/site', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM site_content ORDER BY key').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/site/:key', (req, res) => {
  try {
    const { value } = req.body;
    db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP').run(
      req.params.key, value ?? '', value ?? ''
    );
    res.json(db.prepare('SELECT * FROM site_content WHERE key = ?').get(req.params.key));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/site', (req, res) => {
  try {
    const updates = req.body;
    const upsert = db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP');
    const tx = db.transaction((kvs) => {
      for (const [key, value] of Object.entries(kvs)) {
        upsert.run(key, value ?? '', value ?? '');
      }
    });
    tx(updates);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/faqs', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM faqs ORDER BY sort_order, id').all());
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/faqs', (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });
    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order),0) as m FROM faqs').get().m;
    const result = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)').run(question.trim(), answer.trim(), maxOrder + 1);
    res.json(db.prepare('SELECT * FROM faqs WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/faqs/:id', (req, res) => {
  try {
    const faq = db.prepare('SELECT * FROM faqs WHERE id = ?').get(req.params.id);
    if (!faq) return res.status(404).json({ error: 'Not found' });
    const { question, answer, sort_order } = req.body;
    db.prepare('UPDATE faqs SET question = ?, answer = ?, sort_order = ? WHERE id = ?').run(
      question ?? faq.question, answer ?? faq.answer, sort_order ?? faq.sort_order, req.params.id
    );
    res.json(db.prepare('SELECT * FROM faqs WHERE id = ?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/faqs/:id', (req, res) => {
  try {
    if (!db.prepare('SELECT id FROM faqs WHERE id = ?').get(req.params.id)) return res.status(404).json({ error: 'Not found' });
    db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/change-password', (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ error: 'Both passwords required' });
    if (new_password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.session.adminId);
    if (!admin) return res.status(401).json({ error: 'Not authenticated' });
    if (!bcrypt.compareSync(current_password, admin.password_hash)) return res.status(400).json({ error: 'Current password is incorrect' });
    const hash = bcrypt.hashSync(new_password, 12);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, admin.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
