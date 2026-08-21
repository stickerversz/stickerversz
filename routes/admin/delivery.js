'use strict';
const express = require('express');
const { db } = require('../../db');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const zones = db.prepare('SELECT * FROM delivery_zones ORDER BY is_default DESC, city ASC').all();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', (req, res) => {
  try {
    const { city, price, is_default } = req.body;
    if (!city || price == null) return res.status(400).json({ error: 'city and price required' });
    if (is_default) {
      db.prepare('UPDATE delivery_zones SET is_default = 0').run();
    }
    const result = db.prepare('INSERT INTO delivery_zones (city, price, is_default) VALUES (?, ?, ?)').run(
      city.trim(), parseFloat(price), is_default ? 1 : 0
    );
    res.json(db.prepare('SELECT * FROM delivery_zones WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { city, price, is_default } = req.body;
    const zone = db.prepare('SELECT * FROM delivery_zones WHERE id = ?').get(req.params.id);
    if (!zone) return res.status(404).json({ error: 'Not found' });
    if (is_default) {
      db.prepare('UPDATE delivery_zones SET is_default = 0 WHERE id != ?').run(req.params.id);
    }
    db.prepare('UPDATE delivery_zones SET city = ?, price = ?, is_default = ? WHERE id = ?').run(
      (city || zone.city).trim(), price != null ? parseFloat(price) : zone.price,
      is_default ? 1 : 0, req.params.id
    );
    res.json(db.prepare('SELECT * FROM delivery_zones WHERE id = ?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const zone = db.prepare('SELECT * FROM delivery_zones WHERE id = ?').get(req.params.id);
    if (!zone) return res.status(404).json({ error: 'Not found' });
    if (zone.is_default) return res.status(400).json({ error: 'Cannot delete the default zone. Set another zone as default first.' });
    db.prepare('DELETE FROM delivery_zones WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
