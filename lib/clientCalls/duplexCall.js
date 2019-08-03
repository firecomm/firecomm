const generateMeta = require("../utils/generateMeta");

// metaObject, interceptorArray

module.exports = function duplexCall(that, methodName, ...args) {
  let interceptors = undefined;
  let metadata = undefined;
  args = args.filter(arg => args !== undefined);
  // while (args[args.length - 1] === undefined && args.length) {
  //   console.log(args);
  //   args.pop();
  // }
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
