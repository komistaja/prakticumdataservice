const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
  secret: 'dontcare',
  resave: true,
  saveUninitialized: true
}));


//Auth middleware
var auth = function(req, res, next) {
  if(req.session && req.session.user === checkthis && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

//Login
app.get('/login', function(req, res) {
  if(!req.query.username || !req.query.password) {
    res.send('Login failed');
  } else if(req.query.username === checkthis || req.query.password === checkthistoo) {
    req.session.user = checkthisthree;
    req.session.admin = true;
    res.send('login success');
  }
});

//Logout
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.send('logged out');
});

//Logged content
app.get('/content', auth, function(req, res) {
  //add logged content end here
});