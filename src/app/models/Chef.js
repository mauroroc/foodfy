const db = require('../../config/db');
const Base = require('./Base');
Base.init({ table: 'chefs'});

module.exports = {
    ...Base,
    allWithRecipes() {
        return db.query(`
            SELECT chefs.id, chefs.name, chefs.file_id, chefs.created_at, count(recipes) as total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY chefs.name
            `);
    },
    findWithRecipes (id) {
        return db.query(`
        SELECT chefs.id, chefs.name, chefs.file_id, chefs.created_at, count(recipes) as total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
        `, [id]);
    }
}