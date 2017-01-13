const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const ticketModel = require('./ticketmodel');
const counterModel = require('./countermodel');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//connect to database
mongoose.connect('mongodb://prakticum:password@ds029665.mlab.com:29665/heroku_79kjs0nb');
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
  console.log('Search: ' + req.query.email);

  db.collection('tickets').find({ email: req.query.email }).toArray(function (err, tickets) {
    res.send(tickets);
  });
});

//empty database
app.get('/delete', (req, res) => {
  db.collection('tickets').remove({});
    res.send('DB deleted');
    console.log('Database erased');
});


//Worker search
app.get('/workersearch', (req, res) => {
  var email = req.query.email;
  var id = req.query.id;
  console.log('Search: ' + email + ' ' + id);

  db.collection('tickets').find({ $or: [ { email: req.query.email }, { _id: req.query.id } ] }).toArray(function (err, tickets) { var restickets = [];
    for(i = 0; i < tickets.length; i++) {
      restickets[i] = { _id:tickets[i]._id, email:tickets[i].email, service:tickets[i].service, comments: tickets[i].comments};
    }
    res.send(restickets);
  });
});
