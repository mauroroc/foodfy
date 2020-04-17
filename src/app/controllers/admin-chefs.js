//const { date } = require('../../lib/utils');
const Chef = require('../models/chef');
const Recipe = require('../models/recipe');
  
module.exports = {
    index(req, res) { 
        Chef.all((items)=> {
            return res.render("admin/chefs_listagem", { items });
        });  
    },
    show(req, res) { 
        Chef.find(req.params.id, (chef) => {
            if(!chef) {
                return res.send("Chef não encontrado");
            }
            Recipe.findAllChef(chef.id, (items) => {
                return res.render("admin/chefs_detalhe", { chef, items });
            });  
        })
    },
    create(req, res) { 
        return res.render("admin/chefs_criacao");
    },
    post(req, res) { 
        const keys = Object.keys(req.body);
        for(key of keys) {
            if (req.body[key] == "" && key != "id") {
                return res.send("Por favor, preencha todos os campos");
            }
        };

        Chef.create(req.body, (chef) => {
            return res.redirect(`/admin/chefs/${chef.id}`);
        });
        
    },
    edit(req, res) { 
        Chef.find(req.params.id, (item) => {
            if(!item) {
                return res.send("Chef não encontrado");
            }
            return res.render("admin/chefs_edicao", { item });
        })
    },
    put(req, res) { 
        Chef.update(req.body, () => {
            return res.redirect(`/admin/chefs/${req.body.id}`);
        });
    },
    delete(req, res) { 
        Chef.delete(req.body.idDel, () => {
            return res.redirect(`/admin/chefs/`);
        });
    }
}