const mongoose = require('mongoose');

let confSchema = new mongoose.Schema({
    prefix: String,
    token: String
});

let ticketSchema = new mongoose.Schema({
    userID: String,
    channelID: String,
    archived: Boolean,
    inquiryType: String
});

let lockSchema = new mongoose.Schema({
    userID: String
});

module.exports.config = mongoose.model("Configuration", confSchema, "configuration");
module.exports.ticket = mongoose.model("Tickets", ticketSchema, "tickets");
module.exports.lock = mongoose.model("Lock", lockSchema, "lock");
