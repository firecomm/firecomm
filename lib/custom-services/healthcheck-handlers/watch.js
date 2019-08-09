// check status will take in the server object, so it has a reference and can continually check the status, and return an updated Health object to send back to client

// if no services provided, returns whole status map in the format of the proto file
// this is 


// NOTE the check status function is basically the handler for Check.js as you already noted
function checkStatus(Server, call, services) {}

module.exports = function(call) {
  // call.body will have this structure:
  // {
  // interval: number
  // services: []
  // }
  console.log(call.body);
  console.log("this inside of check", this);

  // destructure services and interval off of the call

  // if interval is 0, set it to be 60seconds for a default

  // set a const "server" to be the value of this (this is currently the server, so you have access to the get status properties) to store in the closure

  // setInterval at "interval seconds"
  // run checkStatus to checkStatus calling on server and the services destructured off of call
  // add logic to .throw
};
