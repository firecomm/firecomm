const grpc = require("grpc");
const generateMeta = require("../../utils/generateMeta");
// server unary

// .send () // writes
// .throw passes everything into call... if they pass a second parameter it becomes trailers
// set() adds things to the metadata...

module.exports = function serverUnaryDecorator(customCall, sendCallback) {
  customCall.metadata = undefined;
  customCall.sendCallback = sendCallback;

  customCall.send = function(message) {
    if (this.metadata) {
      this.sendMetadata(this.metadata);
    }
    this.sendCallback(undefined);
  };

  customCall.set = function(object) {
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
      this.metadata;
    }
  };

  customCall.throw = function(err, trailers) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using call.setStatus()"
      );
    }

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

    this.sendCallback(err, {}, this.trailers);
  };
  //   ServerUnaryCallClone.send = function(message = {}) {
  //     if (this.metaData) {
  //       this.sendMetadata(this.metaData);
  //     }
  //     this.sendCallback(this.err, message, this.trailer);
  //   };
  //   return ServerUnaryCallClone;
  // }

  // ServerUnaryCallClone.throw = function(err) {
  //   if (!(err instanceof Error)) {
  //     throw new Error(
  //       "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using call.setStatus()"
  //     );
  //   }
  //   this.sendCallback(err, {}, this.trailer);
  // };
  // ServerUnaryCallClone.setMeta = function(metaObject) {
  //   if (!this.metaData) {
  //     this.metaData = new grpc.Metadata();
  //   }
  //   const keys = Object.keys(metaObject);
  //   for (let i = 0; i < keys.length; i++) {
  //     this.metaData.set(keys[i], metaObject[keys[i]]);
  //   }
  // };

  // ServerUnaryCallClone.setStatus = function(metaObject) {
  //   if (!this.trailer) {
  //     this.trailer = new grpc.Metadata();
  //   }
  //   const keys = Object.keys(metaObject);
  //   for (let i = 0; i < keys.length; i++) {
  //     this.trailer.set(keys[i], metaObject[keys[i]]);
  //   }
  // };
};
