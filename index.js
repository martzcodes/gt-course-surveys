'use strict';

var express = require('express');
var app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        return next();
    });
}
app.use('/', express.static('dist/'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port %d...', server.address().port);
});
