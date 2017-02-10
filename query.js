
const mongoose = require('mongoose');
const db = mongoose.connection;

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



exports.userQuery = userQuery;