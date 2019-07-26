const grpc = require("grpc");

function generateClientStreamCall(ServerReadableStream, callback) {
  console.log({ ServerReadableStream });
  console.log(typeof ServerReadableStream);
  console.log({ callback });
  class ClientStreamCall extends ServerReadableStream {
    constructor(callback) {
      super();
      if (typeof callback !== "function")
        throw new Error(`CALL ERROR: @param1 callback must be a function`);
      this.callback = callback;
      this.metaData = undefined;
      this.trailer = undefined;
      this.err = null;
    }

    on(event, callback) {
      super.on(event, callback);
    }

    throw(err) {
      if (!(err instanceof Error)) {
        throw new Error(
          "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using call.setStatus()"
        );
      }
      this.callback(err, {}, this.trailer);
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
        super.sendMetadata(this.metaData);
      }
      this.callback(this.err, message, this.trailer);
    }

    end() {
      super.end();
    }
  }

  return new ClientStreamCall(callback);
}

module.exports = generateClientStreamCall;
