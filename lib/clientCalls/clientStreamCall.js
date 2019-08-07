const generateMeta = require("../utils/generateMeta");

// (metaObject, interceptorArray, callback)

module.exports = function clientStreamCall(that, methodName, ...args) {
  let interceptors = undefined;
  let metadata = undefined;
  let callback = undefined;
  let hasFunction = false;
  args = args.filter(arg => args !== undefined);
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === "function") {
      callback = args[i];
      hasFunction = true;
    } else {
      if (typeof (args[i] === "object")) {
        if (Array.isArray(args[i])) {
          interceptors = { interceptors: args[i] };
        } else {
          metadata = generateMeta(args[i]);
        }
      }
    }
  }
  if (!hasFunction) {
    throw new Error("Must include a callback function to client Stream Call");
  }
  console.log(that[methodName]);
  return that[methodName](callback);
};
