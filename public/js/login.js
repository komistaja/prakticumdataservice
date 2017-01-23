$(function(){
  $('#login').click(function(){
    var password = $('#password').val();
    var username = $('#username').val();
    console.log(password);
    $.post('/login', { username: username, password: password })
  });
});