const grpc = require("grpc");

const basicCallDecorator = require("./callDecorators/basicCallDecorator");
const clientStreamDecorator = require("./callDecorators/clientStreamDecorator");
const serverUnaryDecorator = require("./callDecorators/serverUnaryDecorator");

function generateClientStreamCall(ServerReadableStream, callback) {
  const ServerReadableStreamClone = Object.create(ServerReadableStream);
  ServerReadableStreamClone.callback = callback;
  ServerReadableStreamClone.state = null;
  ServerReadableStreamClone.metaData = undefined;
  ServerReadableStreamClone.err = null;
  ServerReadableStreamClone.trailer = undefined;
  ServerReadableStreamClone.throw = function(err) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using call.setStatus()"
      );
    }
    this.callback(err, {}, this.trailer);
  };
  ServerReadableStreamClone.setStatus = function(metaObject) {
    if (!this.trailer) {
      this.trailer = new grpc.Metadata();
    }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.trailer.set(keys[i], metaObject[keys[i]]);
    }
  };

  ServerReadableStreamClone.setMeta = function(metaObject) {
    if (!this.metaData) {
      this.metaData = new grpc.Metadata();
    }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.metaData.set(keys[i], metaObject[keys[i]]);
    }
  };

  ServerReadableStreamClone.send = function(message = {}) {
    if (this.metaData) {
      this.sendMetadata(this.metaData);
    }
    this.callback(this.err, message, this.trailer);
  };

  return ServerReadableStreamClone;
}

module.exports = function(ServerReadableStream, callback) {
  const ServerReadableStreamClone = Object.create(ServerReadableStream);
  basicCallDecorator(ServerReadableStreamClone, ServerReadableStream);
  clientStreamDecorator(ServerReadableStreamClone, ServerReadableStream);
  serverUnaryDecorator(ServerReadableStreamClone, callback);
  return ServerReadableStreamClone;
};
