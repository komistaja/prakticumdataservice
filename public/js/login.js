$(function(){
  $('#login').click(function(){
    var password = $('#password').val();
    var username = $('#username').val();

    $.post('/login', { username: username, password: password }, function(data, status, xhr) {
      console.log(data);
      window.location.href = data;
    });
  });
});