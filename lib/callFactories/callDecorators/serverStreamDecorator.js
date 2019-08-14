// set()
// adds to a metadata property... if there is one... is adds it... otherwise it does not... adds it to the metadata property

//.send()
// writes

//throw
//sends an error

//.emit

const generateMeta = require("../../utils/generateMeta");

module.exports = function serverStreamDecorator(customCall, originalCall) {
  customCall.metadata = undefined;
  customCall.metadataSent = false;

  customCall.throw = function(err) {
    if (!(err instanceof Error)) {
      throw new Error(
        "Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()"
      );
    }
    originalCall.emit("error", err);
    return this;
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
      this.metadata = object;
    }
    return this;
  };

  // customCall.write = function(...args) {
  //   customCall.send(...args);
  // }

  customCall.send = function(message) {
    if (!this.metadataSent && this.metadata) {
      const metadata = generateMeta(this.metadata);
      originalCall.sendMetadata(metadata);
    }
    originalCall.write(message);
  };
  return this;
};
