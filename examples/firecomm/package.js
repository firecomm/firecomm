// package.js
const { build } = require( '../../index.js' );
const path = require( 'path' );
const PROTO_PATH = path.join( __dirname, './proto/exampleAPI.proto' );

const CONFIG_OBJECT = {
  keepCase: true, // keeps everything camelCased
  longs: Number, // compiles the potentially enormous `double`s for our BenchmarkMsg requests and responses into a JavaScript Number rather than a String
}
const package = build( PROTO_PATH, CONFIG_OBJECT );
module.exports = package;