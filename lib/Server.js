const grpc = require("grpc");
const fs = require("fs");

// compose basically takes in an argument ( {handler: arrayOfKeys,
// middlewareStack: handlerObject[arrayOfKeys[i]]}, service )
// -> finds which method is being currently used -> runs middleware-like
// functionality
const compose = require("./compose");

///////////////////////////////////////////////////////////////////////////////
// Firecomm custom implementation of Server
module.exports = class Server extends grpc.Server {
  constructor(uncaughtErrorHandler) {
    super();
    this.uncaughtErrorHandler = uncaughtErrorHandler;
    // this.server = new grpc.Server();
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
    // serviceDefinition is from routeGuide
    // checking to see if they are inputting Service.service or Service
    let service;
    if (serviceDefinition.hasOwnProperty("service")) {
      service = serviceDefinition.service;
    } else {
      service = serviceDefinition;
    }

    // handlerObject ~= { unaryChat: [waitFor, unaryChat], serverStream,
    // clientStream, bidiChat }
    // handlers ~=   { unaryChat: [ [Function], [Function: unaryChat] ],
    //   serverStream: [Function: serverStream],
    //   clientStream: [Function: clientStream],
    //   bidiChat: [Function: bidiChat] }
    // keys ~= [ 'unaryChat', 'serverStream', 'clientStream', 'bidiChat' ]
    const handlers = { ...handlerObject };
    const keys = Object.keys(handlerObject);

    for (let i = 0; i < keys.length; i++) {
      let middlewareStack = handlerObject[keys[i]];
      if (serviceMiddleware) {
        if (Array.isArray(serviceMiddleware)) {
          middlewareStack = serviceMiddleware.concat(middlewareStack);
        } else {
          middlewareStack = [serviceMiddleware].concat(middlewareStack);
        }
      } else {
        if (typeof middlewareStack === "function") {
          middlewareStack = [middlewareStack];
        }
      }
      console.log("this inside of addService", this);
      handlers[keys[i]] = compose(
        { handler: keys[i], middlewareStack },
        service,
        this.uncaughtErrorHandler
      );
    }
    // console.log('handlers:', handlers);
    super.addService(service, handlers);
    // console.log(this instanceof grpc.Server)
  }

  /**
   * For the config file, please adhere to the correct name-properties
   * { private_key: String, certificate: String }
   *      Both strings must be PATHs of the file
   *      The certificate MUST be SIGNED
   * @param {Array } PORT
   * @param {Object} config
   */

  //////////////////////////////////////////////////////
  // multiple channels / SSL support here
  // concept: if there is one port -> one open channel
  //          else if there are multiple ports, iterate and open mutiple
  //          channels
  // PORT === 0.0.0.0:3000
  //  // PORT is not the best name. Its actually a *socket*. Socket = Port + IP
  //  Address
  bind(PORT, config) {
    if (!Array.isArray(PORT) && typeof PORT !== "string") {
      throw new Error("PORT must be a string or array of strings.");
    }
    // Future: support an array of ports or unlimited args
    let ports = new Array();
    if (!Array.isArray(PORT)) {
      ports.push(PORT);
    } else {
      // going to assume its not an object and is in fact an array
      PORT.forEach(e => ports.push(e));
    }

    for (let i = 0; i < ports.length; i++) {
      // if config does not exist, create an Insecure server
      // else, take the contents of config (certificate and private key) and
      // apply them to create an encrypted connection
      if (!config) {
        super.bind(ports[i], grpc.ServerCredentials.createInsecure());
      } else {
        // we are deconstructing keys here that have the PATH value to the file
        const { before_private_key, certificate: unreadCertificate } = config;

        // console.log(
        //   before_private_key,
        //   "////////////////////",
        //   unreadCertificate
        // );

        // creating buffer data types here
        let certificate = fs.readFileSync(unreadCertificate);
        let privateKey = fs.readFileSync(before_private_key);

        // create an array which is "A list of private key and certificate chain
        // pairs to be used for authenticating the server"
        let listOfObjects = [
          { private_key: privateKey, cert_chain: certificate }
        ];

        super.bind(
          ports[i],
          grpc.ServerCredentials.createSsl(certificate, listOfObjects)
        );
      }
    }
  }

  // Take a guess?
  start() {
    super.start();
  }
  // It starts the server (:
};
