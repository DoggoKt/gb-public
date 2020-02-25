const mongoose = require('mongoose');
let confSchema = new mongoose.Schema({
    userId: String,
    channelId: String
});

module.exports = mongoose.model("Tickets", confSchema, "tickets");