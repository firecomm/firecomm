const generateMeta = require("../utils/generateMeta");

module.exports = function unaryCall(that, methodName, ...args) {
  if (typeof args[0] !== "object") {
    throw new Error("First parameter required and must be of type: Message.");
  }
  let message = args[0];
  let interceptors = undefined;
  let metadata = undefined;
  let callback = undefined;
  let promise = true;
  while (args[args.length - 1] === undefined) {
    args.pop();
  }
  for (let i = 1; i < args.length; i++) {
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
      that[methodName](message, metadata, interceptors, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  } else {
    return that[methodName](message, metadata, interceptors, callback);
  }
};
// message interceptors

// []

//

// if callback is undefined... there are sevral cases

//no interceptors, no metaObject

//if second parameter is either function, array, or object
//

//you have access to the methodtype

// unaryExpression

// client

// (metaObject, interceptorArray, callback)

// server
// message, metaObject, interceptorArray

// suplex

// metaObject, interceptorArray
