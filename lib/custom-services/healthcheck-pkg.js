// const grpc = require("grpc");
const path = require("path");
const build = require("../build");
const PROTO_PATH = path.join(__dirname, "./healthcheck.proto");

const healthcheck = build(PROTO_PATH);
module.exports = healthcheck;
