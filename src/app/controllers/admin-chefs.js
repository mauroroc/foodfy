//const { date } = require('../../lib/utils');
const Chef = require('../models/chef');
const Recipe = require('../models/recipe');
const File = require('../models/file');
  
module.exports = {
    async index(req, res) { 
        const results = await Chef.all();
        const items = results.rows;
        let avatar = [];
        for(item of items) {
            avatar = await File.list(item.file_id);
            if (avatar.rowCount > 0) {
                item.avatar = avatar.rows[0].name;
            }
        }   
        return res.render("admin/chefs_listagem", { items });
    },
    async show(req, res) { 
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];
        if(!chef) return res.send("Chef não encontrado");
        results = await Recipe.findAllChef(chef.id)
        const items = results.rows;
        for(i of items) {
            results = await Recipe.files(i.id);
            const file = results.rows[0];
            if(file){
                i.src = `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`  
            }
        };
        const avatar = await File.list(chef.file_id);
        if (avatar.rowCount > 0) {
            chef.avatar = avatar.rows[0].name;
        }
        return res.render("admin/chefs_detalhe", { chef, items });
    },
    create(req, res) { 
        return res.render("admin/chefs_criacao");
    },
    async post(req, res) { 
        const keys = Object.keys(req.body);
        for(key of keys) {
            if (req.body[key] == "" && key != "id") {
                return res.send("Por favor, preencha todos os campos");
            }
        };
        const fileId = await File.create(req.files[0]);
        
        const data = { name: req.body.name, avatar: fileId }

        const results = await Chef.create(data);
        const chef = results.rows[0];

        return res.redirect(`/admin/chefs/${chef.id}`);
    },
    async edit(req, res) { 
        const results = await Chef.find(req.params.id)
        const item = results.rows[0];
        if(!item) return res.send("Chef não encontrado");
        const avatar = await File.list(item.file_id);
        if (avatar.rowCount > 0) {
            item.avatar = avatar.rows[0].name;
        }
        return res.render("admin/chefs_edicao", { item });
    },
    async put(req, res) { 

        if (req.files.length != 0) {
            const fileId = await File.create(req.files[0]);
            req.body.file_id = fileId;
        }
        await Chef.update(req.body);

        return res.redirect(`/admin/chefs/${req.body.id}`);
    },
    async delete(req, res) {
        const id = req.body.idDel;
        const results = await Chef.hasRecipe(id);
        if (results.rowCount > 0) {
            return res.send("Esse chefe possui receitas e não pode ser deletado");
        }
        await Chef.delete(id)
        return res.redirect(`/admin/chefs`);
    }
}