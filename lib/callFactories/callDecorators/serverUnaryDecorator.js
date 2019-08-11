const grpc = require("grpc");
const generateMeta = require("../../utils/generateMeta");
// server unary

// .send () // writes
// .throw passes everything into call... if they pass a second parameter it becomes trailers
// set() adds things to the metadata...

module.exports = function serverUnaryDecorator(clone, sendCallback) {
  clone.metadata = undefined;
  clone.sendCallback = sendCallback;

  clone.send = function(message, flags) {
    if (this.metadata) {
      this.call.sendMetadata(generateMeta(this.metadata));
    }
    this.sendCallback(null, message, null, flags);
  };

  clone.set = function(object, options) {
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
  };

  clone.throw = function(err, trailers) {
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
