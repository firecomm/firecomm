const grpc = require('grpc');
// takes in a js object, returns a grpc metadata object with the same properties
module.exports = function generateMeta(metaObject) {
  const metadata = new grpc.Metadata();
  const keys = Object.keys(metaObject);
  for (let i = 0; i < keys.length; i++) {
    metadata.set(keys[i], metaObject[keys[i]]);
  }
}