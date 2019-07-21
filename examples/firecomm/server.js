const grpc = require('grpc');
const firecomm = require('../../index');

const package = require('./packageDefinition');

const {unaryChat, serverStream, clientStream, bidiChat} =
    require('./methodHandlers');
const waitFor = require('./middleware');

const server = new firecomm.Server();

server.addService(
    package.RouteGuide,
    {unaryChat: [waitFor, unaryChat], serverStream, clientStream, bidiChat});


server.bind('0.0.0.0:3000')

server.start()

console.log(server.server)
