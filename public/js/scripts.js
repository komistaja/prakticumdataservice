$(function(){
  
  //Add data to database
  $('#postform').submit(function(event){
    //check if required fields are empty
    if($('#fname').val() && $('#lname').val() && $('#email').val() && $('#tel').val() && $('#service').val()) {
      var fname = $('#fname').val();
      var lname = $('#lname').val();
      var email = $('#email').val();
      var tel = $('#tel').val();
      var date = new Date();
      var service = $('#service').val();
      var comments = $('#comments').val();
      
      //post data to server/database
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
          $('#fname').val('');
          $('#lname').val('');
          $('#email').val('');
          $('#tel').val('');
          $('#service').val('');
          $('#comments').val('');
          console.log(data);
        });
      } else {
        alert('Fill forms');
      }
   event.preventDefault(); 
  });
  
  //Get searchdata
  $('#searchform').submit(function(event) {
    var email = $('#emailsearch').val();
    $.get('/search',{ email: email }, function(data, status) {
      console.log(data);
      if (typeof data[0] !== 'undefined') { 
        $('#fname').val(data[0].fname);
        $('#lname').val(data[0].lname);
        $('#email').val(data[0].email);
        $('#tel').val(data[0].tel);
        $('#service').val(data[0].service);
        $('#comments').val(data[0].comments);
        $('#id').val(data[0]._id);
      } else {
        alert('No ticket found');
      }
    });
    event.preventDefault();
  });
  
  //search
 /* $('#button2').click(function() {
    var email = $('#emailsearch').val();
    var id = $('#id').val();

    $.get('/workersearch',{ email: email, id: id }) 
      .done(function(data) {
      console.log(data);
      
      //Create result table
      $('#restable').empty();
      $('#restable').append('<tr><th>Id</th><th>Email</th><th>Service</th><th>Comments</th></tr>');
      for(i = 0; i < data.length; i++) {
        $('#restable').append("<tr><td>" + data[i]._id + "</td><td>" + data[i].email + "</td><td>" + data[i].service + "</td><td>" + data[i].comments + "</td></tr>");
      }
    });
  });*/
  
  //empty database
  $('#delete').click(function() {
    $.get('/delete', function(data, status) {
    });
  });
});