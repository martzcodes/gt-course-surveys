
var app = require('./server/routes');

var server = app.listen(5000, function() {
 console.log('Listening on port %d', server.address().port);
});
