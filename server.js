const express = require('express');
const app = express();

app.listen(process.env.PORT || 3000, function () {
    console.log('server up');
});

app.use(express.static('public'));

app.get('/zones', (req, res) => {
  
    res.send('benis9000');
    console.log('page refresh');
});
