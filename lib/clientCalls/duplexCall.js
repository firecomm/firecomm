const generateMeta = require("../utils/generateMeta");

module.exports = function duplexCall(that, methodName, first, second) {
  let metadata = null;
  let interceptors = null;
  if (typeof first === "object") {
    if (Array.isArray(first)) {
      interceptors = { interceptors: first };
    } else {
      const {options} = first;
      delete first.options;
      metadata = generateMeta(first, options);
    }
  };
  if (typeof second === "object") {
    if (Array.isArray(second)) {
      interceptors = { interceptors: second };
    } else {
      const {options} = second;
      delete second.options;
      metadata = generateMeta(second, options);
    }
  };
  const duplex = that[methodName](metadata, interceptors);
  const duplexObj = {
    // throw: function(metadata) {
    //   sender.throw()
    // },
    getPeer: function(peerCallback) {
      peerCallback(duplex.getPeer());
      return duplexObj;
    },
    write: function(...args) {
      return this.send(...args)
    },
    send: function(message, flags, flushCallback) {
      duplex.write(message, flags, flushCallback);
      return duplexObj;
    },
    catch: function(first) {
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
      };
      switch (first) {
        case 'status': 
          duplex.on('status', second);
          break;
        case 'metadata': 
          duplex.on('metadata', second);
          break;
        case 'error': 
          duplex.on('error', second);
          break;
        default: 
          duplex.on('data', listenerCallback);
        }
    return duplexObj;
    }
  }
  return duplexObj;
};
