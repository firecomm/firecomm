const grpc = require("grpc");

// function will take in a duplex call constructor, and return a class which extends the class with our own built in methods on top

function generateDuplex(ServerDuplexStream) {
  const ServerDuplexStreamClone = Object.create(ServerDuplexStream);
  ServerDuplexStreamClone.throw = function(err) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()"
      );
    }
    this.emit("error", err);
  };
  ServerDuplexStreamClone.sendMeta = function(metaObject) {
    const metaData = new grpc.Metadata();
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      metaData.set(keys[i], metaObject[keys[i]]);
    }
    this.sendMetadata(metaData);
  };
  console.log({ ServerDuplexStreamClone });

  console.log("proto of clone", ServerDuplexStreamClone.__proto__);

  // console.log("duplex stream constructor", ServerDuplexStream.constructor);
  // class DuplexCall extends ServerDuplexStream.constructor {
  //   constructor(...args) {
  //     super();
  //   }

  //   on(event, callback) {
  //     super.on(event, callback);
  //   }

  //   emit(event, ...args) {
  //     super.emit(event, ...args);
  //   }

  //   end() {
  //     super.end();
  //   }

  //   throw(err) {
  //     if (!(err instanceof Error)) {
  //       throw new Error(
  //         "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()"
  //       );
  //     }
  //     super.emit("error", err);
  //   }

  //   write(message) {
  //     super.write(message);
  //   }

  //   sendMeta(metaObject) {
  //     const metaData = new grpc.Metadata();
  //     const keys = Object.keys(metaObject);
  //     for (let i = 0; i < keys.length; i++) {
  //       metaData.set(keys[i], metaObject[keys[i]]);
  //     }
  //     super.sendMetadata(metaData);
  //   }
  // }
  // return new DuplexCall();
  return ServerDuplexStreamClone;
}

module.exports = generateDuplex;
