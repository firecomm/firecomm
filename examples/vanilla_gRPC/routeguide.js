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
// console.log(Object.keys(protoDescriptor));
var routeguide = protoDescriptor.routeguide;
// console.log(Object.keys(routeguide));

// console.log(routeguide.RouteGuide);
// console.log(Object.keys(routeguide.RouteGuide.service));
module.exports = routeguide;
