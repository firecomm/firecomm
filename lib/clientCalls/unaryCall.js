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

module.exports = function unaryCall(that, methodName, ...args) {
  if (typeof args[0] !== "object") {
    throw new Error("First parameter required and must be of type: Message.");
  }
  let message = args[0];
  let interceptors = undefined;
  let metadata = undefined;
  let callback = undefined;
  let promise = true;
  args = args.filter(arg => args !== undefined);
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
