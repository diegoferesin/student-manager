const mongoConfig = require('../config/db');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

let database;

const initDb = (callback) => {
    if (database) {
        console.log("Database is already initialized.");
        return callback(null, database);
    } else {
        console.log("Initializing database...");
        mongoose.connect(mongoConfig.url, mongoConfig.options)
            .then(() => {
                console.log("Database initialized.");
                database = mongoose.connection;
                return callback(null, database);
            })
            .catch(err => {
                console.log("Error connecting to database.");
                callback(err);
            });
    }
}

module.exports = {
    initDb,
};