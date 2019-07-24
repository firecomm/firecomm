const grpc = require('grpc')

class ServerStreamContext {
  constructor(call) {
    this.call = call;
    this.req = {meta: call.metadata, data: call.request};
    }

  throw(err) {
    if (!(err instanceof Error)) {
      throw(new Error(
          'Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()'));
    }
    this.call.emit('error', err);
  }

  emit(event, ...args) {
    this.call.emit(event, ...args);
  }

  sendMeta(metaObject) {
    const metaData = new grpc.Metadata();
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      metaData.set(keys[i], metaObject[keys[i]]);
    }
    this.call.sendMetadata(metaData);
  }

  write(message) {
    this.call.write(message)
  }
}

module.exports = ServerStreamContext;