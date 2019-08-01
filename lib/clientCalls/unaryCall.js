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

function unaryCall(that, methodName, ...args) {
  // message interceptors, meta, callback
  while (args[args.length - 1] === undefined) {
    args.pop();
  }
  const argsCopy = [...args];
  // console.log("that inside of unaryCall", that.__proto__.__proto__);
  // console.log(methodName);
  if (typeof args[0] !== "object") {
    throw new Error("First parameter required and must be of type: Message.");
  }
  if (args.length === 4) {
    //call them all
    that[methodName](...args);
  } else if (args.length === 3) {
    // missing interceptors,
    if (typeof args[1] === "object" && !Array.isArray(args[1])) {
      // change metadata
      argsCopy[1] = generateMeta(args[1]);
      return new Promise((resolve, reject) => {
        that[methodName](...argsCopy, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
      // missing metadata
    } else if (typeof args[2] === "function") {
      argsCopy[1] = { interceptors: args[1] };
      that[methodName](...argsCopy);
    } else {
      return new Promise((resolve, reject) => {
        that[methodName](...argsCopy, undefined, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    }
    // missing callback
  } else if (args.length === 2) {
    // have interceptors
    if (Array.isArray(typeof args[1])) {
      argsCopy[1] = { interceptors: args[1] };
      //promise version
      return new Promise((resolve, reject) => {
        that[methodName](...argsCopy, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    } else if (typeof args[1] === "object") {
      //promise version
      argsCopy[1] = generateMeta(args[1]);
      return new Promise((resolve, reject) => {
        that[methodName](...argsCopy, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    } else {
      that[methodName](...argsCopy);
    }
    // have metadata
    //have callback
  } else {
    //promise version
    return new Promise((resolve, reject) => {
      console.log(that, methodName);
      console.log(typeof that[methodName]);
      console.log(...argsCopy);
      that[methodName](...argsCopy, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}
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
