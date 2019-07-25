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
  const pkg = grpc.loadPackageDefinition(packageDefinition);
  return pkg[Object.keys(pkg)[0]];
};
