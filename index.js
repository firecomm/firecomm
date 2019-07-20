const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

class Server {
  constructor(PROTO_PATH, Service) {
    this.server = new grpc.Server();
    this.server.
  }

  addService(serviceDefinition, methodHandlers) {


    this.server.addService(serviceDefinition, compose(methodHandlers));
  }

  start(
    PORT,
    config = {
      secure: false
    }
  ) {
    if (config.secure === false) {
      this.server.bind(PORT, grpc.ServerCredentials.createInsecure());
    }
    this.server.start();
  }
}

function compose(serviceDefinition) {
  
  //composes and returns an object of the "proper middleware for each"
  return config

}

function composeMiddleware() {
  // array of middleware
  //first it has to understand what types of middleware we are passing in... is it unary call or not?

  ctx = 
}

function () {

}

//needs to know exactly what type of thing we are passing in...

//need a method that will take each call and pass it to each of them...

// also at any time need to be able to throw the proper errors...
