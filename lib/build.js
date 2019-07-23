const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

module.exports = function build(
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
  const package = grpc.loadPackageDefinition(packageDefinition);
  console.log(package)
  return package[Object.keys(package)[0]];
};
