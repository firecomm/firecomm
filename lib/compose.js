module.exports = function compose(middlewareStack, serviceDefinition) {
  console.log({ middlewareStack });
  if (typeof middlewareStack === "function") {
    return middlewareStack;
  }
  return async function() {};
};

//needs to know exactly what type of thing we are passing in...

//need a method that will take each call and pass it to each of them...

// also at any time need to be able to throw the proper errors...

// Takes in an object of a variety of

// array of middleware
//first it has to understand what types of middleware we are passing in... is it unary call or not?
// {
//   unaryCallName: [middleware, handler];
// }
// take in the array or function they passed
// return the wrapped handler
// we would compose each rpc method, and add service where the method names map to our wrapper functions
// compose ()
// compose needs to be aware of the type of call, because the wrapped function will provide a different object as context, depending on the call type
// we will have access to the name of the rpc method (camelcased)
// find the rpc method in the proto package, access it's call type (not camelcased)
// proto package
