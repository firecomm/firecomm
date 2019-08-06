const generateMeta = require("../utils/generateMeta");

//create an object that extends the original call, redefine it's actual reference to be the following...

// create a function that takes in a interceptors and metadata
// returns an object with the following methods...

// catch --> connects and calls on error
// sets the catch function

// on --> receives a string "data" and a callback
//sets the onFunction for the object
// if function received as first param, also works...
// invokes callback on the data when it comes back

// send --> receives a message...
// if there is no "catch" or "on" throws an error OR
//(err,res)=>{console.log('warning, no catch or on clalback supplied for response.)}
// otherwise, calls the method, passing in interceptors, metadata, and message
// function(err,res) =>{
//   if(err) this.catchFun(err)
//   return this.onFun(res)
// }

//throw which will console.log(no throw on unary calls...)

module.exports = function unaryCall(that, methodName, first /*real*/, second /*real*/) {
  let message;
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
  const unaryObj = {
    that: this,
    send: (message) => {
      that[methodName](message, metadata, interceptors, callback);
    },
    catch: (first) => {
      if (typeof first !== 'function') {
        throw new Error('Unary Call: catch takes a callback')
      }
      unaryObj.$catch = first;
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
      unaryObj.$on = callback;
    }
  };
  let callback = function(err, res) {
    if(err) unaryObj.$catch(err);
    return unaryObj.$on(res);
  };
  return unaryObj;
}

// function unaryInner(that, methodName, ...args) {
//   if (typeof args[0] !== "object") {
//     throw new Error("First parameter required and must be of type: Message.");
//   }
//   let message = args[0];
//   let interceptors = undefined;
//   let metadata = undefined;
//   let callback = undefined;
//   args = args.filter(arg => args !== undefined);
//   for (let i = 1; i < args.length; i++) {
//     }
//   } else {
//     return that[methodName](message, metadata, interceptors, callback);
//   }
// };
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
