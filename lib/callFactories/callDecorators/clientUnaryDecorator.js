// head... read straight off

// client unary means that head gets read straight off
// .on is a method that immediately invokes on the body
//this.body becomes the thing

module.exports = function clientUnaryDecorator(customCall, originalCall) {
  customCall.body = originalCall.request;

  customCall.head = originalCall.metadata;

  customCall.on = function(string, callback) {
    if (typeof string !== "function" && callback === undefined) {
      throw new Error("Second parameter to .on must be a callback.");
    }
    if (typeof string === "function") {
      string(this.body);
    } else {
      if (typeof string !== "string") {
        throw new Error(
          '.on takes "data" or "metadata" parameter and a callback to be invoked on data, or just the callback.'
        );
      } else {
        if (string === "data") {
          callback(this.body);
        } else if (string === "metadata") {
          callback(this.head);
        } else if (event === "cancelled") {
          originalCall.on("cancelled", callback);
        } else {
          throw new Error('Only the "data" and "metadata" events are supported by unary .on');
        }
      }
    }
    return this;
  };
};
