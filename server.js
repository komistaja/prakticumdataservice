const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const ticketModel = require('./models/ticketmodel');
const userModel = require('./models/usermodel');
const counterModel = require('./models/countermodel');

const auth = require('./auth');
const query = require('./query');


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

//Server listen
app.listen(process.env.PORT || 3000, function () {
    console.log('server up');
});

//Set public folder
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

//Login endpoint
app.post('/login', function(req, res) {
 
  query.userQuery(req.body.username).then(function(value) {
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

//Loginpage
app.get('/loginpage', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/login.html'));
});

//Admin endpoint
app.get('/sales', auth.adminAuth, function(req, res) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

//Datanom endpoint
app.get('/datanom', auth.datanomAuth, function(req, res) {
  res.sendFile(path.join(__dirname + '/public/worker.html'));
});

//Add data to database
app.post('/add', (req, res) => {
  console.log(req.body);
  var ticket = mongoose.model('Ticket', ticketModel.ticketSchema);
  var counter = new Promise(function(resolve, reject) {
    resolve(db.collection('counters').findOneAndUpdate( 
      { _id: 'name' },
      { $inc: { seq: 1 } },
      { returnNewDocument: true, upsert: true }
    ));
    return value.seq;
  });
  
  counter.then(function(value) {
    req.body.id = value.value.seq;
    var data = req.body;
    var addTicket = new ticket(data);
    addTicket.save(function(err, tiket) {
      if (err) return console.error(err);
    });
  });
  
  res.send(req.body);
});


//Database search
app.get('/admin', auth.adminAuth, (req, res) => {
  console.log('Search: email: ' + req.query.email + ', id: ' + req.query.id);

  db.collection('tickets').find({ $or: [ { email: req.query.email }, { id: req.query.id } ] }).toArray(function (err, tickets) {
    res.send(tickets);
  });
});

//empty database
app.get('/delete', auth.adminAuth, (req, res) => {
  db.collection('tickets').remove({});
    res.send('DB deleted');
    console.log('Database erased');
});


//Worker search
app.get('/workersearch', auth.datanomAuth, (req, res) => {
  var email = req.query.email;
  var id = req.query.id;
  
  console.log('Search: ' + email + ' ' + id);

  db.collection('tickets').find({ $or: [ { email: email }, { id: id } ] }).toArray(function (err, tickets) { 
    var restickets = [];
    for(i = 0; i < tickets.length; i++) {
      restickets[i] = { id:tickets[i].id, email:tickets[i].email, service:tickets[i].service, comments: tickets[i].comments, status: tickets[i].status };
    }
    res.send(restickets);
  });
});

//worker update
app.post('/workerupdt', auth.datanomAuth, (req,res) => {
  var data = req.body;
  console.log(req.body);
  
  db.collection('tickets').findOneAndUpdate(
      { id: req.body.id },
      { comment: req.body.comment },
      { status: req.body.status },
      { returnNewDocument: true, upsert: true }
    ).catch(function(reason) { console.log(reason) });
  res.send('Report');
});

// update
app.post('/update', auth.adminAuth, (req, res) => {
  console.log(req.body.id)
  db.collection('tickets').update(
    { id: req.body.id },
    { $set: 
      { fname: req.body.fname,
       lname: req.body.lname,
       email: req.body.email,
       tel: req.body.tel,
       service: req.body.service,
       comments: req.body.comments,
       status: req.body.status }
      }
  ).catch(function(reason) { res.send(reason) });
  res.send('thx obama');
});

//delete document
app.delete('/admin', auth.adminAuth, (req, res) => {
  var ticketRemove = db.collection('tickets').remove({ id: req.body.id }, 1);
  ticketRemove.then(function(value) {
    res.send(value);
  })
});