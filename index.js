const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const build = require('./lib/build');
const Server = require('./lib/Server');
const Stub = require('./lib/Stub');

module.exports = {
  Server,
  Stub,
  build
};
