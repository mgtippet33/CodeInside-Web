const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.options('*', cors())

app.use(express.static(__dirname + '/dist/codeInside'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +
        '/dist/codeInside/index.html'));
});

app.listen(process.env.PORT || 8080);