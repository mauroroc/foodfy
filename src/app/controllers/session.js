const User = require('../models/User');
const { compare, hash } = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../../config/mailer');

module.exports = {
    loginform (req, res) {
        res.render("admin/login");
    },
    async login (req, res) {
        try {
            let message = '';
            const results = await User.findEmail(req.body.email);
            const item = results.rows[0];
            if (results.rowCount > 0) {
                const passed = await compare(req.body.password, item.password);
                if(!passed) {
                    message = 'Senha incorreta';
                    return res.render("admin/login", { msg: message, tipo: 'error' });
                }
                message = `Usuário logado com sucesso`;
                req.session.userId = item.id;
                item.is_admin ? req.session.isAdmin = true : req.session.isAdmin = false;
                res.render("admin/profile", { msg: message, tipo: 'success', item });
            } else {
                message = 'Usuário não encontrado';
                res.render("admin/login", { msg: message, tipo: 'error' });
            } 
        } catch (error) {
            const message = 'Houve erro ao carregar o profile'
            return res.render("admin/erro", { msg: message } );
        }
        
    },
    logout (req, res) {
        req.session.destroy();
        return res.redirect("/login");
    },
    forgot (req, res) {
        res.render("admin/login_esqueceu");
    },
    async sendpasswd (req, res) {
        try {
            const results = await User.findOne(req.body.email);
            const item = results.rows[0];
            if (!item) {
                const message = 'Não existe usuário com esse e-mail no sistema';
                return res.render("admin/login_esqueceu", { msg: message, tipo : 'error'});
            }
            //token para o usuário
            const token = crypto.randomBytes(20).toString("hex");
            //data exp para o token
            let now = new Date();
            now = now.setHours(now.getHours() + 1);
            await User.createToken(item.id, {
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
                to: item.email,
                from: 'no-reply@mauror.com.br',
                subject: 'Recuperação de senha',
                html: html
            });
            //avisar o usuário que o e-mail foi enviado
            const message = 'Nova senha enviada para o e-mail cadastrado';
            res.render("admin/login_esqueceu", { msg: message, tipo : 'success'});
        } catch (error) {
            const message = 'Houve erro ao carregar o profile'
            return res.render("admin/erro", { msg: message } );
        }      
    },
    async resetform (req, res) {
        const token = req.query.token;
        try {
            const results = await User.findToken(token);
            const item = results.rows[0];
            return res.render("admin/login_reset", { token, email: item.email });
        }
        catch (err) {
            const message = 'Seu token de alteração de senha não existe ou expirou';
            return res.render("admin/login_esqueceu", { msg: message, tipo : 'error'});
        }  
    },
    async reset (req, res) {
        const { email, senha, repetesenha, token } = req.body;
        try {
            //Localizar o usuário
            const results = await User.findToken(token);
            const item = results.rows[0];
            //ver se as senhas digitadas são iguais
            if(senha != repetesenha) {
                const message = 'As senhas digitadas não conferem, precisam ser iguais';
                return res.render("admin/login_reset", { msg: message, tipo : 'error', item, token});
            }
            // verificar se o token não expirou
            let now = new Date();
            now = now.setHours(now.getHours());
            if (now > item.reset_token_expires) {
                const message = 'Seu token já expirou. Favor solicitar outro';
                return res.render("admin/login_esqueceu", { msg: message, tipo : 'error'});
            }

            // criar um novo hash de senha
            const passwordHash = await hash(senha, 8);

            // atualizar a senha do usuario
            await User.updatePassword(item.id, passwordHash);

            // avisar o usuário que ele tem uma nova senha
            const message = 'Sua senha foi atualizada com sucesso';
            return res.render("admin/login", { msg: message, tipo: 'success' });

        } catch (err) {
            const message = 'Houve erro na alteração da senha';
            return res.render("admin/login_reset", { msg: message, tipo : 'error', item, token});
        }  
    }
}