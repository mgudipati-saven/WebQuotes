var path = require('path')
  , net = require('net')
  , events = require('events')
  , util = require('util');
    
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var ctf = require('./ctf').createClient(net.createConnection(4013, '198.190.11.21', function() {
  console.log("established ctf connection...");
}));

// register messsage listener
ctf.on('message', function(msg) {
  console.log("new ctf message received: " + JSON.stringify(msg));
  io.sockets.emit('quotes', msg);
});

// send login command
ctf.sendCommand("5022=LoginUser|5028="+'saventech'+"|5029="+'saventech'+"|5026=1");
ctf.sendCommand("5022=SelectAvailableTokens|5026=2");

// subscribe to the watchlist
ctf.sendCommand("5022=Subscribe|4=687|5=X:SUSDINR|5026=3");

ctf.addListener("end", function () {
  console.log("ctf server disconnected...");
});

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
  console.log('client connected');
  
  socket.on('disconnect', function() {
    console.log('client disconnected');
  });
});