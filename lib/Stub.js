const grpc = require('grpc');

const getMethodType = require('./utils/getMethodType');

const {Promisify} = require('./clientMethods');

module.exports = function Stub(serviceDefinition, port, config) {
  class Stub extends serviceDefinition {
    constructor(port, securitySettings) {
      super(port, securitySettings);
      this.serviceDefinition = serviceDefinition;
      const methods = Object.keys(this.serviceDefinition.service);
      for (let i = 0; i < methods.length; i++) {
        this.assignMethod(methods[i]);
      }
    }

    assignMethod(methodName) {
      const method = this.serviceDefinition.service[methodName];
      const methodType = getMethodType(method);
      const lowerCaseName =
          methodName[0].toLowerCase() + methodName.substring(1);
      if (methodType === 'Unary') {
        this[lowerCaseName] = function(message, interceptors) {
          const that = this;
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
    }
  };
  if (config === undefined) {
    return new Stub(port, grpc.credentials.createInsecure());
  };
}
