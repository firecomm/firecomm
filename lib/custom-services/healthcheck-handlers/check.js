module.exports = function(call) {
  console.log(call);
  const { services: requestedServices } = call.body;
  const healthArray = [];
  if (!requestedServices.length) {
    const statusMap = this.getStatus();
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
    const curStatus = this.getStatus(requestedServices[i]);
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
  // return health array
};
