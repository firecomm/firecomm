const generateMeta = require("../utils/generateMeta");

// server
// message, metaObject, interceptorArray

module.exports = function serverStreamCall(that, methodName, first /*real*/, second /*real*/) {
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
  let listener = {
    on: (first, second) => setTimeout(() => {
      let callback;
      if (typeof first !== 'function' && typeof second !== 'function') {
        throw new Error('Unary Call: on takes a callback')
      };
      if (typeof first === 'function') {
        callback = first;
      } else {
        callback = second;
      }
      listener.on('data', callback);
    }, 0),
    catch: (first) => setTimeout(() => {
      if (typeof first !== 'function') {
        throw new Error('Unary Call: catch takes a callback')
      }
      listener.on('error', first);
    }, 0),
  }
  const serverStreamObj = {
    send: (message) => {
      listener = that[methodName](message, metadata, interceptors);
      return serverStreamObj;
    },
    catch: (first) => {
      if (typeof first !== 'function') {
        throw new Error('Unary Call: catch takes a callback')
      }
      listener.on('error', first);
      return serverStreamObj;
    },
    on: (first, second) => {
      let callback;
      if (typeof first !== 'function' && typeof second !== 'function') {
        throw new Error('Unary Call: on takes a callback')
      };
      if (typeof first === 'function') {
        callback = first;
      } else {
        callback = second;
      }
      listener.on('data', callback);
      return serverStreamObj;
    }
  };
  return serverStreamObj;
};
