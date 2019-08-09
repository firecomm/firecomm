const generateMeta = require("../utils/generateMeta");

// metaObject, interceptorArray

module.exports = function duplexCall(that, methodName, first, second) {
  let metadata;
  let interceptors;
  if (typeof first === "object") {
    if (Array.isArray(first)) {
      interceptors = { interceptors: first };
    } else {
      metadata = generateMeta(first);
    }
  };
  if (typeof second === "object") {
    if (Array.isArray(second)) {
      interceptors = { interceptors: second };
    } else {
      metadata = generateMeta(second);
    }
  };
  const duplex = that[methodName](metadata, interceptors);
  const duplexObj = {
    send: function(message, flags, flushCallback) {
      duplex.write(message, flags, flushCallback);
      return duplexObj;
    },
    catch: (first) => {
      if (typeof first !== 'function') {
        throw new Error('Unary Call: catch takes a callback')
      }
      duplex.on('error', first);
      return duplexObj;
    },
    on: (first, second) => {
      let listenerCallback;
      if (typeof first !== 'function' && typeof second !== 'function') {
        throw new Error('Unary Call: on takes a callback')
      };
      if (typeof first === 'function') {
        listenerCallback = first;
      } else {
        listenerCallback = second;
      }
      duplex.on('data', listenerCallback);
      return duplexObj;
    }
  }
  return duplexObj;
};
