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
      var status = $('#status').val();
      var id = $('#id').val();
      
      //post data to server/database
      $.post('/update', {
          fname: fname,
          lname: lname,
          email: email,
          tel: tel,
          date: date,
          service: service,
          comments: comments,
          status: status,
          id: id
        },

        function(data, status){
          $('#fname').val('');
          $('#lname').val('');
          $('#email').val('');
          $('#tel').val('');
          $('#service').val('');
          $('#comments').val('');
          $('#id').val('');
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
    var id = $('#idsearch').val();
    $.get('/search',{ email: email, id: id }, function(data, status) {
      console.log(data);
      if (typeof data[0] !== 'undefined') { 
        $('#fname').val(data[0].fname);
        $('#lname').val(data[0].lname);
        $('#email').val(data[0].email);
        $('#tel').val(data[0].tel);
        $('#service').val(data[0].service);
        $('#comments').val(data[0].comments);
        $('#status').val(data[0].status);
        $('#id').val(data[0].id);
        
        $('#tablediv').empty();
        $('#tablediv').append('<table id="restable"><tr><th>Id</th><th>Email</th><th>Service</th><th>Comments</th><th>Status</th></tr></table>');
        
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
      
        for(i = 0; i < data.length; i++) {
          $('#restable').append("<tr class='restr'><td>" + data[i].id + "</td><td>" + data[i].email + "</td><td>" + data[i].service + "</td><td>" + data[i].comments + "</td><td>" + data[i].status + "</td></tr>");
        }
        
        $('.restr').dblclick(function() {
          console.log(this.firstChild.innerHTML);
          var searchid = this.firstChild.innerHTML;
          $.get('/search',{ id: searchid }, function(data, status) {
            console.log(data);
            if (typeof data[0] !== 'undefined') { 
              $('#fname').val(data[0].fname);
              $('#lname').val(data[0].lname);
              $('#email').val(data[0].email);
              $('#tel').val(data[0].tel);
              $('#service').val(data[0].service);
              $('#comments').val(data[0].comments);
              $('#status').val(data[0].status);
              $('#id').val(data[0].id);
           
            } else {
              alert('No ticket found');
            }
    });
        });
        
      } else {
        alert('No ticket found');
      }
    });
    event.preventDefault();
  });
  
  //empty database
  $('#delete').click(function() {
    $.get('/delete', function(data, status) {
    });
  });
  
  
});