const grpc = require("grpc");
const path = require("path");
const build = require("../build");

const protoLoader = require("../build");
const PROTO_PATH = path.join(__dirname, "./healthcheck.proto");

const healthcheck = build(PROTO_PATH);
console.log(healthcheck);
module.exports = healthcheck;
