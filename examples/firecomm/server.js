const grpc = require("grpc");
const firecomm = require("../../index");
const fs = require("fs");
const path = require("path");

const package = require("./packageDefinition");

// console.log({ package });

const {
  unaryChat,
  serverStream,
  clientStream,
  bidiChat
} = require("./methodHandlers");
const waitFor = require("./middleware");

const server = new firecomm.Server();

server.addService(
  package.RouteGuide,
  { unaryChat: [waitFor, unaryChat], serverStream, clientStream, bidiChat },
  context => {
    console.log("inside of service level middleware");
  }
);

console.log({ server });
// console.log("server proto", server.__proto__);
// console.log(
//   "proto of server handler",
//   server.handlers["/routeguide.RouteGuide/UnaryChat"]
// );

// let certPath = path.join(__dirname, '/server.crt');
// let keyPath = path.join(__dirname, '/server.key');

// {private_key: (__dirname + '/server.crt'), certificate: (__dirname +
// '/server.key')}
server.bind("0.0.0.0:3000", {
  before_private_key: __dirname + "/server.key",
  certificate: __dirname + "/server.crt"
});
// console.log({server})
// console.log(new grpc.Server().__proto__)

server.start();

// console.log(server.server)
