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
            Object.keys(fields).map((key) => {
                keys.push(key);
                if(Array.isArray(fields[key])) {
                    for(i in fields[key]) {
                        ind.push(`'${fields[key][i]}'`);
                    }
                    values.push(`ARRAY [${ind}]`);
                    ind = [];
                } else {
                    values.push(`'${fields[key]}'`);
                }               
            })
            const query = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')}) RETURNING id`;
            const results = await db.query(query);
            return results.rows[0].id; 
        } catch (error) {
            console.log(error);
        }     
    },
    update (fields, id) {
        try {
            let update = [];
            let ind= [];
            Object.keys(fields).map( key => {
                if (key != 'id') {
                    if(fields[key]==false || fields[key]==true) {
                        const line = `${key} = ${fields[key]}`;
                        update.push(line);
                    } else {
                        if(Array.isArray(fields[key])) {
                            for(i in fields[key]) {
                                ind.push(`'${fields[key][i]}'`);
                            }
                            update.push(`${key} = ARRAY [${ind}]`);
                            ind = [];
                        } else {
                            const line = `${key} = '${fields[key]}'`;
                            update.push(line);
                        }
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
        try {
            return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`);
        } catch (error) {
            console.log(error);
        }
        
    }
}

module.exports = Base;