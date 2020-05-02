const Recipe = require('../models/Recipe');
const File = require('../models/File');
const User = require('../models/User');

async function listAll(req){
    const results = await Recipe.all();
    const items = results.rows;
    for(i of items) {
        const results2 = await Recipe.files(i.id);
        const file = results2.rows[0];
        if(file){
            i.src = `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`  
        }
    };
    return items;
}

async function loadChefs() {
    const results = await Recipe.chefsSelectOptions();
    return results.rows;
}

module.exports = {
    async index(req, res) { 
        try {
            const items = await listAll(req);
            return res.render("admin/listagem", { items });       
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    async show(req, res) { 
        try {
            let results = await Recipe.findId(req.params.id);
            const recipe = results.rows[0];
            if(!recipe) {
                const items = await listAll(req);
                const message = 'Receita não encontrada'
                return res.render("admin/listagem", { items, msg: message, tipo: 'erro' });  
            }
            results = await Recipe.files(recipe.id);
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }));
            return res.render("admin/detalhe", { item: recipe, files });
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    async create(req, res) {
        try {
            const chefs = await loadChefs();
            return res.render("admin/criacao", { chefs }); 
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);
            for(key of keys) {
                if (req.body[key] == "" && key != "id") {
                    const chefs = await loadChefs();
                    const message = 'Por favor, preencha todos os campos';
                    return res.render("admin/criacao", { chefs, msg: message, tipo: 'error' }); 
                }
            } 
            if (req.files.length == 0) {
                const chefs = await loadChefs();
                const message = 'Por favor, envie pelo menos uma imagem';
                return res.render("admin/criacao", { chefs, msg: message, tipo: 'error' });
            }
            const data = {  
                title: req.body.title, 
                chef_id: req.body.author, 
                ingredients: req.body.ingredients, 
                preparation: req.body.preparation,
                information: req.body.information,
                user_id: req.body.user 
            }
            const recipeId = await Recipe.create(data);
            const filesPromise = req.files.map(file => File.create({...file}, recipeId));
            await Promise.all(filesPromise);
            const items = await listAll(req);
            const message = 'Receita cadastrada com sucesso!';
            return res.render("admin/listagem", { items, msg:message, tipo: 'success' }); 
        } catch (error) {
            console.log(error);
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        } 
    },
    async edit(req, res) { 
        try {
            let results = await Recipe.findId(req.params.id);
            const recipe = results.rows[0];
            if(!recipe) {
                const items = await listAll(req);
                const message = 'Receita não encontrada'
                return res.render("admin/listagem", { items, msg: message, tipo: 'error' }); 
            }
            //Testar se a receita pertence a esse usuário
            const isAdmin = await User.isAdmin(req.session.userId);
            if (recipe.user_id != req.session.userId && !(isAdmin.rows[0].is_admin)) {
                const items = await listAll(req);
                const message = 'Você não tem permissão para alterar essa receita'
                return res.render("admin/listagem", { items, msg: message, tipo: 'error' });
            }
             //pegando as imagens
            results = await Recipe.files(recipe.id);
            let files = results.rows;
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }));
            results = await Recipe.chefsSelectOptions();
            const items = results.rows;
            return res.render("admin/edicao", { item: recipe, chefs: items, files}); 
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }  
    },
    async put(req, res) { 
        try {
            console.log(req.body);
            const keys = Object.keys(req.body);
            const chefs = await loadChefs();
            const id = req.body.id;
            let results = await Recipe.findId(id);
            const item = results.rows[0];
            for(key of keys) {   
                if (req.body[key] == "" && key != "id" && key != "removed_files") {
                    const message = 'Por favor, preencha todos os campos';
                    return res.render("admin/edicao", { item, chefs, msg: message, tipo: 'error' });
                }
            } 
            const fotos = await Recipe.files(id);
            const apagar = req.body.removed_files ? parseInt(req.body.removed_files) : 0
            const total = fotos.rowCount - apagar;
            if (total == 0) {
                const message = 'Por favor, envie pelo menos uma imagem';
                return res.render("admin/edicao", { item, chefs, msg: message, tipo: 'error' });
            }

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create(file, id));
                await Promise.all(newFilesPromise);
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(","); //transformando string em array
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);
                const removedFilesPromise = removedFiles.map(idfile => File.delete(idfile));
                await Promise.all(removedFilesPromise);
            }
            const data = {
                title: req.body.title,
                information: req.body.information,
                chef_id: req.body.author,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation
            }
            await Recipe.update(data, id);
            const items = await listAll(req);
            const message = 'Receita atualizada com sucesso!';
            return res.render("admin/listagem", { items, msg:message, tipo: 'success' }); 
        } catch (error) {
            console.log(error);
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }  
    },
    async delete(req, res) { 
        try {
            const id = req.body.idDel;
            //pegar todas as fotos da receita
            results = await Recipe.files(id);
            const files = results.rows;
            const filesPromise = files.map(idfile => File.delete(idfile.id));
            await Promise.all(filesPromise);
            await Recipe.delete(id);
            const items = await listAll(req);
            const message = 'Receita excluída com sucesso!';
            return res.render("admin/listagem", { items, msg:message, tipo: 'success' }); 
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
        
    }
}

