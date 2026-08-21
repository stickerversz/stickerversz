'use strict';
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const { db } = require('../db');
const { redirectIfLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, '../admin') });
});

router.post('/login', redirectIfLoggedIn, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.adminId = user.id;
    req.session.adminUsername = user.username;
    req.session.save(() => {
      res.json({ success: true, redirect: '/admin/' });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, redirect: '/admin/login' });
  });
});

module.exports = router;
