'use strict';
const express = require('express');
const { db } = require('../../db');
const router = express.Router();

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

router.get('/stats', (req, res) => {
  try {
    const count = s => db.prepare(`SELECT COUNT(*) as c FROM orders WHERE status=?`).get(s).c;
    const total        = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
    const pending      = count('pending');
    const confirmed    = count('confirmed');
    const preparing    = count('preparing');
    const shipped      = count('shipped');
    const out_for_delivery = count('out_for_delivery');
    const delivered    = count('delivered');
    const cancelled    = count('cancelled');
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status='delivered'").get().s;
    res.json({ total, pending, confirmed, preparing, shipped, out_for_delivery, delivered, cancelled, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', (req, res) => {
  try {
    const { status, search, page = 1, limit = 25, sort = 'created_at', dir = 'desc' } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (search) {
      query += ' AND (LOWER(order_number) LIKE ? OR LOWER(customer_name) LIKE ? OR LOWER(customer_phone) LIKE ?)';
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s, s);
    }
    const total = db.prepare(query.replace('SELECT *', 'SELECT COUNT(*)')).get(...params)['COUNT(*)'];
    const safeSort = ['created_at', 'total', 'status', 'customer_name'].includes(sort) ? sort : 'created_at';
    const safeDir = dir === 'asc' ? 'ASC' : 'DESC';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY ${safeSort} ${safeDir} LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const orders = db.prepare(query).all(...params);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });

    const updateStatus = db.transaction(() => {
      db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);

      if (status === 'cancelled' && order.status !== 'cancelled') {
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
        for (const item of items) {
          const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
          if (!product) continue;
          const newStock = product.stock + item.quantity;
          const newStatus = newStock <= 0 ? 'sold_out' : newStock <= product.low_stock_threshold ? 'low_stock' : 'in_stock';
          db.prepare('UPDATE products SET stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStock, newStatus, product.id);
        }
      }

      if (order.status === 'cancelled' && status !== 'cancelled') {
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
        for (const item of items) {
          const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
          if (!product) continue;
          const newStock = Math.max(0, product.stock - item.quantity);
          const newStatus = newStock <= 0 ? 'sold_out' : newStock <= product.low_stock_threshold ? 'low_stock' : 'in_stock';
          db.prepare('UPDATE products SET stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStock, newStatus, product.id);
        }
      }
    });

    updateStatus();
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
