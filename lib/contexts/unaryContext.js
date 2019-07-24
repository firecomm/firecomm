const grpc = require('grpc');

class UnaryContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
    this.metaData = undefined;
    this.req = {meta: call.metadata, data: call.request};
    console.log(Object.keys(call));
    this.trailer = undefined;
    }

  throw(err) {
    if (!(err instanceof Error)) {
      throw(new Error(
          'Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()'));
    }
    this.callback(err, {}, this.trailer);
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

  setStatus(metaObject) {
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
    this.callback(this.err, message, this.trailer);
  }
}

module.exports = UnaryContext;
