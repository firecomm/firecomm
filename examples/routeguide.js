const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
var PROTO_PATH = path.join(__dirname, "./proto.proto");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var routeguide = protoDescriptor.routeguide;
module.exports = routeguide;
