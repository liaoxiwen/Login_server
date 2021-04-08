const mysql = require('mysql');
const config = require('./database.config');

module.exports = {
    query: async function (sql) {
        const connection = mysql.createConnection(config);
        return await new Promise((resolve, reject) => {
            connection.connect(function (err) {
                if (err) {
                    reject(JSON.stringify(err));
                }
                connection.query(sql, function (err, result) {
                    if (err) {
                        reject(JSON.stringify(err));
                    }
                    resolve(result);
                    connection.end();
                })
            });
        })
    },

    add: async function (sql) {
        const connection = mysql.createConnection(config);
        return await new Promise((resolve,reject)=>{
            connection.connect(function (err){
                if(err){
                    reject(JSON.stringify(err));
                }
                connection.query(sql, function (err,result){
                    if(err){
                        connection.end();
                        reject(JSON.stringify(err));
                    }
                    resolve(result);
                    connection.end();
                })
            })
        })
    }
}