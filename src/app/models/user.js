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
            SELECT id, name, email, password, is_admin
            FROM users
            WHERE email = $1`, [email]
        );
    },
    findToken (token) {
        return db.query(`
        SELECT id, name, email, reset_token, reset_token_expires
        FROM users
        WHERE reset_token = $1`, [token]
        );
    },
    async updateprofile (data) {
        let query = `UPDATE users SET name = $1, email = $2`;
        let values = [];
        if(data.password) {
            query = query + ', password = $3 WHERE id = $4';
            const passwordHash = await hash(data.password, 8);
            values = [
                data.name,
                data.email,
                passwordHash,
                data.id
            ]
        }else{
            query = query + 'WHERE id = $3';
            values = [
                data.name,
                data.email,
                data.id
            ]
        }

        return db.query(query, values);
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
        return db.query(query, values);
    },
    updatePassword(id, senha) {
        return db.query(`UPDATE users SET reset_token='', reset_token_expires='', password = $1 WHERE id = $2`, [senha, id]);
    },
    delete(id) {
        return db.query(`DELETE FROM users WHERE id = $1`, [id]);
    },
    hasRecipe(id) {
        return db.query(`SELECT * FROM recipes WHERE user_id = $1`, [id]);
    },
    createToken(id, token) {
        const query = `
            UPDATE users 
            SET 
                reset_token = $1,
                reset_token_expires = $2
            WHERE id = $3
        `;

        const values = [
            token.reset_token,
            token.reset_token_expires,
            id
        ]
        return db.query(query, values);
    }
}