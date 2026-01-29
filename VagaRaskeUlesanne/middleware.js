// Проверка, что пользователь вошёл
function requireLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

// Проверка, что пользователь — админ
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Ligipääs keelatud');
    }
    next();
}

module.exports = { requireLogin, requireAdmin };
