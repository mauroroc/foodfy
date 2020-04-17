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
        const { filter } = req.query;
        if (filter) {
            Recipe.findBy(filter, (items)=> {
                return res.render("busca", { items, filter });
            }); 
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
