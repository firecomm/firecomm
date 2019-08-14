const grpc = require("grpc");
const fs = require("fs");

// "compose" is not an npm library
const compose = require("./compose");
/**
 * @class To run your service methods, you will need to create a gRPC server. Firecomm extends the native gRPC-node `Server` class, so any and all methods found on the native class are supported by Firecomm's class. The Firecomm `Server` class-instances have the following capabilities.
- Instantiate an arbitrary number secure and insecure sockets with `.bind()`
- Add your service definition and middleware functions with `.addService()`
- Fire up the server with `.start()`
- All other native gRPC `Server` class methods
* @example const { Server } = require( "firecomm" );
const server = new Server( ERROR_HANDLER );
 * @param {function} uncaughtErrorHandler Function that will handler * any errors thrown by a method handler, error handlers defined here,
 * will apply to errors thrown by handlers from all services added to
 * this server instance
 * @returns {Server} An instance of the `Server` class
 * @example const { Server } = require( "firecomm" );
const server = new Server(function( ERROR, CALL ) {
  if ( ERROR ) CALL.throw( ERROR );
});
 */
module.exports = class Server extends grpc.Server {
  constructor(/** @type {function} */ uncaughtErrorHandler) {
    super();
    this.uncaughtErrorHandler = uncaughtErrorHandler;
  }
  /**
   * Connects handlers and middleware functionality to your gRPC methods * as defined in your `.proto` file.
   * @example const { Server } = require( 'firecomm' );
   * const server = new Server();
   * server.addService( 
   * SERVICE, 
    RPC_METHODS_OBJECT, 
    SERVICE_MIDDLEWARE,
    ERROR_HANDLER 
  );
   * @param {Object} serviceDefinition Service as it is named on your `.proto` file. Is a property on the built package.
   * @param {Object} methodHandlers maps each `RPC_METHOD`	to its `HANDLER_FUNCTION` or `MIDDLEWARE_STACK`.
   * @param {function | []} serviceMiddleware Either a middleware function or an array of middleware functions that will add to the front of the middleware stack for every method in the service.
   * @param {function} uncaughtErrorHandler function that handles uncaught errors thrown in any of your service method handlers for this service, overwrites the `Server` level error handler if one has been specified
   * @example const { Server, build } = require( "firecomm" );

const package = build('./PROTO_PATH');

const middleware1 = (call) => {
  console.log(call.req.body);
}

const middleware2 = (call) => {
  console.log(call.meta);
}

const handler = (call) => {
  call.send({
    message: "hello world"
  })
}

const server = new Server();

server.addService( 
  package.serviceName, 
  { handlerName: [ middleware2, handler ] },
  middleware1,
  function( ERROR, CALL ) {
    if ( ERROR ) CALL.throw( ERROR );
  }
);
   */
  addService(
    /** @type {{}}} */ serviceDefinition,
    /** @type {{}} */ handlerObject,
    /** @type {(function | []} */ serviceMiddleware,
    /** @type {function} */ uncaughtErrorHandler
  ) {
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
      // define the error handler
      if (!uncaughtErrorHandler) {
        uncaughtErrorHandler = this.uncaughtErrorHandler;
      }
      handlers[keys[i]] = compose(
        { handler: keys[i], middlewareStack },
        service,
        uncaughtErrorHandler
      );
    }
    // console.log('handlers:', handlers);
    super.addService(service, handlers);
    // console.log(this instanceof grpc.Server)
  }

  /**
* Invoke this method to connect your server instance to a channel.
* Allowsfor the creation of secure and insecure channels.
* @param {string|[string]} PORT Socket in the form of 
* `IP`:`PORT`forFirecomm `Server` class to listen on.
* @param {{}=} [config] if no config is supplied, an insecure
* channelwill be created (no TLS handshake required and traffic * unencrypted, tocreate a secure connection, supply the paths to an RSA * private key and certificate
* @example const { Server } = require( "firecomm" );
const privateKey = require( "./certificate.crt" )
const certificate = require( "./private_key.key" )

const server = new Server();

server.bind( '0.0.0.0:3000', {certificate, privateKey } )

   */
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
    const boundPorts = [];

    for (let i = 0; i < ports.length; i++) {
      // if config does not exist, create an Insecure server
      // else, take the contents of config (certificate and private key) and
      // apply them to create an encrypted connection
      if (!config) {
        boundPorts.push(
          super.bind(ports[i], grpc.ServerCredentials.createInsecure())
        );
      } else {
        // we are deconstructing keys here that have the PATH value to the file
        const { before_private_key, certificate: unreadCertificate } = config;
        // creating buffer data types here
        let certificate = fs.readFileSync(unreadCertificate);
        let privateKey = fs.readFileSync(privateKey);

        // create an array which is "A list of private key and certificate chain
        // pairs to be used for authenticating the server"
        let listOfObjects = [
          { private_key: privateKey, cert_chain: certificate }
        ];

        boundPorts.push(
          super.bind(
            ports[i],
            grpc.ServerCredentials.createSsl(certificate, listOfObjects)
          )
        );
      }
    }
    return boundPorts;
  }

  /**
   * Starts your server instance.
   */
  start() {
    super.start();
  }
};
