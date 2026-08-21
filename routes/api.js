'use strict';
const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.get('/stickers', (req, res) => {
  try {
    const { category, search, featured, isNew, isBestSeller } = req.query;
    let query = "SELECT * FROM products WHERE status != 'coming_soon'";
    const params = [];
    if (category && category !== 'all') {
      query += ' AND category_slug = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(sticker_id) LIKE ? OR LOWER(category_slug) LIKE ?)';
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s, s);
    }
    if (featured === '1') query += ' AND is_featured = 1';
    if (isNew === '1') query += ' AND is_new = 1';
    if (isBestSeller === '1') query += ' AND is_best_seller = 1';
    query += ' ORDER BY created_at DESC';
    const products = db.prepare(query).all(...params);
    const formatted = products.map(p => ({
      id: p.sticker_id,
      name: p.name,
      category: p.category_slug,
      price: p.price,
      currency: p.currency,
      emoji: p.emoji || '✨',
      image: p.image || null,
      waterproof: Boolean(p.waterproof),
      isNew: Boolean(p.is_new),
      isBestSeller: Boolean(p.is_best_seller),
      isFeatured: Boolean(p.is_featured),
      stock: p.stock,
      status: p.status,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('GET /api/stickers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/categories', (req, res) => {
  try {
    const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/delivery', (req, res) => {
  try {
    const zones = db.prepare('SELECT * FROM delivery_zones ORDER BY city ASC').all();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/content', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value, type FROM site_content').all();
    const content = {};
    for (const r of rows) content[r.key] = r.value;
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/faqs', (req, res) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY sort_order ASC').all();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/orders', (req, res) => {
  try {
    const { customerName, customerPhone, customerCity, customerAddress, customerNotes, items, deliveryFee } = req.body;

    if (!customerName || !customerPhone || !customerCity || !customerAddress) {
      return res.status(400).json({ error: 'Missing required customer information' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    let subtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      if (!item.id || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Invalid item data' });
      }
      const product = db.prepare('SELECT * FROM products WHERE sticker_id = ?').get(item.id);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.id} not found` });
      }
      if (product.status === 'sold_out' || product.stock < item.quantity) {
        return res.status(400).json({ error: `${product.name} is out of stock` });
      }
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      validatedItems.push({ product, quantity: item.quantity, itemSubtotal });
    }

    const fee = parseFloat(deliveryFee) || 0;
    const total = subtotal + fee;
    const orderNumber = 'SV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

    const insertOrder = db.transaction(() => {
      const orderResult = db.prepare(`
        INSERT INTO orders (order_number, customer_name, customer_phone, customer_city, customer_address, customer_notes, subtotal, delivery_fee, total, payment_method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'cod', 'pending')
      `).run(orderNumber, customerName.trim(), customerPhone.trim(), customerCity.trim(), customerAddress.trim(), (customerNotes || '').trim(), subtotal, fee, total);

      const orderId = orderResult.lastInsertRowid;

      for (const { product, quantity, itemSubtotal } of validatedItems) {
        db.prepare(`
          INSERT INTO order_items (order_id, product_id, sticker_id, name, image, quantity, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(orderId, product.id, product.sticker_id, product.name, product.image || '', quantity, product.price, itemSubtotal);

        const newStock = product.stock - quantity;
        const newStatus = newStock <= 0 ? 'sold_out' : (newStock <= product.low_stock_threshold ? 'low_stock' : 'in_stock');
        db.prepare('UPDATE products SET stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(newStock, newStatus, product.id);
      }

      return orderId;
    });

    const orderId = insertOrder();
    res.json({ success: true, orderNumber, orderId, total, subtotal, deliveryFee: fee });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
