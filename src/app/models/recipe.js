const db = require('../../config/db');
 
module.exports = {
    all(callback) {
        db.query(`SELECT 
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
            ORDER BY recipes.title`, 
            (err, results) => {
                if(err) throw `Erro no Banco de Dados ${err}`;
            callback(results.rows);
        })
    },
    create(data, callback) {
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

        db.query(query, values, (err, results) => {
            if(err) throw `Erro no Banco de Dados ${err}`;
            callback(results.rows[0]);
        });
    },
    find (id, callback) {
        const _id = parseInt(id,10);
        if (Number.isInteger(_id)) {
            db.query(`
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
            `, [id], (err, results) => {
                if(err) throw `Erro no Banco de Dados ${err}`;
                callback(results.rows[0]);
            });
        } else {
            callback();
        }
    },
    findBy(filter, callback) {
        db.query(`SELECT 
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
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            ORDER BY recipes.title
            `, (err, results) => {
                if(err) throw `Erro no Banco de Dados ${err}`;
                    callback(results.rows);
            });
    },
    update(data, callback) {
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

        db.query(query, values, (err, results) => {
            if(err) throw `Erro no Banco de Dados ${err}`;
            callback();
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], (err, results) => {
            if(err) throw `Erro no Banco de Dados ${err}`;
            callback();
        });
    },
    findAllChef (idChef, callback) {
        const _id = parseInt(idChef,10);
        if (Number.isInteger(_id)) {
            db.query(`
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
            WHERE chef_id = $1`, [_id], (err, results) => {
                if(err) throw `Erro no Banco de Dados ${err}`;
                callback(results.rows);
            });
        } else {
            callback();
        }
    },
    chefsSelectOptions(callback) {
        db.query(`SELECT name, id FROM chefs`, (err, results) => {
            if(err) throw `Erro no Banco de Dados ${err}`;
                callback(results.rows);
        })
    }
}