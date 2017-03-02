const mongoose = require('mongoose');

exports.ticketSchema = mongoose.Schema({
    id: { type: String, index: true, unique: true },
    fname: String,
    lname: String,
    email: String,
    tel: Number,
    date: { type: Date, default: Date.now },
    service: String,
    comments: String,
    status: String
  });