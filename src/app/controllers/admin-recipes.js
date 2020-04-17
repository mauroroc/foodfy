//const { date } = require('../../lib/utils');
const Recipe = require('../models/recipe');
const Chef = require('../models/chef');
  
module.exports = {
    index(req, res) { 
        Recipe.all((items)=> {
            return res.render("admin/listagem", { items });
        }); 
    },
    show(req, res) { 
        Recipe.find(req.params.id, (recipe) => {
            if(!recipe) {
                return res.send("Receita não encontrado");
            }
            recipe.ingredients = recipe.ingredients.split(",");
            recipe.preparation = recipe.preparation.split(",");
            return res.render("admin/detalhe", { item: recipe });
        })
    },
    create(req, res) { 
        Recipe.chefsSelectOptions((items) => {
            return res.render("admin/criacao", { chefs: items}); 
        });
    },
    post(req, res) { 
        const keys = Object.keys(req.body);
        for(key of keys) {
            if (req.body[key] == "" && key != "id") {
                return res.send("Por favor, preencha todos os campos");
            }
        } 
        
        Recipe.create(req.body, (recipe) => {
            return res.redirect(`/admin/recipes/${recipe.id}`);
        });
    },
    edit(req, res) { 
        Recipe.find(req.params.id, (item) => {
            if(!item) {
                return res.send("Receita não encontrada");
            }
            item.ingredients = item.ingredients.split(",");
            item.preparation = item.preparation.split(",");

            Recipe.chefsSelectOptions((items) => {
                return res.render("admin/edicao", { item, chefs: items}); 
            });
        });
    },
    put(req, res) { 
        Recipe.update(req.body, () => {
            return res.redirect(`/admin/recipes/${req.body.id}`);
        });
    },
    delete(req, res) { 
        Recipe.delete(req.body.idDel, () => {
            return res.redirect(`/admin/recipes/`);
        });
    }
}

