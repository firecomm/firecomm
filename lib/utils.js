const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
var PROTO_PATH = path.join(__dirname, "./examples/vanilla_gRPC/proto.proto");

/**
 *
 * Function takes in path to protofile and config options and returns
 * package definition object
 *
 *
 * @param {string} PROTO_PATH
 * @param {object} config
 */

function extractServiceNames(proto) {
  // get the package name
  const packageName = Object.keys(proto)[0];

  const package = proto[packageName];

  const definitions = Object.keys(package);

  const services = definitions.filter(name => {
    return package[name].hasOwnProperty("service");
  });
  return services;
}

function extractServiceDefinitions(proto, serviceNames) {
  const packageName = Object.keys(proto)[0];

  const package = proto[packageName];

  return serviceNames.map(serviceName => package[serviceName]);
}

function getServiceFromName(serviceName, proto) {
  const packageName = Object.keys(proto)[0];

  const package = proto[packageName];

  return package[serviceName];
}

function extractMethodNames(serviceDefinition) {
  return Object.keys(serviceDefinition.service).map(
    x => x[0].toLowerCase() + x.substring(1)
  );
}

const package = buildPackage(PROTO_PATH);
// console.log(Object.keys(package));
// const definitions = extractServiceDefinitions(package);
// console.log(Object.keys(definitions[0]));
// console.log(extractMethodNames(definitions[0]));

module.exports = {
  extractServiceNames,
  extractServiceDefinitions,
  extractMethodNames
};
