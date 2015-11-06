
var app = require('./server/routes');

var server = app.listen(process.argv[2] || 8080, function() {
 console.log('Listening on port %d', server.address().port);
});
