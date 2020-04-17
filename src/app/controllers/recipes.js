//const { date } = require('../../lib/utils');
const Recipe = require('../models/recipe');
const Chef = require('../models/chef');
const data = [];

module.exports = {
    index(req, res) 
    { 
        Recipe.all((items)=> {
            return res.render("home", { items });
        }); 
    },
    list(req, res) 
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
            Recipe.findBy(params); 
        } else {
            Recipe.all((items)=> {
                return res.render("receitas", { items });
            }); 
        }
        
    },
    chefs(req, res) 
    { 
        Chef.all((items)=> {
            return res.render("chefs", { items });
        });  
    },
    show(req, res) {
        Recipe.find(req.params.id, (recipe) => {
            if(!recipe) {
                return res.send("Receita não encontrado");
            }
            recipe.ingredients = recipe.ingredients.split(",");
            recipe.preparation = recipe.preparation.split(",");
            return res.render("receita", { item: recipe });
        })
    }
}
