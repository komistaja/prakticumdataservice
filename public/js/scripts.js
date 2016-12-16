$(function(){
  $('#button').click(function(){  
    var benis = $('#text').val();
    $.post('/zones', { text: benis },
      
      function(data, status){
       console.log(data);
       alert('Check console!');
      });
    });
});