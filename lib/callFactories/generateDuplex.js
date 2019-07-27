const grpc = require("grpc");

const generateMeta = require("../utils/generateMeta");

// function will take in a duplex call constructor, and return a class which extends the class with our own built in methods on top

function generateDuplex(ServerDuplexStream) {
  const ServerDuplexStreamClone = Object.create(ServerDuplexStream);
  ServerDuplexStreamClone.trailerObject = undefined;
  ServerDuplexStreamClone.throw = function(err) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()"
      );
    }
    err.metadata = generateMeta(this.trailerObject);
    this.emit("error", err);
  };
  ServerDuplexStreamClone.setStatus = function(trailerObject) {
    this.trailerObject = trailerObject;
  };
  ServerDuplexStreamClone.sendMeta = function(metaObject) {
    const metaData = new grpc.Metadata();
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      metaData.set(keys[i], metaObject[keys[i]]);
    }
    this.sendMetadata(metaData);
  };
  return ServerDuplexStreamClone;
}

module.exports = generateDuplex;
