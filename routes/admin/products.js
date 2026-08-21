'use strict';
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../../db');
const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.get('/', (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 50 } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (category) { query += ' AND category_slug = ?'; params.push(category); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(sticker_id) LIKE ?)';
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s);
    }
    const total = db.prepare(query.replace('SELECT *', 'SELECT COUNT(*)')).get(...params)['COUNT(*)'];
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order').all(product.id);
    res.json({ ...product, images });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', upload.single('image'), (req, res) => {
  try {
    const { sticker_id, name, category_slug, price, description, emoji, stock, low_stock_threshold, is_new, is_best_seller, is_featured, waterproof, status } = req.body;
    if (!sticker_id || !name || !category_slug || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = db.prepare('SELECT id FROM products WHERE sticker_id = ?').get(sticker_id);
    if (existing) return res.status(400).json({ error: 'Sticker ID already exists' });

    const stockNum = parseInt(stock) || 0;
    const threshold = parseInt(low_stock_threshold) || 5;
    let computedStatus = status || (stockNum <= 0 ? 'sold_out' : stockNum <= threshold ? 'low_stock' : 'in_stock');
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    const result = db.prepare(`
      INSERT INTO products (sticker_id, name, category_slug, price, currency, description, emoji, image, stock, status, low_stock_threshold, is_new, is_best_seller, is_featured, waterproof)
      VALUES (?, ?, ?, ?, 'MAD', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sticker_id, name, category_slug, parseFloat(price), description || '', emoji || '✨', imagePath, stockNum, computedStatus, threshold,
      is_new === '1' || is_new === true ? 1 : 0,
      is_best_seller === '1' || is_best_seller === true ? 1 : 0,
      is_featured === '1' || is_featured === true ? 1 : 0,
      waterproof === '1' || waterproof === true ? 1 : 0);

    if (imagePath) {
      db.prepare('INSERT INTO product_images (product_id, path, is_primary, sort_order) VALUES (?, ?, 1, 0)').run(result.lastInsertRowid, imagePath);
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', upload.single('image'), (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    const { name, category_slug, price, description, emoji, stock, low_stock_threshold, is_new, is_best_seller, is_featured, waterproof, status } = req.body;
    const stockNum = parseInt(stock) ?? product.stock;
    const threshold = parseInt(low_stock_threshold) ?? product.low_stock_threshold;
    let computedStatus = status || (stockNum <= 0 ? 'sold_out' : stockNum <= threshold ? 'low_stock' : 'in_stock');
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : product.image;

    db.prepare(`
      UPDATE products SET name=?, category_slug=?, price=?, description=?, emoji=?, image=?, stock=?, status=?, low_stock_threshold=?, is_new=?, is_best_seller=?, is_featured=?, waterproof=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(
      name || product.name, category_slug || product.category_slug, parseFloat(price) || product.price,
      description ?? product.description, emoji || product.emoji, imagePath,
      stockNum, computedStatus, threshold,
      is_new === '1' || is_new === true ? 1 : (is_new === '0' || is_new === false ? 0 : product.is_new),
      is_best_seller === '1' || is_best_seller === true ? 1 : (is_best_seller === '0' || is_best_seller === false ? 0 : product.is_best_seller),
      is_featured === '1' || is_featured === true ? 1 : (is_featured === '0' || is_featured === false ? 0 : product.is_featured),
      waterproof === '1' || waterproof === true ? 1 : (waterproof === '0' || waterproof === false ? 0 : product.waterproof),
      req.params.id
    );

    if (req.file) {
      const existing = db.prepare('SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1').get(product.id);
      if (existing) db.prepare('UPDATE product_images SET path = ? WHERE id = ?').run(imagePath, existing.id);
      else db.prepare('INSERT INTO product_images (product_id, path, is_primary, sort_order) VALUES (?, ?, 1, 0)').run(product.id, imagePath);
    }

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/stock', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    const stock = parseInt(req.body.stock);
    if (isNaN(stock) || stock < 0) return res.status(400).json({ error: 'Invalid stock value' });
    const status = stock <= 0 ? 'sold_out' : stock <= product.low_stock_threshold ? 'low_stock' : 'in_stock';
    db.prepare('UPDATE products SET stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(stock, status, req.params.id);
    res.json({ stock, status });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    const orderItems = db.prepare('SELECT id FROM order_items WHERE product_id = ?').all(product.id);
    if (orderItems.length > 0) {
      db.prepare("UPDATE products SET status = 'coming_soon', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);
      return res.json({ archived: true, message: 'Product has orders — archived instead of deleted' });
    }
    db.prepare('DELETE FROM product_images WHERE product_id = ?').run(product.id);
    db.prepare('DELETE FROM products WHERE id = ?').run(product.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
