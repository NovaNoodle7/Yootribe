var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const expressWs = require('express-ws');
const http = require ('http');
const path = require('path');
var port = process.env.PORT || 8080;

var transactionRoute = require('./routes/transactions');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname,"../build/")));

app.use(cors());

app.use('/transactions',transactionRoute);




const server = http.createServer(app);

server.listen(port, function(){
    console.log('app listening on port: '+port);
});

const getUniqueID = () => {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return s4() + s4() + "-" + s4();
  };
  
module.exports.wss = expressWs(app, server);


app.ws("/connect", function(ws, req) {
    var userID = getUniqueID();
    global.wsClients[userID] = ws;
  
    console.log('connected: ' + userID );
  
    ws.on("message", async function(msg) {
      console.log(msg);
    });
  
    // user disconnected
    ws.on("close", function(connection) {
      console.log(new Date() + " Peer " + userID + " disconnected.");
      delete global.wsClients[userID];
    });
  });


global.wsClients = {};

module.exports = app;