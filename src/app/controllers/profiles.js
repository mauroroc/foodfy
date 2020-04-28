const User = require('../models/user');
module.exports = {
    async index (req, res) {
        const results = await User.find(req.session.userId);
        const item = results.rows[0];
        res.render("admin/profile", { item });
    },
    async put (req, res) {
        await User.updateprofile(req.body);
        const message = 'Dados do usuário alterados com sucesso';
        res.render("admin/profile", { msg: message, tipo: "success"});
    }
}