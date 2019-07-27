const firecomm = require("../../index");
const path = require("path");
var PROTO_PATH = path.join(__dirname, "./proto.proto");

const package = firecomm.build(PROTO_PATH);

module.exports = package;
