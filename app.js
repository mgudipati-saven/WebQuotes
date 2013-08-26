var path = require('path');

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// start the server...
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  var id = null;
  socket.on('subscribe', function (data) {
    console.log(data);
    id = setInterval(sendQuotes, 1000, socket);
  });
  
  socket.on('disconnect', function() {
    console.log('client disconnected');
    clearInterval(id);
  });
});

function sendQuotes(socket) {
  socket.emit('quotes', { ticker: 'IBM', price: '100.00' });  
}