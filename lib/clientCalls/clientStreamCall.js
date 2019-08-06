const generateMeta = require("../utils/generateMeta");

// (metaObject, interceptorArray, callback)

module.exports = function clientStreamCall(that, methodName, first, second) {
  let metadata = undefined;
  let interceptors = undefined;
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
  let callback = function(err, res) {
    if(err) clientStreamObj.$catch(err);
    clientStreamObj.$on(res);
    return clientStreamObj;
  };
  let stream = that[methodName](metadata, interceptors, callback);
  const clientStreamObj = {
    send: (message) => {
      console.log(stream)
      stream.write(message);
      return clientStreamObj;
    },
    $catch: () => {throw new Error('Unary Call: .catch and .on must be defined before .send')},
    catch: (first) => {
      if (typeof first !== 'function') {
        throw new Error('Unary Call: catch takes a callback')
      }
      clientStreamObj.$catch = first;
      return clientStreamObj;
    },
    $on: () => {throw new Error('Client Stream Call: .catch and .on must be defined before .send')},
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
      clientStreamObj.$on = listenerCallback;
      return clientStreamObj;
    }
  };
  return clientStreamObj;
};
