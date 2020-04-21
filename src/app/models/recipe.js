const db = require('../../config/db');
const Files = require('./file');
 
module.exports = {
    all() {
        return db.query(`SELECT 
            recipes.id,
            recipes.image,
            recipes.title,
            recipes.ingredients,
            recipes.preparation,
            recipes.information,
            recipes.chef_id,
            recipes.created_at,
            chefs.name as namechef
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ORDER BY recipes.title`);
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                 image,
                 title,
                 ingredients,
                 preparation,
                 information,
                 chef_id,
                 created_at 
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        //transformar vetor em string separado por virgula

        const values = [
            data.image,
            data.title,
            data.ingredients.toString(),
            data.preparation.toString(),
            data.information,
            data.author,         
            '2020-01-01'
            //date(Date.now()).iso
        ]

        return db.query(query, values);
    },
    find (id) {
        const _id = parseInt(id,10);
        if (Number.isInteger(_id)) {
            return db.query(`
            SELECT 
                recipes.id,
                recipes.image,
                recipes.title,
                recipes.ingredients,
                recipes.preparation,
                recipes.information,
                recipes.chef_id,
                recipes.created_at,
                chefs.name as namechef
                FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.id = $1
                ORDER BY recipes.title
            `, [id]);
        } else {
            return false;
        }
    },
    findBy(params) {
        const { filter, limit, offset, callback } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(SELECT count(*) FROM recipes ) as total`

            if ( filter ) {
                filterQuery = `${query} 
                WHERE recipes.title
                    ILIKE '%${filter}%'
                    OR chefs.name ILIKE '%${filter}%'`;
                
                totalQuery = `(SELECT count(*) FROM recipes LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                    ${filterQuery}    
                    ) as total`
            };

        query = `SELECT 
            recipes.id,
            recipes.image,
            recipes.title,
            recipes.ingredients,
            recipes.preparation,
            recipes.information,
            recipes.chef_id,
            recipes.created_at,
            chefs.name as namechef,
            ${totalQuery}
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ${filterQuery}
            LIMIT $1 OFFSET $2 `;
            console.log(query, limit, offset);
            db.query(query, [limit, offset], (err, results) => {
                if(err) throw `Erro no Banco de Dados ${err}`
                    callback(results.rows);
            });
    },
    update(data) {
        const query = `
            UPDATE recipes 
            SET
                image = ($1),
                title = ($2),
                ingredients = ($3),
                preparation = ($4),
                information = ($5),
                chef_id = ($6)
            WHERE id = ($7)
        `;

        const values = [
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.author,
            data.id
        ]

        return db.query(query, values);
    },
    async delete(id) {
        const results = await this.files(id);
        if (results.rows) {
             results.rows.forEach(async element => {
                await Files.delete(element.id);
            });
        }
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
    },
    findAllChef (idChef) {
        const _id = parseInt(idChef,10);
        if (Number.isInteger(_id)) {
            return db.query(`
            SELECT 
                id,
                image,
                title,
                ingredients,
                preparation,
                information,
                chef_id,
                created_at 
            FROM recipes 
            WHERE chef_id = $1`, [_id]);
        } else {
            return false;
        }
    },
    chefsSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`);
    },
    files(id) {
        const query = `
            SELECT files.id, files.name, files.path
            FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1`;
        return db.query(query, [id]);
    }
}