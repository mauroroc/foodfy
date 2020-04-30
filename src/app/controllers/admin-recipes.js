//const { date } = require('../../lib/utils');
const Recipe = require('../models/recipe');
const Chef = require('../models/chef');
const File = require('../models/file');
const User = require('../models/user');

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
            let results = await Recipe.find(req.params.id);
            const recipe = results.rows[0];
            if(!recipe) {
                const items = await listAll(req);
                const message = 'Receita não encontrada'
                return res.render("admin/listagem", { items, msg: message, tipo: 'erro' });  
            }
            recipe.ingredients = recipe.ingredients.split(",");
            recipe.preparation = recipe.preparation.split(",");
            
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
            const results = await Recipe.create(req.body);
            const recipeId = results.rows[0].id;
            const filesPromise = req.files.map(file => File.create({...file}, recipeId));
            await Promise.all(filesPromise);
            const items = await listAll(req);
            const message = 'Receita cadastrada com sucesso!';
            return res.render("admin/listagem", { items, msg:message, tipo: 'success' }); 
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        } 
    },
    async edit(req, res) { 
        try {
            let results = await Recipe.find(req.params.id);
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
            //transformando vetor em string
            recipe.ingredients = recipe.ingredients.split(",");
            recipe.preparation = recipe.preparation.split(",");
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
        //try {
            const keys = Object.keys(req.body);
            const chefs = await loadChefs();
            let results = await Recipe.find(req.body.id);
            const item = results.rows[0];
            for(key of keys) {   
                if (req.body[key] == "" && key != "id" && key != "removed_files") {
                    const message = 'Por favor, preencha todos os campos';
                    return res.render("admin/edicao", { item, chefs, msg: message, tipo: 'error' });
                }
            } 
            console.log(req.files);
            if (req.files.length == 0) {
                const message = 'Por favor, envie pelo menos uma imagem';
                return res.render("admin/edicao", { item, chefs, msg: message, tipo: 'error' });
            }

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create(file, req.body.id));
                await Promise.all(newFilesPromise);
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(","); //transformando string em array
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);
                console.log(removedFiles);
                const removedFilesPromise = removedFiles.map(id => File.delete(id));
                await Promise.all(removedFilesPromise);
            }
            //transformando vetor em string
            if (Array.isArray(req.body.ingredients)) req.body.ingredients.join();
            if (Array.isArray(req.body.preparation)) req.body.preparation.join();
            
            await Recipe.update(req.body);
            const items = await listAll(req);
            const message = 'Receita atualizada com sucesso!';
            return res.render("admin/listagem", { items, msg:message, tipo: 'success' }); 
        /*} catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }*/  
    },
    async delete(req, res) { 
        try {
            await Recipe.delete(req.body.idDel);
            const items = await listAll(req);
            const message = 'Receita excluída com sucesso!';
            return res.render("admin/listagem", { items, msg:message, tipo: 'success' }); 
        } catch (error) {
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/permissao", { msg: message } );
        }
        
    }
}

