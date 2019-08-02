const generateMeta = require("../utils/generateMeta");

// metaObject, interceptorArray

module.exports = function duplexCall(that, methodName, ...args) {
  let interceptors = undefined;
  let metadata = undefined;
  if (args.length) {
    while (args[args.length - 1] === undefined) {
      // console.log(args[args.length - 1]);
      args.pop();
    }
  }
  // console.log(args);
  for (let i = 0; i < args.length; i++) {
    if (typeof (args[i] === "object")) {
      if (Array.isArray(args[i])) {
        interceptors = { interceptors: args[i] };
      } else {
        metadata = generateMeta(args[i]);
      }
    }
  }
  // console.log(metadata, interceptors);
  return that[methodName](metadata, interceptors);
};
