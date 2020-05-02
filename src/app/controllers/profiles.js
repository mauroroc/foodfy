const User = require('../models/User');
const { hash } = require('bcryptjs');

module.exports = {
    async index (req, res) {
        try {
            const results = await User.findId(req.session.userId);
            const item = results.rows[0];
            res.render("admin/profile", { item });
        } catch (error) {
            const message = 'Houve erro ao carregar o profile'
            return res.render("admin/erro", { msg: message } );
        }
        
    },
    async put (req, res) {
        try {
            const data = { name: req.body.name, email: req.body.email }
            const id = req.body.id
            if(req.body.password != '') {
                const password = req.body.password;
                data.password = await hash(password, 8);
            }
            await User.update(data, id);
            const message = 'Dados do usuário alterados com sucesso';
            res.render("admin/profile", { msg: message, tipo: "success"});
        } catch (error) {
            const message = 'Houve erro ao carregar o profile'
            return res.render("admin/erro", { msg: message } );
        }
        
    }
}