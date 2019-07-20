const grpc = require("grpc");
const compose = require("./compose");

module.exports = class Server {
  constructor() {
    this.server = new grpc.Server();
  }
  /**
   *
   * Function will allow users to input their handlers along with a
   * variety of middleware functions... if they input in a service model,
   * that will work... but if they do not, it will not either
   *
   * @param {String} serviceName
   * @param {Object} methodHandlers
   */
  addService(serviceDefinition, handlerObject) {
    // check and see if they are inputting Service.service or Service
    let service;
    if (serviceDefinition.hasOwnProperty("service")) {
      service = serviceDefinition.service;
    } else {
      service = serviceDefinition;
    }
    const handlers = {};
    const keys = Object.keys(handlerObject);
    for (let i = 0; i < keys.length; i++) {
      handlers[keys[i]] = compose(
        {
          handler: keys[i],
          middlewareStack: handlerObject[keys[i]]
        },
        service
      );
    }
    this.server.addService(service, handlers);
  }

  start(
    PORT,
    config = {
      secure: false
    }
  ) {
    if (PORT === undefined) {
      PORT = "0.0.0.0:3000";
    }
    if (config.secure === false) {
      this.server.bind(PORT, grpc.ServerCredentials.createInsecure());
    }
    this.server.start();
  }
};
