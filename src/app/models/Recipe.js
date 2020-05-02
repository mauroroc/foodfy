const db = require('../../config/db');
const Base = require('./Base');
Base.init({ table: 'recipes'});

module.exports = {
    ...Base,
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
            console.log(query);
            console.log(limit, offset)
            return db.query(query, [limit, offset]);
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
    findAllUser (idUser) {
        const _id = parseInt(idUser,10);
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
            WHERE user_id = $1`, [_id]);
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