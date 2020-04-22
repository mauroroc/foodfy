//const { date } = require('../../lib/utils');
const Recipe = require('../models/recipe');
const Chef = require('../models/chef');
const File = require('../models/file');

module.exports = {
    async index(req, res) 
    { 
        const results = await Recipe.all(); 
        const items = results.rows;
        for(i of items) {
            const results2 = await Recipe.files(i.id);
            const file = results2.rows[0];
            if(file){
                i.src = `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`  
            }
        };
        return res.render("home", { items });
    },
    async list(req, res) 
    { 
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        if (filter) {
            const results = await Recipe.findBy(filter, limit, offset); 
            const items = results.rows;
            const params = {
                filter,
                page,
                limit,
                offset,
                total: Math.ceil(items[0].total/limit),
                page
            }
            for(i of items) {
                const results2 = await Recipe.files(i.id);
                const file = results2.rows[0];
                if(file){
                    i.src = `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`  
                }
            };
            return res.render("busca", { items, params, filter });

        } else {
            const results = await Recipe.all();
            const items = results.rows;
            for(i of items) {
                const results2 = await Recipe.files(i.id);
                const file = results2.rows[0];
                if(file){
                    i.src = `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`  
                }
            };
            return res.render("receitas", { items });
        };
    },
    async chefs(req, res) 
    { 
        let results = await Chef.all();
        const items = results.rows;
        for(i of items) {
            results = await File.list(i.file_id);
            if (results.rowCount > 0) i.avatar = results.rows[0].name;
        };
        return res.render("chefs", { items });
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];
        if(!recipe) {
            return res.send("Receita não encontrado");
        }
        recipe.ingredients = recipe.ingredients.split(",");
        recipe.preparation = recipe.preparation.split(",");
        
        results = await Recipe.files(recipe.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }));

        return res.render("receita", { item: recipe, files });
    }
}
