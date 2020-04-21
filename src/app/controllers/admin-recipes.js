//const { date } = require('../../lib/utils');
const Recipe = require('../models/recipe');
const Chef = require('../models/chef');
const File = require('../models/file');
  
module.exports = {
    async index(req, res) { 
        const results = await Recipe.all();
        const items = results.rows;
        return res.render("admin/listagem", { items });
    },
    async show(req, res) { 
        const results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];
            if(!recipe) {
                return res.send("Receita não encontrado");
            }
            recipe.ingredients = recipe.ingredients.split(",");
            recipe.preparation = recipe.preparation.split(",");
            return res.render("admin/detalhe", { item: recipe });
    },
    async create(req, res) { 
        const results = await Recipe.chefsSelectOptions();
        const items = results.rows;
        return res.render("admin/criacao", { chefs: items}); 
    },
    async post(req, res) { 
        const keys = Object.keys(req.body);
        for(key of keys) {
            if (req.body[key] == "" && key != "id") {
                return res.send("Por favor, preencha todos os campos");
            }
        } 
        
        if (req.files.lenght == 0) {
            return res.send("Por favor, envie pelo menos uma imagem");
        }

        const results = await Recipe.create(req.body);
        const recipeId = results.rows[0].id;

        const filesPromise = req.files.map(file => File.create({...file}, recipeId));
        await Promise.all(filesPromise);
        
        return res.redirect(`/admin/recipes/${recipeId}`);
    },
    async edit(req, res) { 
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];
        
        if(!recipe) return res.send("Receita não encontrada");
        
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
    },
    async put(req, res) { 
        const keys = Object.keys(req.body);
        for(key of keys) {
            if (req.body[key] == "" && key != "id" && key != "removed_files") {
                return res.send("Por favor, preencha todos os campos");
            }
        } 
        
        if (req.files.lenght == 0) {
            return res.send("Por favor, envie pelo menos uma imagem");
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create(file, req.body.id));
            await Promise.all(newFilesPromise);
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(","); //transformando string em array
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);
            const removedFilesPromise = removedFiles.map(id => File.delete(id));
            await Promise.all(removedFilesPromise);
        }

        await Recipe.update(req.body);
        return res.redirect(`/admin/recipes/${req.body.id}`);
    },
    async delete(req, res) { 
        await Recipe.delete(req.body.idDel);
        return res.redirect(`/admin/recipes/`);
    }
}

