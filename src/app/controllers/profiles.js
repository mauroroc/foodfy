const User = require('../models/user');
module.exports = {
    index (req, res) {
        res.render("admin/profile");
    },
    async put (req, res) {
        await User.updateprofile(req.body);
        const message = 'Dados do usuário alterados com sucesso';
        res.render("admin/profile", { msg: message, tipo: "success"});
    }
}