// /proto/package.js
const { build } = require( '../../../index.js' );
const path = require( 'path' );
const PROTO_PATH = path.join( __dirname, './exampleAPI.proto' );

const CONFIG_OBJECT = {
  keepCase: true, // keeps our RPC methods camelCased
  longs: Number, // compiles the potentially enormous `double`s for our Benchmark requests and responses into a Number rather than a String
}
const package = build( PROTO_PATH, CONFIG_OBJECT );
module.exports = package;