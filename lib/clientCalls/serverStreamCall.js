const generateMeta = require("../utils/generateMeta");

module.exports = function serverStreamCall(that, methodName, first, second) {
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
  let listener = {
    on: (first, second) => setTimeout((first, second) => {
      let listenerCallback;
      if (typeof first !== 'function' && typeof second !== 'function') {
        throw new Error('Server Stream: on takes a callback')
      };
      if (typeof first === 'function') {
        listenerCallback = first;
      } else {
        listenerCallback = second;
      }
      switch (first) {
        case 'status': 
          listener.on('status', second);
          break;
        case 'metadata': 
          listener.on('metadata', second);
          break;
        case 'error': 
          listener.on('error', second);
          break;
        default: 
          listener.on('data', listenerCallback);
        }
    }, 0),
    catch: (first) => setTimeout(() => {
      if (typeof first !== 'function') {
        throw new Error('Server Stream: catch takes a callback')
      }
      listener.on('error', first);
    }, 0),
  }
  const serverStreamObj = {
    write: function(...args) {
      return this.send(...args)
    },
    send: function(message){
      listener = that[methodName](message, metadata, interceptors);
      return serverStreamObj;
    },
    catch: function(first){
      if (typeof first !== 'function') {
        throw new Error('Server Stream: catch takes a callback')
      }
      listener.on('error', first);
      return serverStreamObj;
    },
    on: function(first, second){
      let listenerCallback;
      if (typeof first !== 'function' && typeof second !== 'function') {
        throw new Error('Server Stream: on takes a callback')
      };
      if (typeof first === 'function') {
        listenerCallback = first;
      } else {
        listenerCallback = second;
      };
      switch (first) {
        case 'status': 
          listener.on('status', second);
          break;
        case 'metadata': 
          listener.on('metadata', second);
          break;
        case 'error': 
          listener.on('error', second);
          break;
        default: 
          listener.on('data', listenerCallback);
        }
      return serverStreamObj;
    }
  };
  return serverStreamObj;
};
