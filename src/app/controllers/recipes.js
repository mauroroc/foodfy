//const { date } = require('../../lib/utils');
const Recipe = require('../models/recipe');
const Chef = require('../models/chef');

module.exports = {
    async index(req, res) 
    { 
        const results = await Recipe.all(); 
        const items = results.rows;
        return res.render("home", { items });
    },
    async list(req, res) 
    { 
        let { filter, page, limit } = req.query;

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(items) {
                const pagination = {
                    total: Math.ceil(items[0].total/limit),
                    page
                }
                return res.render("busca", { items, pagination, filter });
            }
        }

        if (filter) {
            await Recipe.findBy(params); 
        } else {
            const results = await Recipe.all();
            const items = results.rows;
            return res.render("receitas", { items });
        }
        
    },
    async chefs(req, res) 
    { 
        const result = await Chef.all();
        const items = results.rows;
        return res.render("chefs", { items });
    },
    async show(req, res) {
        const results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];
        if(!recipe) {
            return res.send("Receita não encontrado");
        }
        recipe.ingredients = recipe.ingredients.split(",");
        recipe.preparation = recipe.preparation.split(",");
        return res.render("receita", { item: recipe });
    }
}
