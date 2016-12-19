const mongoose = require('mongoose');

exports.ticketSchema = mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    tel: Number,
    date: { type: Date, default: Date.now },
    service: String,
    comments: String
  });