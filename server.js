const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const ticketModel = require('./ticketmodel');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//connect to database
mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});

//Server listen on 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('server up');
});

//Set public folder
app.use(express.static('public'));

//Add data to database
app.post('/add', (req, res) => {
  var data = req.body;  
  var ticket = mongoose.model('Ticket', ticketModel.ticketSchema);
  var newTicket = new ticket(data);
  
  newTicket.save(function (err, tiket) {
    if (err) return console.error(err);
  });
  res.send(req.body);
});


//Database search
app.get('/search', (req, res) => {
  db.collection('tickets').find({}).toArray(function (err, tickets) {
    res.send(tickets);
  });
});