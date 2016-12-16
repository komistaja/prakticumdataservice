const express = require('express');
const app = express();

const mongoose = require('mongoose');
const db = mongoose.connection;

const ticketModel = require('./ticketmodel');

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect('mongodb://localhost/test');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('database connected');
  
  var ticket = mongoose.model('Ticket', ticketModel.ticketSchema);
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server up');
});

app.use(express.static('public'));

app.post('/zones', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
