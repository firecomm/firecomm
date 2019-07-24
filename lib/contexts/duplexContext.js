const grpc = require('grpc');

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

  throw(err) {
    if (!(err instanceof Error)) {
      throw(new Error(
          'Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()'));
    }
    this.call.emit('error', err);
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

module.exports = DuplexContext;