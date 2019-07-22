const grpc = require('grpc');

class UnaryContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
    this.metaData = undefined;
    this.err = null;
    this.req = {meta: call.metadata, data: call.request};
    this.res = {};
    console.log(Object.keys(call));
    this.trailer = undefined;
  }

  // throw(err) {
  //   if (typeof err === 'string') {
  //     this.err = { errorMessage: err }
  //   } else {
  //     this.err = err;
  //   }
  //   this.callback(err, {}, this.trailer)
  // }

  setMeta(metaObject) {
    if (!this.metaData) {
      this.metaData = new grpc.Metadata();
      }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.metaData.set(keys[i], metaObject[keys[i]]);
    }
  }

  setTrailer(metaObject) {
    if (!this.trailer) {
      this.trailer = new grpc.Metadata();
      }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.trailer.set(keys[i], metaObject[keys[i]]);
    }
  }

  send(message = {}) {
    if (this.metaData) {
      this.call.sendMetadata(this.metaData);
    }
    this.callback(this.err, this.res.body, this.trailer);
  }
  }

class ClientStreamContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
  }
  }

class ServerStreamContext {
  constructor(call) {
    this.call = call;
  }
  }

class DuplexContext {
  constructor(call) {
    this.call = call;
  }

  on(event, callback) {
    this.call.on(event, callback);
  }

  emit(event, ...args) {
    this.call.emit(event, ...args);
  }

  end() {
    this.call.end();
  }

  write(message) {
    this.call.write(message);
  }

  sendMeta(metaObject) {
    const metaData = new grpc.Metadata();
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      metaData.set(keys[i], metaObject[keys[i]]);
    }
    this.call.sendMetadata(metaData);
  }
}

module.exports = {
  UnaryContext,
  ClientStreamContext,
  ServerStreamContext,
  DuplexContext
};
