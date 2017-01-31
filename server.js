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


const testEnv = true;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//connect to database
if(testEnv) {
  mongoose.connect('mongodb://prakticum:password@ds029665.mlab.com:29665/heroku_79kjs0nb');
}
if(!testEnv) {
  mongoose.connect('mongodb://localhost/test');
}

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
app.use(express.static('public/img'));

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
var adminAuth = function(req, res, next) {
  if(req.session.admin) {
    return next();
  } else {
    return res.status(401).send('please login');
  }
};

var datanomAuth = function(req, res, next) {
  if(req.session.user === 'datanom') {
    return next();
  } else {
    return res.status(401).send('please login');
  }
};

//Login endpoint
app.post('/login', function(req, res) {
  
  //query userdatabase
  function userQuery(usr) {
    var query = new Promise(function(resolve, reject) { 
      db.collection('users').find({ username: usr }).toArray(function(err, user) { 
        console.log(user);
        resolve(user); 
      });
    });
    return query;
  };

  userQuery(req.body.username).then(function(value) {
    console.log(req.body.username + req.body.password);
    if(typeof value[0] === 'undefined') {
      res.status(401).send('check username/password');
    }
    if(!req.body.username || !req.body.password) {
      res.send('Login failed');
      console.log('Empty credentials');
    }
    if(req.body.username === value[0].username && req.body.password === value[0].password) {
      console.log('Login: ' + req.body.username);
      console.log('Databasematch: ' + value[0].username)
      req.session.user = value[0].username;
      console.log('Sessionuser: ' + req.session.user)
      if(req.session.user === 'sales') {
        req.session.admin = true;
        return res.redirect(303, '/sales');
      }
      if(req.session.user === 'datanom') {
        console.log(req.session.admin)
        req.session.datanom = true;
        return res.redirect(303, '/datanom');
      }
    } else if(req.body.username != value[0].username || req.body.password != value[0].password) {
      res.status(401).send('check username/password');
    }
  }).catch(function(reason) { console.log(reason) });
  
});

//Logout endpoint
app.get('/logout', function(req, res) {
  //end session
  console.log('logged out: ' + req.session.user)
  req.session.destroy();
  res.redirect('/');
});

//Logged content
app.get('/sales', adminAuth, function(req, res) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/datanom', datanomAuth, function(req, res) {
  res.sendFile(path.join(__dirname + '/public/worker.html'));
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
app.get('/search', adminAuth, (req, res) => {
  console.log('Search: ' + req.query.email);

  db.collection('tickets').find({ email: req.query.email }).toArray(function (err, tickets) {
    res.send(tickets);
  });
});

//empty database
app.get('/delete', adminAuth, (req, res) => {
  db.collection('tickets').remove({});
    res.send('DB deleted');
    console.log('Database erased');
});


//Worker search
app.get('/workersearch', datanomAuth, (req, res) => {
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