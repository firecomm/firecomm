const grpc = require("grpc");

class UnaryContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
    this.metaData = undefined;
    this.err = null;
    this.trailers = undefined;
  }

  setMetaData(metaObject) {
    const metaData = new grpc.Metadata();
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      metaData.set(keys[i], metaObject[keys[i]]);
    }
  }

  send(message) {
    this.callback(this.err, message, this.metaData);
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
