const grpc = require("grpc");
const protoLoader = require("../build");
const PROTO_PATH = path.join(__dirname, "./healthcheck.proto");

const healthcheck = build(PROTO_PATH, { enums: Object });
console.log(healthcheck);
module.exports = healthcheck;
