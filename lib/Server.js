const grpc = require('grpc');
const compose = require('./compose');
const fs = require('fs');

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
  addService(serviceDefinition, handlerObject, serviceMiddleware) {
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
      const middlewareStack = handlerObject[keys[i]];
      if (serviceMiddleware) {
        if (Array.isArray(serviceMiddleware)) {
          middlewareStack = serviceMiddleware.concat(middlewareStack);
        } else {
          middlewareStack = [serviceMiddlewate].concat(middlewareStack);
        }
      } else {
        if (typeof middlewareStack === 'function') {
          middlewareStack = [middlewareStack];
        }
      }
      handlers[keys[i]] = compose({handler: keys[i], middlewareStack}, service);
    }
    console.log('handlers:', handlers);
    this.server.addService(service, handlers);
  }

  /**
   * For the config file, please adhere to the correct name-properties
   * { private_key: String, certificate: String }
   *      Both strings must be PATHs of the file
   *      The certificate MUST be SIGNED
   * @param {Array } PORT
   * @param {Object} config
   */
  // bind(PORT, config = null) {
  //   // Future: support an array of ports or unlimited args
  //   let ports;
  //   if (!Array.isArray(PORT)) {
  //     ports = [PORT];
  //   } else {
  //     ports = PORT;
  //     }
  //   for (let i = 0; i < ports.length; i++) {
  //     if (config === null) {
  //       this.server.bind(ports[i], grpc.ServerCredentials.createInsecure());
  //     }
  //     else {
  //       const {before_private_key, certificate: unreadCertificate} = config;

  //       console.log(before_private_key, '////////////////////',
  //       unreadCertificate)
  //       let certificate = fs.readFileSync(unreadCertificate);
  //       let privateKey = fs.readFileSync(before_private_key);
  //       let listOfObjects = [ {private_key: privateKey, cert_chain:
  //       certificate} ];

  //       this.server.bind(ports[i],
  //       grpc.ServerCredentials.createSsl(certificate, listOfObjects));

  //     }
  //   }
  // }

  bind(PORT, config) {
    // Future: support an array of ports or unlimited args
    let ports = new Array();
    if (!Array.isArray(PORT)) {
      ports.push(PORT);
      }
    else {
      // going to assume its not an object and is in fact an array
      PORT.forEach(e => ports.push(e));
    }
    console.log(PORT, '*************** Port: *******   ', ports)

        for (let i = 0; i < ports.length; i++) {
      if (!config) {
        this.server.bind(ports[i], grpc.ServerCredentials.createInsecure());
        }
      else {
        const {before_private_key, certificate: unreadCertificate} = config;

        console.log(
            before_private_key, '////////////////////', unreadCertificate)

            let certificate = fs.readFileSync(unreadCertificate);
        let privateKey = fs.readFileSync(before_private_key);
        let listOfObjects =
            [{private_key: privateKey, cert_chain: certificate}];

        this.server.bind(
            ports[i],
            grpc.ServerCredentials.createSsl(certificate, listOfObjects));
      }
    }
  }

  start() {
    this.server.start();
  }
};
