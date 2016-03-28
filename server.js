var express = require('express');
var websocket = require('websocket');

var app = express();

var count = 0;
var clients = {};

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});

var wsServer = new websocket.server({
    httpServer: server
});

var sendBroadCast = function(message) {
   console.log(message);
   for(var i in clients){		
     clients[i].sendUTF(message);
   }	
}

wsServer.on('request', function(r){
    var connection = r.accept('echo-protocol', r.origin);
    var id = count++;
    clients[id] = connection;
    console.log((new Date()) + ' Connection accepted [' + id + ']');
    sendBroadCast(id + ' entrou');

    connection.on('message', function(message) {
	var msgString = id+': ' + message.utf8Data;
        sendBroadCast(msgString);
    });

    connection.on('close', function(reasonCode, description) {
    	delete clients[id];
    	console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	sendBroadCast(id + ' saiu');
    });
    		
});

