const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
    async index(req, res) 
    { 
        try {
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
        } catch (error) {
            console.log(error);
            const message = 'Houve erro ao processar essa página'
            return res.render("error", { msg: message } );
        }
        
    },
    async list(req, res) 
    {
        try {
            let { filter, page, limit } = req.query;
            page = page || 1;
            limit = limit || 2;
            let offset = limit * (page - 1);
            if (filter) {
                const results = await Recipe.findBy(filter, limit, offset); 
                if(results.rowCount == 0) {
                    const message = 'Não encontramos itens referente a sua busca.'
                    return res.render("error", { msg: message } );
                }
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
        } catch (error) {
            console.log(error);
            const message = 'Houve erro ao processar essa página'
            return res.render("error", { msg: message } );
        }
    },
    async chefs(req, res) 
    {
        try {
            let results = await Chef.allWithRecipes();
            const items = results.rows;
            for(i of items) {
                results = await File.list(i.file_id);
                if (results.rowCount > 0) i.avatar = results.rows[0].name;
            };
            return res.render("chefs", { items });
        } catch (error) {
            console.log(error);
            const message = 'Houve erro ao processar essa página'
            return res.render("error", { msg: message } ); 
        }
    },
    async show(req, res) {
        try {
            let results = await Recipe.findId(req.params.id);
            const recipe = results.rows[0];
            if(!recipe) {
                const message = 'Receita não encontrada!'
                return res.render("error", { msg: message } ); 
            }      
            results = await Recipe.files(recipe.id);
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }));
            return res.render("receita", { item: recipe, files });
        } catch (error) {
            console.log(error);
            const message = 'Houve erro ao processar essa página'
            return res.render("error", { msg: message } ); 
        }  
    }
}
