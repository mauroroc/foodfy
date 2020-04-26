const User = require('../models/user');
const { compare } = require('bcryptjs');

module.exports = {
    loginform (req, res) {
        res.render("admin/login");
    },
    async login (req, res) {
        let message = '';
        const results = await User.findOne(req.body.email);
        const item = results.rows[0];
        if (results.rowCount > 0) {
            const passed = await compare(req.body.password, item.password);
            if(!passed) {
                message = 'Senha incorreta';
                return res.render("admin/login", { msg: message, tipo: 'error' });
            }
            message = `Usuário logado com sucesso`;
            req.session.userId = item.id;
            res.render("admin/profile", { msg: message, tipo: 'success', item });
        } else {
            message = 'Usuário não encontrado';
            res.render("admin/login", { msg: message, tipo: 'error' });
        }
    },
    logout (req, res) {

    },
    forgot (req, res) {
        res.render("admin/login_esqueceu");
    },
    sendpasswd (req, res) {
        const message = 'Nova senha enviada para o e-mail cadastrado';
        res.render("admin/login_esqueceu", { msg: message, tipo : 'success'});
    },
    resetform (req, res) {
        res.render("admin/login_reset");
    },
    reset (req, res) {
        const message = 'Sua senha foi atualizada com sucesso';
        res.render("admin/login_reset", { msg: message, tipo : 'success'});
    }
}