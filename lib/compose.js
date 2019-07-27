const generateUnaryCall = require("./callFactories/generateUnaryCall");
const generateClientStreamCall = require("./callFactories/generateClientStreamCall");
const generateServerStreamCall = require("./callFactories/generateServerStreamCall");
const generateDuplex = require("./callFactories/generateDuplex");
const getMethodType = require("./utils/getMethodType");

module.exports = function compose(
  { handler, middlewareStack },
  serviceDefinition,
  uncaughtErrorHandler
) {
  // console.log({ middlewareStack }, { handler });
  // console.log(Object.keys(serviceDefinition));
  // define what type of function this one is...
  const upperCasedName = handler[0].toUpperCase() + handler.substring(1);
  let methodDefinition = serviceDefinition[upperCasedName];
  if (methodDefinition === undefined) {
    throw new Error(`RPC method not defined in proto: ${handler}`);
  }
  const methodType = getMethodType(methodDefinition);

  // console.log(methodType) ~=  [ 'unaryChat', 'serverStream', 'clientStream', 'bidiChat' ]

  switch (methodType) {
    case "Duplex":
      // class Context {}
      return async function(call) {
        let duplexCall = generateDuplex(call);
        for (let i = 0; i < middlewareStack.length; i++) {
          try {
            await middlewareStack[i](duplexCall);
          } catch (err) {
            if (uncaughtErrorHandler) {
              uncaughtErrorHandler(err, duplexCall);
            } else {
              console.log(
                "Error inside of call, to handle uncaught errors, input an (err, call) callback into the fourth parameter of addService method.\n\n",
                "Error:\n\n",
                err,
                "Call:\n\n",
                call
              );
            }
          }
        }
      };
    case "ClientStream":
      // class Context {}
      return async function(call, callback) {
        // console.log("inside of client stream compose", { call }, { callback });
        let clientStreamCall = generateClientStreamCall(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          try {
            await middlewareStack[i](clientStreamCall);
          } catch (err) {
            if (uncaughtErrorHandler) {
              uncaughtErrorHandler(err, clientStreamCall);
            } else {
              console.log(
                "Error inside of call, to handle uncaught errors, input an (err, call) callback into the fourth parameter of addService method.\n\n",
                "Error:\n\n",
                err,
                "Call:\n\n",
                call
              );
            }
          }
        }
      };
    case "ServerStream":
      // class Context {}
      return async function(call) {
        let serverStreamCall = generateServerStreamCall(call);
        for (let i = 0; i < middlewareStack.length; i++) {
          try {
            await middlewareStack[i](serverStreamCall);
          } catch (err) {
            if (uncaughtErrorHandler) {
              uncaughtErrorHandler(err, serverStreamCall);
            } else {
              console.log(
                "Error inside of call, to handle uncaught errors, input an (err, call) callback into the fourth parameter of addService method.\n\n",
                "Error:\n\n",
                err,
                "Call:\n\n",
                call
              );
            }
          }
        }
      };
    case "Unary":
      return async function(call, callback) {
        console.log("call:", call);
        let unaryCall = generateUnaryCall(call, callback);
        for (let i = 0; i < middlewareStack.length; i++) {
          try {
            await middlewareStack[i](unaryCall);
          } catch (err) {
            if (uncaughtErrorHandler) {
              uncaughtErrorHandler(err, unaryCall);
            } else {
              console.log(
                "Error inside of call, to handle uncaught errors, input an (err, call) callback into the fourth parameter of addService method.\n\n",
                "Error:\n\n",
                err,
                "Call:\n\n",
                call
              );
            }
          }
        }
      };
    // function() {
    //   throw new Error("unhandled");
    // };
    default:
      return;
  }
};

// needs to know exactly what type of thing we are passing in...

// need a method that will take each call and pass it to each of them...

// also at any time need to be able to throw the proper errors...

// Takes in an object of a variety of

// array of middleware
// first it has to understand what types of middleware we are passing in... is
// it unary call or not?
// {
//   unaryCallName: [middleware, handler];
// }
// take in the array or function they passed
// return the wrapped handler
// we would compose each rpc method, and add service where the method names map
// to our wrapper functions
// compose ()
// compose needs to be aware of the type of call, because the wrapped function
// will provide a different object as context, depending on the call type
// we will have access to the name of the rpc method (camelcased)
// find the rpc method in the proto package, access it's call type (not
// camelcased)
// proto package
