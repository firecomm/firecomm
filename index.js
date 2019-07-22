const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const build = require("./lib/build");
const Server = require("./lib/Server");
const Client = require("./lib/Client");

module.exports = {
  Server,
  Client,
  build
};
