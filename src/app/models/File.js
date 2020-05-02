const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    async create({filename, path}, recipe_id) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `;

        const values = [
            filename,
            path
        ];

        const results = await db.query(query, values);

        if(recipe_id) db.query(`INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1, $2)`, [recipe_id, results.rows[0].id]);

        return results.rows[0].id;
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            if(result.rowCount > 0) {
                const file = result.rows[0];
                fs.unlinkSync(file.path);
            }
        }catch(err) {
            console.error(err);
        }   
        await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);   
        return await db.query(`DELETE FROM files WHERE id = $1`, [id]);
    },
    list(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id]);
    }
}