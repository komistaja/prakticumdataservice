$(function(){
  
  //Add data to database
  $('#button').click(function(){  
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var tel = $('#tel').val();
    var date = new Date();
    var service = $('#service').val();
    var comments = $('#comments').val();
    
    $.post('/add', {
        fname: fname,
        lname: lname,
        email: email,
        tel: tel,
        date: date,
        service: service,
        comments: comments
      },
      
      function(data, status){
        console.log(data);
      });
    });
  
  //Get data
  $('#button2').click(function() {
    var email = $('#email').val();
    $.get('/search',{ email: email }, function(data, status) {
      console.log(data);
      $('#fname').val(data[0].fname);
      $('#lname').val(data[0].lname);
      $('#email').val(data[0].email);
      $('#tel').val(data[0].tel);
      $('#service').val(data[0].service);
      $('#comments').val(data[0].comments);
      $('#id').val(data[0]._id);
    });
  });
});