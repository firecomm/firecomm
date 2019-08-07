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
  const duplexObj = {
    send: function(message) {
      const sender = that[methodName](metadata, interceptors);
      sender.write(message, null, () => {
        // this.sender.write(message)
      });
      return duplexObj;
    },
    catch: (first) => {
      if (typeof first !== 'function') {
        throw new Error('Unary Call: catch takes a callback')
      }
      const listener = that[methodName](metadata, interceptors);
      listener.on('error', first);
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
      const listener = that[methodName](metadata, interceptors);
      listener.on('data', listenerCallback);
      return duplexObj;
    }
  }
  return duplexObj;
};
