const db = require('../../config/db');
const Files = require('./file');
 
module.exports = {
    all() {
        return db.query(`SELECT 
            recipes.id,
            recipes.title,
            recipes.ingredients,
            recipes.preparation,
            recipes.information,
            recipes.chef_id,
            recipes.created_at,
            chefs.name as namechef
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ORDER BY recipes.created_at DESC`);
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                 title,
                 ingredients,
                 preparation,
                 information,
                 chef_id,
                 user_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        //transformar vetor em string separado por virgula

        const values = [
            data.title,
            data.ingredients.toString(),
            data.preparation.toString(),
            data.information,
            data.author,
            data.user
        ]

        return db.query(query, values);
    },
    find (id) {
        const _id = parseInt(id,10);
        if (Number.isInteger(_id)) {
            return db.query(`
            SELECT 
                recipes.id,
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
    findBy(filter, limit, offset) {
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
            ORDER BY recipes.updated_at DESC
            LIMIT $1 OFFSET $2 
        `;
            return db.query(query, [limit, offset]);
    },
    update(data) {
        const query = `
            UPDATE recipes 
            SET
                title = ($1),
                ingredients = ($2),
                preparation = ($3),
                information = ($4),
                chef_id = ($5)
            WHERE id = ($6)
        `;

        const values = [
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