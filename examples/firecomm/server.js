const grpc = require('grpc')

    const firecomm = require('../../index');

// const package = require('./packageDefinition');

const package = require('./routeguide')

    const {unaryChat, serverStream, clientStream, bidiChat} =
        require('./methodHandlers');

const server = new firecomm.Server();

// server.addService(
//     package.RouteGuide, {unaryChat, serverStream, clientStream, bidiChat});

server.server.addService(
    package.RouteGuide.service,
    {unaryChat, serverStream, clientStream, bidiChat});

// server.server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure())

server.bind('0.0.0.0:3000')

server.server.start()

console.log(server.server)
