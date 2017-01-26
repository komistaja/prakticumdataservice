const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const ticketModel = require('./ticketmodel');
const userModel = require('./usermodel');
const counterModel = require('./countermodel');
const users = require('./users');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//connect to database
//mongoose.connect('mongodb://prakticum:password@ds029665.mlab.com:29665/heroku_79kjs0nb');
mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});

//Server on :3000
app.listen(process.env.PORT || 3000, function () {
    console.log('server up');
});

//Set public folder
//app.use(express.static('public'));
app.use(express.static('public/js'));
app.use(express.static('public/css'));

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: './public/' });
});

//login
app.use(session({
  secret: 'dontcare',
  resave: true,
  saveUninitialized: true
}));


//Auth middleware
var auth = function(req, res, next) {
  if(req.session.admin) {
    return next();
  } else {
    return res.status(401).send('please login');
  }
};

//Login endpoint
app.post('/login', function(req, res) {
  
  //promise function to query userdatabase
  function userQuery(usr) {
    var query = new Promise(function(resolve, reject) { 
      db.collection('users').find({ username: usr }).toArray(function(err, user) { 

        resolve(user); 
      });
    });
    return query;
  };

  userQuery(req.body.username).then(function(value) {
    console.log(value[0].username);
    console.log(req.body.username + req.body.password);
    if(!req.body.username || !req.body.password) {
      res.send('Login failed');
      console.log('Empty credentials');
    }
    if(req.body.username === value[0].username && req.body.password === value[0].password) {
      console.log('Login: ' + req.body.username);
      req.session.user = value[0].username;
      req.session.admin = true;
      res.redirect('content');
    } else if(req.body.username != value[0].username || req.body.password != value[0].password) {
      res.status(401).send('check username/password');
    }
  });
  
});

//Logout endpoint
app.get('/logout', function(req, res) {
  //end session
  req.session.destroy();
  res.send('logged out');
});

//Logged content
app.get('/content', auth, function(req, res) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

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

  db.collection('tickets').find({ $or: [ { email: req.query.email }, { _id: req.query.id } ] }).toArray(function (err, tickets) { 
    var restickets = [];
    for(i = 0; i < tickets.length; i++) {
      restickets[i] = { _id:tickets[i]._id, email:tickets[i].email, service:tickets[i].service, comments: tickets[i].comments};
    }
    res.send(restickets);
  });
});
