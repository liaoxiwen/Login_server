const mysql = require('mysql');
const config = require('../config/database.config2');
// const dbconfig = require('../config/database.config');

// class DB {
//     constructor(tablename, type) {
//         dbconfig.type = type === undefined ? dbconfig.type : type;
//         this.config = {
//             ...dbconfig[dbconfig.type],
//         };
//         this.tablename = tablename;
//         this.connection = mysql.createConnection(config);
//     }

//     async connect() {
//         try {
//             await this.connection.connect();
//         } catch (err) {
//             console.log(err);
//         }
//         return;
//     }

//     async query(sql) {
//         return new Promise((resolve, reject) => {
//             this.connection.query(sql, function (err, result) {
//                 if (err) {
//                     reject(JSON.stringify(err));
//                 }
//                 resolve(result);
//             })
//         })
//     }

//     async add(sql) {
//         return new Promise((resolve, reject) => {
//             this.connection.query(sql, function (err, result) {
//                 if (err) {
//                     reject(JSON.stringify(err));
//                 }
//                 resolve(result);
//             })
//         })
//     }

//     async end() {
//         this.connection.end(function (err) {
//             if (err) {
//                 console.log(err);
//             }
//         });
//     }
// }
// module.exports = DB;

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
        return await new Promise((resolve, reject) => {
            connection.connect(function (err) {
                if (err) {
                    reject(JSON.stringify(err));
                }
                connection.query(sql, function (err, result) {
                    if (err) {
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