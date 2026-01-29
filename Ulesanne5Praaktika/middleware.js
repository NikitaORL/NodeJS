function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function bypassLogin(req, res, next) {
    if (req.session.user) {
        return res.redirect('/admin');
    }
    next();
}

module.exports = {
    requireLogin,
    bypassLogin
};