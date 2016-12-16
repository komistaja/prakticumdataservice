$(function(){
  $('button').click(function(){
    $.post('/zones', { fname: 'Jorma', lname: 'Penttinen' },
      
      function(data, status){
       console.log(data);
      });
    });
});