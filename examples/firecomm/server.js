const grpc = require('grpc');
const firecomm = require('../../index');
const fs = require('fs');
const path = require('path');

const package = require('./packageDefinition');

const { unaryChat, serverStream, clientStream, bidiChat } = require('./methodHandlers');
const waitFor = require('./middleware');

const server = new firecomm.Server();

server.addService(
    package.RouteGuide,
    { unaryChat: [waitFor, unaryChat], serverStream, clientStream, bidiChat });

// let certPath = path.join(__dirname, '/server.crt'); 
// let keyPath = path.join(__dirname, '/server.key'); 

    // {private_key: (__dirname + '/server.crt'), certificate: (__dirname + '/server.key')}
server.bind('0.0.0.0:3000', {'before_private_key': (__dirname + '/server.key'), 'certificate': (__dirname + '/server.crt')})

server.start()

// console.log(server.server)
