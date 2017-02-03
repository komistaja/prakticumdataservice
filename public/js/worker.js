$(function(){
  
  //search
  $('#form').submit(function(event) {
    var email = $('#email').val();
    var id = $('#id').val();

    $.get('/workersearch',{ email: email, id: id }) 
      .done(function(data) {
      console.log(data);
      
      //Create result table
      $('#restable').empty();
      $('#restable').append('<tr><th>Id</th><th>Email</th><th>Service</th><th>Comments</th></tr>');
      for(i = 0; i < data.length; i++) {
        $('#restable').append("<tr><td>" + data[i].id + "</td><td>" + data[i].email + "</td><td>" + data[i].service + "</td><td>" + data[i].comments + "</td></tr>");
      }
    });
  event.preventDefault();
  });
});