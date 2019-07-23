const grpc = require('grpc');

module.exports = class Stub {
  constructor(serviceDefinition) {
    if (!Object.keys(serviceDefinition.hasOwnProperty('service'))) {
      throw new Error(
          'Argument to constructor must be a proto-loaded service definition Object.')
    }
    this.serviceDefinition = serviceDefinition;
  }

  openChannel(port, config) {
    if (config === undefined) {
      this.stub =
          new this.serviceDefinition(port, grpc.credentials.createInsecure());
    }

    console.log(this.stub)
    console.log(Object.keys(this.serviceDefinition.service))
  }

  //go through each rpc method and recreate it's implementations on the client side...

  // implementations...
  //server unary, server stream, client unary, client stream... 
};
