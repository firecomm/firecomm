const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

module.exports = function build(
  PROTO_PATH,
  config = {
    keepCase: true,
    longs: String, // String or Number
    enums: String, // must be String
    bytes: String, // Array or String
    defaults: true, // Set default values on output objects. Defaults to false.
    arrays: true, // Set empty arrays for missing array values even if defaults is false Defaults to false.
    objects: true, // Set empty objects for missing object values even if defaults is false Defaults to false.
    oneofs: true // Set virtual oneof properties to the present field's name. Defaults to false.
    // includeDirs: ['',''] A list of search paths for imported .proto files.
  }
) {
  config = {
    ...{
      keepCase: true,
      longs: String, // String or Number
      enums: String, // must be String
      bytes: String, // Array or String
      defaults: true, // Set default values on output objects. Defaults to false.
      arrays: true, // Set empty arrays for missing array values even if defaults is false Defaults to false.
      objects: true, // Set empty objects for missing object values even if defaults is false Defaults to false.
      oneofs: true // Set virtual oneof properties to the present field's name. Defaults to false.
    },
    ...config
  };
  switch (true) {
    case config.keepCase !== false && config.keepCase !== true:
      throw new Error(
        "BUILD ERROR: config object's keepcase must be a boolean"
      );
    case config.longs !== Number && config.longs !== String:
      throw new Error(
        "BUILD ERROR: config object's longs must be a Number or a String"
      );
    case config.enums !== String:
      throw new Error("BUILD ERROR: config object's enums must be a String");
    case config.bytes !== String && config.bytes !== Array:
      throw new Error("BUILD ERROR: config object's bytes must be a boolean");
    case typeof config.defaults !== false && config.defaults !== true:
      throw new Error(
        "BUILD ERROR: config object's defaults must be a boolean"
      );
    case typeof config.arrays !== false && config.arrays !== true:
      throw new Error("BUILD ERROR: config object's arrays must be a boolean");
    case typeof config.objects !== false && config.objects !== true:
      throw new Error("BUILD ERROR: config object's objects must be a boolean");
    case typeof config.oneofs !== false && config.oneofs !== true:
      throw new Error("BUILD ERROR: config object's oneofs must be a boolean");
    default:
      const packageDefinition = protoLoader.loadSync(PROTO_PATH, config);
      const pkg = grpc.loadPackageDefinition(packageDefinition);
      const serviceKeys = Object.keys(pkg[Object.keys(pkg)[0]]);
      for (let i = 0; i < serviceKeys.length; i++) {
        pkg[Object.keys(pkg)[0]][serviceKeys[i]]._serviceName = serviceKeys[i];
      }
      return pkg[Object.keys(pkg)[0]];
  }
};
