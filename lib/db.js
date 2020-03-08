const mong = require('mongoose');



function connect() {
    mong.connect(`mongodb://master:Karim123oliver@ds257648.mlab.com:57648/glorious-test`, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Database connection successful!')
        })
        .catch(err => {
            console.error('Database connection error!')
        })
}

class Database {
    constructor() {
        connect()
    }}

module.exports = new Database();
