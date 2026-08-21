'use strict';

function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  const isApiReq = (req.originalUrl || '').includes('/api/') ||
    (req.headers.accept || '').includes('application/json');
  if (isApiReq) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.redirect('/admin/login');
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin/');
  }
  next();
}

module.exports = { requireAdmin, redirectIfLoggedIn };
