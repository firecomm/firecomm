const grpc = require("grpc");

const basicCallDecorator = require("./callDecorators/basicCallDecorator");
const serverUnaryDecorator = require("./callDecorators/serverUnaryDecorator");
const clientUnaryDecorator = require("./callDecorators/clientUnaryDecorator");

// function serverUnaryDecorator(callClone, serverCall, callback) {
//   callClone...
// }
// callClone.throw (err, trailers)
// check for err to be eror objects
// converts trailers to grpc Metadata class.
// passes them in the right place to callback
// callClone.on = ("data" |/& callback) => callback(callClone.body)
// callClone.set()
// calllClone.body = serverCall.request

function generateUnaryCall(ServerUnaryCall, callback) {
  const ServerUnaryCallClone = Object.create(ServerUnaryCall);
  ServerUnaryCallClone.callback = callback;
  ServerUnaryCallClone.err = null;
  ServerUnaryCallClone.state = null;
  ServerUnaryCallClone.metaData = undefined;
  ServerUnaryCallClone.trailer = undefined;
  ServerUnaryCallClone.body = ServerUnaryCall.request;
  ServerUnaryCallClone.metadata = ServerUnaryCall.metadata;
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

module.exports = function(ServerUnaryCall, callback) {
  const ServerUnaryCallClone = Object.create(ServerUnaryCall);
  basicCallDecorator(ServerUnaryCallClone, ServerUnaryCall);
  clientUnaryDecorator(ServerUnaryCallClone, ServerUnaryCall);
  serverUnaryDecorator(ServerUnaryCallClone, callback);
  return ServerUnaryCallClone;
};
