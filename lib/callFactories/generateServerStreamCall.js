const grpc = require("grpc");

const generateMeta = require("../utils/generateMeta");

function generateServerStreamCall(ServerWritableStream) {
  ServerWritableStreamClone = Object.create(ServerWritableStream);
  ServerWritableStreamClone.state = null;
  ServerWritableStreamClone.metaData = undefined;
  ServerWritableStreamClone.trailerObject = undefined;
  ServerWritableStreamClone.req = { meta: this.metadata, data: this.request };
  ServerWritableStreamClone.throw = function(err) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()"
      );
    }
    err.metadata = generateMeta(this.trailerObject);
    this.emit("error", err);
  };
  ServerWritableStreamClone.setStatus = function(trailerObject) {
    this.trailerObject = trailerObject;
  };
  ServerWritableStreamClone.sendMeta = function(metaObject) {
    const metaData = new grpc.Metadata();
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      metaData.set(keys[i], metaObject[keys[i]]);
    }
    this.sendMetadata(metaData);
  };

  return ServerWritableStreamClone;
}

// class ServerStreamCall {
//   constructor(call, no2ndArg) {
//     this.call = call;
//     if (no2ndArg !== undefined)
//       throw new Error("CALL ERROR: ServerStreamCall takes only one argument");
//     this.req = { meta: call.metadata, data: call.request };
//   }

//   throw(err) {
//     if (!(err instanceof Error)) {
//       throw new Error(
//         "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()"
//       );
//     }
//     this.call.emit("error", err);
//   }

//   emit(event, ...args) {
//     this.call.emit(event, ...args);
//   }

//   sendMeta(metaObject) {
//     const metaData = new grpc.Metadata();
//     const keys = Object.keys(metaObject);
//     for (let i = 0; i < keys.length; i++) {
//       metaData.set(keys[i], metaObject[keys[i]]);
//     }
//     this.call.sendMetadata(metaData);
//   }

//   write(message) {
//     this.call.write(message);
//   }
// }

module.exports = generateServerStreamCall;
