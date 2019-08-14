// on accepts a string... if it is not a string... it adds the callback to the data property... otherwise it just adds it to the actual one

// catch catches an error

module.exports = function(customCall, originalCall) {
  customCall.on = function(event, callback) {
    if (typeof event === "function") {
      originalCall.on("data", event);
    } else if (typeof event === "string") {
      if (event === "data") {
        originalCall.on("data", callback);
      } else if (event === "metadata") {
        callback(this.head);
      } else if (event === "cancelled") {
        originalCall.on("cancelled", callback);
      } else {
        originalCall.on(event, callback);
      }
    } else {
      throw new Error(
        "type of first parameter must be string or callback function."
      );
    }
    return this;
  };

  customCall.catch = function(callback) {
    this.call.on("error", callback);
    return this;
  };
};
