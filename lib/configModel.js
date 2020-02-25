const mongoose = require('mongoose');

let confSchema = new mongoose.Schema({
    prefix: String,
    token: String
});

module.exports = mongoose.model("Configuration", confSchema, "configuration");