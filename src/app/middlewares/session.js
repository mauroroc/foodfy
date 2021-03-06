function onlyUsers(req, res, next) {
    if (!req.session.userId) return res.redirect('/login');
    next();
}

function onlyAdmin(req, res, next) {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.render("admin/permissao", { msg: 'Você não tem permissão para acessar essa área'});
    }
    next();
}

function isLoggedToProfile (req, res, next) {
    if (req.session.userId) return res.redirect('/admin/profile');
    next();
}

module.exports = {
    onlyUsers, onlyAdmin, isLoggedToProfile
}