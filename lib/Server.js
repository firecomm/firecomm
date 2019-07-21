const grpc = require('grpc');
const compose = require('./compose');

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
    if (serviceDefinition.hasOwnProperty('service')) {
      service = serviceDefinition.service;
    } else {
      service = serviceDefinition;
      }
    const handlers = {...handlerObject};
    const keys = Object.keys(handlerObject);
    for (let i = 0; i < keys.length; i++) {
      handlers[keys[i]] = compose(
          {handler: keys[i], middlewareStack: handlerObject[keys[i]]}, service);
    }
    console.log('handlers:', handlers);
    this.server.addService(service, handlers);
  }


  bind(PORT, config = {secure: false}) {
    // Future: support an array of ports or unlimited args
    if (config.secure === false) {
      this.server.bind(PORT, grpc.ServerCredentials.createInsecure());
    }
  }

  start() {
    this.server.start();
  }
};
