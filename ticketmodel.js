const mongoose = require('mongoose');

exports.ticketSchema = mongoose.Schema({
    fname: String,
    lname: String,
    tel: Number,
    id: Number,
    date: { type: Date, default: Date.now },
    service: String,
    comments: String
  });