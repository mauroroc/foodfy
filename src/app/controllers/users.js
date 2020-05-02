const User = require("../models/User");
const crypto = require('crypto');
const mailer = require('../../config/mailer');
const Recipe = require("../models/Recipe");
const File = require("../models/File");

module.exports = {
    async list (req, res) {
        try {
            const results = await User.all();
            const items = results.rows;
            res.render("admin/users_listagem", { items });
        } catch (error) {
            const message = 'Houve erro no processamento dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    create (req, res){
        res.render("admin/users_criacao");
    },
    async post (req, res) {
        try {
            const { name, email, admin } = req.body;
            const data = { name: name, email: email, is_admin: admin, password: 'temporario' };
            data.is_admin = req.body.admin ? true : false;   
            const keys = Object.keys(req.body);
            for(key of keys) {
                if (req.body[key] == "" && key != "id") {
                    const message = 'Por favor, preencha todos os campos';
                    return res.render("admin/users_criacao", { msg: message, tipo:'error', item: data } );
                }
            };
            let results = await User.findEmail(email); 
            if (results.rowCount>0) {
                const message = 'Já existe um usuário cadastrado com esse e-mail';
                return res.render("admin/users_criacao", { msg: message, tipo:'error', item: data});
            }        
            const id = await User.create(data);  
            //token para o usuário
            const token = crypto.randomBytes(20).toString("hex");
            //data exp para o token
            let now = new Date();
            now = now.setHours(now.getHours() + 1);
            await User.createToken(id, {
                reset_token: token,
                reset_token_expires: now
            });            
            //enviar email com link de recuperação de senha
            const link = 'http://localhost:3000/reset?token=' + token;
            const html = `
                <h2>Esqueci minha senha</h2>
                <p>Clique no link abaixo para criar uma nova senha:</p>
                <a href="${link}" target="_blank">Gerar token para nova senha</a>
            `
            await mailer.sendMail({
                to: email,
                from: 'no-reply@mauror.com.br',
                subject: 'Recuperação de senha',
                html: html
            });
            //avisar o usuário que o e-mail foi enviado        
            results = await User.all();
            const items = results.rows;    
            const message = 'Usuário criado com sucesso. Acesse seu e-mail para gerar a senha'
            return res.render(`admin/users_listagem`, { msg: message, tipo: 'success', items});
        } catch (error) {
            const message = 'Houve erro no processamento dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    async edit (req, res) {
        try {
            const results = await User.findId(req.params.id)
            const item = results.rows[0];
            if(!item) {
                const results = await User.all();
                const items = results.rows;
                const message = 'Usuário não encontrado'   
                return res.render(`admin/users_listagem`, { msg: message, tipo: 'error', items});
            }
            return res.render("admin/users_edicao", { item });
        } catch (error) {
            const message = 'Houve erro no processamento dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    async put(req, res) { 
        try {
            const data = { name: req.body.name, email: req.body.email };
            data.is_admin = req.body.admin ? true : false;
            await User.update(data, req.body.id);
            const results = await User.all();
            const items = results.rows;
            const message = 'Usuário alterado com sucesso'   
            return res.render("admin/users_listagem", { msg: message, tipo: 'success', items});
        } catch (error) {
            const message = 'Houve erro no processamento dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    async delete(req, res) {
        const id = req.body.idDel;
        //let results = await User.hasRecipe(id);
        if (id == req.session.userId) {
            const message = 'Você não pode excluir sua própria conta';
            const results2 = await User.find(id);
            const item = results2.rows[0];
            return res.render("admin/users_edicao", {msg: message, tipo: "error", item});
        }
        //pegar todas as receitas
        results = await Recipe.findAllUser(id);
        const recipes = results.rows;
        for (recipe in recipes) {
            results = await Recipe.files(recipe.id);
            if (results.rows) {
                results.rows.forEach(async element => {
                await File.delete(element.id);
                });
            }
        }
        await User.delete(id)
        results = await User.all();
        const items = results.rows;
        const message = 'Usuário excluído com sucesso'   
        return res.render(`admin/users_listagem`, { msg: message, tipo: 'success', items});
    }
}