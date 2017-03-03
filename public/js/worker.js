$(function(){
  
  //search
  $('#form').submit(function(event) {
    var email = $('#email').val();
    var id = $('#id').val();

    $.get('/workersearch',{ email: email, id: id }) 
      .done(function(data) {
      console.log(data);
      for(i = 0; i < data.length; i++) {
        if(data[i].status == "0") {
          data[i].status = "Registered";
        }
        if(data[i].status == "1") {
          data[i].status = "In progress";
        }
        if(data[i].status == "2") {
          data[i].status = "Finished";
        }
      }      
      //Create result table
      $('#tablediv').empty();
      $('#tablediv').append('<table id="restable"><tr><th>Id</th><th>Email</th><th>Service</th><th>Comments</th><th>Status</th></tr></table>');
      for(i = 0; i < data.length; i++) {
        $('#restable').append("<tr><td>" + data[i].id + "</td><td>" + data[i].email + "</td><td>" + data[i].service + "</td><td>" + data[i].comments + "</td><td>" + data[i].status + "</td><td class='tdbtn'><button id='button" + data[i].id + "' class='button editbtn'>EDIT</button></td></tr>");
      }
    });
  event.preventDefault();
  });
});