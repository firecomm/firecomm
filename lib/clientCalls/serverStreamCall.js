const generateMeta = require("../utils/generateMeta");

// server
// message, metaObject, interceptorArray

module.exports = function serverStreamCall(that, methodName, ...args) {
  // console.log(args);
  if (typeof args[0] !== "object") {
    throw new Error("First parameter required and must be of type: Message.");
  }
  let message = args[0];
  let interceptors = undefined;
  let metadata = undefined;
  args = args.filter(arg => args !== undefined);
  // if (args.length) {
  //   while (args[args.length - 1] === undefined) {
  //     args.pop();
  //   }
  // }
  for (let i = 1; i < args.length; i++) {
    if (typeof (args[i] === "object")) {
      if (Array.isArray(args[i])) {
        interceptors = { interceptors: args[i] };
      } else {
        metadata = generateMeta(args[i]);
      }
    }
  }
  // console.log({ metadata });
  return that[methodName](message, metadata, interceptors);
};
