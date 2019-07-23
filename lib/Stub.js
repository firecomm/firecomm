const grpc = require('grpc');

const getMethodType = require('./utils/getMethodType');

const {Promisify} = require('./clientMethods')

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

    const methods = Object.keys(this.serviceDefinition.service);
    for (let i = 0; i < methods.length; i++) {
      this.assignMethod(methods[i]);
    }
  }

  assignMethod(methodName) {
    const method = this.serviceDefinition.service[methodName];
    const methodType = getMethodType(method);
    const lowerCaseName = methodName[0].toLowerCase() + methodName.substring(1);
    // this[lowerCaseName] = this.stub[methodName].bind(this.stub);
    if (methodType === 'ServerStream' || methodType === 'Unary') {
      this[lowerCaseName] = function(message, interceptors) {
        const that = this.stub;
        console.log('inside of stub method that returns a promise');
        return new Promise((resolve, reject) => {
          that[methodName](message, interceptors, (err, response) => {
            console.log('inside of unary callback', {err}, {response});
            if (err) {
              reject(err);
            }
            resolve(response);
          });
        });
      }
      }
    else {
      this[lowerCaseName] = this.stub[methodName].bind(this.stub);
    }
    // switch (methodType) {
    //   case 'Unary':
    //     this[methodName] = new UnaryMethod
    //     return;
    //   default:
    //     return;
    // }
  }

  // go through each rpc method and recreate it's implementations on the client
  // side...

  // implementations...
  // server unary, server stream, client unary, client stream...
};
