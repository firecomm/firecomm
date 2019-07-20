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

function buildPackage(
  PROTO_PATH,
  config = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
) {
  config = {
    ...config,
    ...{
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
  };
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, config);
  return grpc.loadPackageDefinition(packageDefinition);
}

function extractServiceDefinitions(proto) {
  // get the package name
  const packageName = Object.keys(proto)[0];

  const package = proto[packageName];

  const definitions = Object.keys(package);

  console.log(definitions);

  const services = definitions
    .filter(name => {
      console.log(name);
      return package[name].hasOwnProperty("service");
    })
    .map(serviceName => {
      return package[serviceName];
    });
  return services;
}

function extractMethodNames(serviceDefinition) {
  return Object.keys(serviceDefinition.service).map(
    x => x[0].toLowerCase() + x.substring(1)
  );
}

// const package = buildPackage(PROTO_PATH);
// const definitions = extractServiceDefinitions(package);
// // console.log(definitions);
// console.log(extractMethodNames(definitions[0]));

module.exports = {
  extractServiceDefinitions,
  buildPackage,
  extractMethodNames
};
