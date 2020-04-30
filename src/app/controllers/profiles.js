const User = require('../models/user');
module.exports = {
    async index (req, res) {
        try {
            const results = await User.find(req.session.userId);
            const item = results.rows[0];
            res.render("admin/profile", { item });
        } catch (error) {
            const message = 'Houve erro ao carregar o profile'
            return res.render("admin/permissao", { msg: message } );
        }
        
    },
    async put (req, res) {
        try {
            await User.updateprofile(req.body);
            const message = 'Dados do usuário alterados com sucesso';
            res.render("admin/profile", { msg: message, tipo: "success"});
        } catch (error) {
            const message = 'Houve erro ao carregar o profile'
            return res.render("admin/permissao", { msg: message } );
        }
        
    }
}