const grpc = require("grpc");
const generateMeta = require("../../utils/generateMeta");

module.exports = function serverUnaryDecorator(customCall, sendCallback) {
  customCall.metadata = undefined;
  customCall.sendCallback = sendCallback;

  // customCall.write = function(...args) {
  //   customCall.send(...args);
  // }

  customCall.send = function(message, flags) {
    if (this.metadata) {
      this.call.sendMetadata(generateMeta(this.metadata));
    }
    this.sendCallback(null, message, null, flags);
    return this;
  };

  customCall.set = function(object, options) {
    // loop through
    if (typeof object !== "object") {
      throw new Error("Set should be passed an object with string values.");
    }
    if (this.metadata) {
      this.metadata = {
        ...this.metadata,
        ...object
      };
    } else {
      this.metadata = { ...object };
    }
    return this;
  };

  customCall.throw = function(err, trailers) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using call.setStatus()"
      );
    }

    if (typeof trailers !== "undefined") {
      if (typeof trailers !== "object") {
        throw new Error(
          "Please input trailers, second parameter to Throw as an object."
        );
      }
      this.trailers = generateMeta(trailers);

      const keys = Object.keys(trailers);
      for (let i = 0; i < keys.length; i++) {
        this.trailer.set(keys[i], metaObject[keys[i]]);
      }
    } else {
      this.trailers = trailers;
    }

    this.sendCallback(err, {}, this.trailers);
    return this;
  };
};
