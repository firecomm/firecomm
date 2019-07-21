const grpc = require('grpc');

class UnaryContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
    this.metaData = undefined;
    this.err = null;
    this.req = {meta: call.metadata, data: call.request};
    console.log(Object.keys(call));
    this.trailers = undefined;
  }

  setMeta(metaObject) {
    if (!this.metaData) {
      this.metaData = new grpc.Metadata();
      }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.metaData.set(keys[i], metaObject[keys[i]]);
    }
  }

  send(message = {}) {
    if (this.metaData) {
      this.call.sendMetadata(this.metaData);
    }
    this.callback(this.err, message, this.trailers);
  }
  }

class ClientStreamContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
  }
  }

class ServerStreamContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
  }
  }

class DuplexContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
  }
}

module.exports = {
  UnaryContext,
  ClientStreamContext,
  ServerStreamContext,
  DuplexContext
};
