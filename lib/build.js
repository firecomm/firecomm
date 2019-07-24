const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

module.exports = function build(PROTO_PATH, config = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}) {
  config = {
    ...{
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    },
    ...config
  };
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, config);
<<<<<<< HEAD
  const package = grpc.loadPackageDefinition(packageDefinition);
  // console.log(package) ===
          // { routeguide:
          //   { RouteGuide:
          //      { [Function: ServiceClient] super_: [Function: Client], service: [Object] },
          //     Chat:
          //      { format: 'Protocol Buffer 3 DescriptorProto',
          //        type: [Object],
          //        fileDescriptorProtos: [Array] } } }
  return package[Object.keys(package)[0]];
=======
  const pkg = grpc.loadPackageDefinition(packageDefinition);
  return pkg[Object.keys(pkg)[0]];
>>>>>>> 088b13caa1836da9d7f9f6578831d5764b8fbc77
};
