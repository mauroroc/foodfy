const User = require("../models/user");

module.exports = {
    async list (req, res) {
        const results = await User.all();
        const items = results.rows;
        res.render("admin/users_listagem", { items });
    },
    create (req, res){
        res.render("admin/users_criacao");
    },
    async post (req, res) {
        const { name, email, admin } = req.body;
        const keys = Object.keys(req.body);
        for(key of keys) {
            if (req.body[key] == "" && key != "id") {
                return res.send("Por favor, preencha todos os campos");
            }
        };
        const results = await User.findOne(email); 
        const data = { name: name, email: email, is_admin: admin }; 
        data.is_admin = req.body.admin ? true : false;   

        if (results.rowCount>0) {
            return res.render("admin/users_criacao", { error: 'Já existe um usuário cadastrado com esse e-mail', item: data});
        }
                          
        await User.create(data);

        return res.redirect(`/admin/users`);
    },
    async edit (req, res) {
        const results = await User.find(req.params.id)
        const item = results.rows[0];
        if(!item) return res.send("User não encontrado");

        return res.render("admin/users_edicao", { item });
    },
    async put(req, res) { 
        const data = req.body;
        data.is_admin = req.body.admin ? true : false;

        await User.update(data);

        return res.redirect('/admin/users');
    },
    async delete(req, res) {
        const id = req.body.idDel;
        const results = await User.hasRecipe(id);
        if (results.rowCount > 0) {
            return res.send("Esse usuário possui receitas e não pode ser deletado");
        }
        await User.delete(id)
        return res.redirect('/admin/users');
    }
}