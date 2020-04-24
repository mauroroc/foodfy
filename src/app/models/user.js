const db = require('../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
    all() {
        return db.query(`
            SELECT id, name, email, is_admin
            FROM users
            `);
    },
    async create(data) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password, 
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const password = "12345678";
        const passwordHash = await hash(password, 8);

        const values = [
            data.name,
            data.email,
            passwordHash,
            data.is_admin,
        ]

        return db.query(query, values);
    },
    find (id) {
        return db.query(`
            SELECT id, name, email, is_admin
            FROM users
            WHERE id = $1`, [id]
        );
    },
    findOne (email) {
        return db.query(`
            SELECT id, name, email, is_admin
            FROM users
            WHERE email = $1`, [email]
        );
    },
    update (data) {
        const query = `
            UPDATE users 
            SET 
                name = $1,
                email = $2,
                is_admin = $3
            WHERE id = $4
        `;

        const values = [
            data.name,
            data.email,
            data.is_admin,
            data.id
        ]
        console.log(query, values);
        return db.query(query, values);
    },
    delete(id) {
        return db.query(`DELETE FROM users WHERE id = $1`, [id]);
    },
    hasRecipe(id) {
        return db.query(`SELECT * FROM recipes WHERE user_id = $1`, [id]);
    }
}