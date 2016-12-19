$(function(){
  
  //form functionality
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
});