// check status will take in the server object, so it has a reference and can continually check the status, and return an updated Health object to send back to client

// if no services provided, returns whole status map in the format of the proto file
// this is

// NOTE the check status function is basically the handler for Check.js as you already noted
function sendStatusUpdate(Server, call, requestedServices) {
  const healthArray = [];
  if (!requestedServices.length) {
    const statusMap = Server.getStatus();
    const services = Object.keys(statusMap);
    for (let i = 0; i < services.length; i++) {
      healthArray.push({
        service: services[i],
        status: statusMap[services[i]]
      });
    }
    return call.send({ health: healthArray });
  }
  // loop through statusMap append the ones in the services array
  for (let i = 0; i < requestedServices.length; i++) {
    const curStatus = Server.getStatus(requestedServices[i]);
    if (curStatus === null || curStatus === undefined) {
      return call.throw(
        new Error(
          "Requested a health check for service not in Server statusMap."
        )
      );
    }
    healthArray.push({
      service: requestedServices[i],
      status: curStatus
    });
  }
  return call.send({
    health: healthArray
  });
}

module.exports = function(call) {
  let { interval, services } = call.body;

  // if interval is 0, set it to be 60seconds for a default
  if (interval === 0) {
    interval = 60;
  }
  // multiply interval to be in ms
  interval *= 1000;

  // set a const "server" to be the value of this (this is currently the server, so you have access to the get status properties) to store in the closure
  const server = this;
  setInterval(() => {
    sendStatusUpdate(server, call, services);
  }, interval);

  // setInterval at "interval seconds"
  // run sendStatusUpdate to sendStatusUpdate calling on server and the services destructured off of call
  // add logic to .throw
};
