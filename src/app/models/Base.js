const db = require('../../config/db');

const Base = {
    init({ table }) {
        if(!table) throw new Error('Invalid Params');
        this.table = table;
    },
    async all() {
        try {
            return await db.query(`SELECT * FROM ${this.table}`);
        } catch (error) {
            console.log(error);
        }
        
    },
    async findId (id) {
        try {
            return await db.query(`SELECT * FROM ${this.table} WHERE id = ${id}`);
        } catch (error) {
            console.log(error);
        }
    },
    async create(fields) {
        try {
            let keys = [], values = [], ind = [];
            Object.keys(fields).map((key, index, array) => {
                keys.push(key);
                values.push(fields[key]);
                ind.push(`$${index+1}`)
            })
            const query = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${ind.join(',')}) RETURNING id`;
            const results = await db.query(query, values);
            return results.rows[0].id; 
        } catch (error) {
            console.log(error);
        }     
    },
    update (fields, id) {
        try {
            let update = []
            Object.keys(fields).map( key => {
                if (key != 'id') {
                    if(fields[key]==false || fields[key]==true) {
                        const line = `${key} = ${fields[key]}`;
                        update.push(line);
                    } else {
                        const line = `${key} = '${fields[key]}'`;
                        update.push(line);
                    }
                }
            })
            let query = `UPDATE ${this.table} SET ${update.join(',')} WHERE id = ${id}`
            return db.query(query)
        } catch (error) {
            console.log(error);
        }
    },
    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`);
    }
}

module.exports = Base;