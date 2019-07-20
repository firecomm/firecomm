const firecomm = require("../../index");
const path = require("path");
var PROTO_PATH = path.join(__dirname, "./proto.proto");

const {
  unaryChat,
  serverStream,
  clientStream,
  bidiChat
} = require("./methodHandlers");

const package = firecomm.build(PROTO_PATH);

const server = new firecomm.Server();

server.addService(package.RouteGuide, {
  unaryChat,
  serverStream,
  clientStream,
  bidiChat
});

server.start();
