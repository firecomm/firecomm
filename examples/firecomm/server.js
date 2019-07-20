const firecomm = require("../../index");

const package = require("./packageDefinition");

const {
  unaryChat,
  serverStream,
  clientStream,
  bidiChat
} = require("./methodHandlers");

const server = new firecomm.Server();

server.addService(package.RouteGuide, {
  unaryChat,
  serverStream,
  clientStream,
  bidiChat
});

server.start();
