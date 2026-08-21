'use strict';
const express = require('express');
const { db } = require('../../db');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    const withCounts = cats.map(c => {
      const { count } = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_slug = ?').get(c.slug);
      return { ...c, product_count: count };
    });
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', (req, res) => {
  try {
    const { slug, name, icon } = req.body;
    if (!slug || !name) return res.status(400).json({ error: 'slug and name required' });
    const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
    if (existing) return res.status(400).json({ error: 'Slug already exists' });
    const maxRow = db.prepare('SELECT MAX(sort_order) as max FROM categories').get();
    const result = db.prepare('INSERT INTO categories (slug, name, icon, sort_order) VALUES (?, ?, ?, ?)').run(
      slug.trim().toLowerCase(), name.trim(), icon || null, (maxRow.max || 0) + 1
    );
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Support PUT by numeric ID or by slug
router.put('/:id', (req, res) => {
  try {
    const isNumeric = /^\d+$/.test(req.params.id);
    const cat = isNumeric
      ? db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
      : db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    const { name, icon } = req.body;
    db.prepare('UPDATE categories SET name = ?, icon = ? WHERE id = ?').run(
      name || cat.name, icon !== undefined ? icon : cat.icon, cat.id
    );
    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(cat.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Support DELETE by numeric ID or by slug
router.delete('/:id', (req, res) => {
  try {
    const isNumeric = /^\d+$/.test(req.params.id);
    const cat = isNumeric
      ? db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
      : db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    const { count } = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_slug = ?').get(cat.slug);
    if (count > 0) return res.status(400).json({ error: `Cannot delete: ${count} products use this category` });
    db.prepare('DELETE FROM categories WHERE id = ?').run(cat.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reorder', (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array of slugs' });
    const update = db.prepare('UPDATE categories SET sort_order = ? WHERE slug = ?');
    const reorderAll = db.transaction(() => { order.forEach((slug, i) => update.run(i, slug)); });
    reorderAll();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
