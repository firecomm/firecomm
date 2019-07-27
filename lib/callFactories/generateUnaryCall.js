const grpc = require("grpc");

function generateUnaryCall(ServerUnaryCall, callback) {
  const ServerUnaryCallClone = Object.create(ServerUnaryCall);
  if (typeof callback !== 'function') throw new Error('CALL ERROR: @param2 Unary Call must take a callback');
  ServerUnaryCallClone.callback = callback;
  ServerUnaryCallClone.err = null;
  ServerUnaryCallClone.metaData = undefined;
  ServerUnaryCallClone.trailer = undefined;
  ServerUnaryCallClone.req = { meta: this.metadata, data: this.request };
  ServerUnaryCallClone.throw = function(err) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using call.setStatus()"
      );
    }
    this.callback(err, {}, this.trailer);
  };
  ServerUnaryCallClone.setMeta = function(metaObject) {
    if (!this.metaData) {
      this.metaData = new grpc.Metadata();
    }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.metaData.set(keys[i], metaObject[keys[i]]);
    }
  };

  ServerUnaryCallClone.setStatus = function(metaObject) {
    if (!this.trailer) {
      this.trailer = new grpc.Metadata();
    }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.trailer.set(keys[i], metaObject[keys[i]]);
    }
  };

  ServerUnaryCallClone.send = function(message = {}) {
    if (this.metaData) {
      this.sendMetadata(this.metaData);
    }
    this.callback(this.err, message, this.trailer);
  };
  return ServerUnaryCallClone;
}

module.exports = generateUnaryCall;
