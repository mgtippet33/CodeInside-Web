const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: 'https://codeinside.herokuapp.com',
    optionsSuccessStatus: 200
  }
  
  app.get('/register/', cors(corsOptions), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for only example.com.'})
  })

app.use(express.static(__dirname + '/dist/codeInside'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +
        '/dist/codeInside/index.html'));
});

app.listen(process.env.PORT || 8080);