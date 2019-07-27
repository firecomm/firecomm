const routeguide = require('../firecomm/routeguide');
const grpc = require('grpc');

const {unaryChat, serverStream, clientStream, bidiChat} =
    require('./methodHandlers');

function getServer() {
  var server = new grpc.Server();
  server.addService(
      routeguide.RouteGuide.service,
      {unaryChat, serverStream, clientStream, bidiChat});
  return server;
  }

var routeServer = getServer();
routeServer.bind('0.0.0.0:3001', grpc.ServerCredentials.createInsecure());
routeServer.start();

console.log(routeServer)
