const generateMeta = require("../utils/generateMeta");

// (metaObject, interceptorArray, callback)

module.exports = function clientStreamCall(that, methodName, ...args) {
  let interceptors = undefined;
  let metadata = undefined;
  let callback = undefined;
  let promise = true;
  while (args[args.length - 1] === undefined) {
    args.pop();
  }
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === "function") {
      callback = args[i];
      promise = false;
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
  if (promise) {
    return new Promise((resolve, reject) => {
      that[methodName](metadata, interceptors, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  } else {
    return that[methodName](metadata, interceptors, callback);
  }
};
