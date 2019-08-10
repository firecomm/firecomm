const generateMeta = require("../utils/generateMeta");

// (metaObject, interceptorArray, callback)

module.exports = function clientStreamCall(that, methodName, first, second) {
  let metadata = null;
  let interceptors = null;
  let callback = function(err, res) {
    if (err) clientStreamObj.$catch(err);
    clientStreamObj.$on(res);
    return clientStreamObj;
  };
  if (typeof first === "object") {
    if (Array.isArray(first)) {
      interceptors = { interceptors: first };
    } else {
      metadata = generateMeta(first);
    }
  }
  if (typeof second === "object") {
    if (Array.isArray(second)) {
      interceptors = { interceptors: second };
    } else {
      metadata = generateMeta(second);
    }
  }
  let sender = that[methodName](metadata, interceptors, callback);
  const clientStreamObj = {
    retry: function(metadata, interceptors) {
      clientStreamObj.$on
      sender = that[methodName](metadata, interceptors, callback);
      return clientStreamObj;
    },
    send: function(message, flags, flushCallback) {
      lastMessage = { message, flags, flushCallback };
      sender.write(message, flags, flushCallback);
      return clientStreamObj;
    },
    $catch: function() {
      throw new Error(
        "Client Stream: .catch and .on must be defined to .send"
      );
    },
    catch: function(first) {
      if (typeof first !== "function") {
        throw new Error("Client Stream: catch takes a callback");
      }
      clientStreamObj.$catch = first;
      return clientStreamObj;
    },
    $on: () => {
      throw new Error(
        "Client Stream: .catch and .on must be invoked to .send"
      );
    },
    on: function(first, second) {
      let listenerCallback;
      if (typeof first !== "function" && typeof second !== "function") {
        throw new Error("Client Stream: on takes a callback");
      }
      if (typeof first === "function") {
        listenerCallback = first;
      } else {
        listenerCallback = second;
      }
      clientStreamObj.$on = listenerCallback;
      return clientStreamObj;
    }
  };
  // callback = function(err, res) {
  //   if (err) clientStreamObj.$catch(err);
  //   clientStreamObj.$on(res);
  //   return clientStreamObj;
  // };
  return clientStreamObj;
};
