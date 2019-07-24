const grpc = require('grpc');
const fs = require('fs');

const getMethodType = require('./utils/getMethodType');

const {Promisify} = require('./clientMethods');

///////////////////////////////////////////////////////////////////////////////
// Firecomm custom implementation of Stub
module.exports = function Stub(serviceDefinition, port, config) {

  class Stub extends serviceDefinition {
    constructor(port, securitySettings) {
      super(port, securitySettings);

      // serviceDefinition is from routeGuide
      this.serviceDefinition = serviceDefinition;

      // methods would look something like this: [ 'UnaryChat', 'ServerStream', 'ClientStream', 'BidiChat' ]
      const methods = Object.keys(this.serviceDefinition.service);
      for (let i = 0; i < methods.length; i++) {
        this.assignMethod(methods[i]);
      }
    }

    /**
     * input should be a method name, such as:
     * 
     * Duplex / ClientStream / ServerStream / Unary
     * @param {*} methodName 
     */
    assignMethod(methodName) {
      const method = this.serviceDefinition.service[methodName];

      // getMethodType will find which type of session connection -> Duplex / ClientStream / ServerStream / Unary
      const methodType = getMethodType(method);
      
      const lowerCaseName =
          methodName[0].toLowerCase() + methodName.substring(1);

      if (methodType === 'Unary') {
        
        // 'message' could be *any* kind of data that fits the *.proto file configuation
        this[lowerCaseName] = function(message, interceptors) {
          const that = this;

          console.log('inside of stub method that returns a promise');
          return new Promise((resolve, reject) => {

            //that[methodName](data, middleware, callback)
              // and we are resolving (waiting until) the response
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

  /////////////////////////////////////////////////////////////////////
  // we configure if the stub/client will be using an SSL connection or not
  if (config === undefined) {
    return new Stub(port, grpc.credentials.createInsecure());
  } else {
    // read the cert file
    const {certificate: unreadCertificate} = config;
    const readCertificate = fs.readFileSync(unreadCertificate);
    return new Stub(port, grpc.credentials.createSsl(readCertificate));
  };
}
