const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

//Função para listar todos os chefs
async function listAll(){
    const results = await Chef.allWithRecipes();
    const items = results.rows;
    let avatar = [];
    for(item of items) {
        avatar = await File.list(item.file_id);
        if (avatar.rowCount > 0) {
            item.avatar = avatar.rows[0].name;
        }
    }
    return items;
}

module.exports = {
    async index(req, res) { 
        try {
            const items = await listAll();
            return res.render("admin/chefs_listagem", { items });
        } catch (error) {
            console.log(error);
            const message = 'Houve erro na visualização dessa página'
            return res.render("admin/erro", { msg: message } );
        }
    },
    async show(req, res) { 
        try {
            let results = await Chef.findId(req.params.id);
            const chef = results.rows[0];
            if(!chef) { 
                const items = await listAll();
                const message = 'Chef não encontrado'
                return res.render("admin/chefs_listagem", { items, msg: message, tipo: 'error'} );
            }
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
        } catch (error) {
            console.log(error);
            const message = 'Houve erro na visualização desse chef'
            return res.render("admin/erro", { msg: message } );
        }
        
    },
    create(req, res) { 
        return res.render("admin/chefs_criacao");
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);
            for(key of keys) {
                if (req.body[key] == "" && key != "id") {
                    const message = 'Por favor, preencha todos os campos'
                    return res.render("admin/chefs_criacao", { item: req.body, msg: message, tipo: 'error'} );
                }
            };
            const fileId = await File.create(req.files[0]);
            const data = { name: req.body.name, file_id: fileId }
            const results = await Chef.create(data);
            const items = await listAll();
            const message = 'Chef cadastrado com sucesso';
            return res.render("admin/chefs_listagem", {items, msg: message, tipo: 'success'});
        } catch (error) {
            console.log(error);
            const message = 'Houve erro no cadastramento desse chef'
            return res.render("admin/erro", { msg: message } );
        }
        
    },
    async edit(req, res) { 
        try {
            const results = await Chef.findId(req.params.id)
            const item = results.rows[0];
            if(!item) {
                const message = 'Chef não encontrado'
                const items = await listAll();
                return res.render("admin/chefs_listagem", { items, msg: message, tipo: 'error'} );
            }
            const avatar = await File.list(item.file_id);
            if (avatar.rowCount > 0) {
                item.avatar = avatar.rows[0].name;
            }
            return res.render("admin/chefs_edicao", { item });

        } catch (error) {
            console.log(error);
            const message = 'Não é possível editar esse Chef'
            return res.render("admin/erro", { msg: message } );
        }
    },
    async put(req, res) { 
        try {
            const data = { name: req.body.name }
            if (req.files.length != 0) {
                //pega a foto atual
                const results = await Chef.findId(req.body.id);
                const photo = results.rows[0].file_id;
                //cadastra nova foto
                const fileId = await File.create(req.files[0]);
                data.file_id = fileId;
                //apaga a foto antiga
                await File.delete(photo);
            }
            await Chef.update(data, req.body.id);
            const items = await listAll();
            const message = 'Cadastro de Chef atualizado com sucesso'
            return res.render("admin/chefs_listagem", {items, msg: message, tipo: 'success'});
        } catch (error) {
            console.log(error);
            const message = 'Houve erro para atualizar esse Chef'
            return res.render("admin/erro", { msg: message } );
        }
    },
    async delete(req, res) {
        try {
            const id = req.body.idDel;
            let results = await Chef.hasRecipe(id);
            if (results.rowCount > 0) {
                const message = 'Esse Chef possui receitas e não pode ser excluído';
                const items = await listAll();
                return res.render("admin/chefs_listagem", { items, msg: message, tipo: 'error'});
            }
            await Chef.delete(id)
            const items = await listAll();
            const message = 'Chef excluído com sucesso';
            return res.render("admin/chefs_listagem", { items, msg: message, tipo: 'success'});
        } catch (error) {
            const message = 'Houve erro ao excluir esse Chef';
            return res.render("admin/chefs_listagem", { msg: message});
        }
        
    }
}