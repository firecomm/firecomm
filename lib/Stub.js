const grpc = require("grpc");
const fs = require("fs");

const generateMeta = require("./utils/generateMeta");

const getMethodType = require("./utils/getMethodType");

///////////////////////////////////////////////////////////////////////////////
// Firecomm custom implementation of Stub
module.exports = function Stub(serviceDefinition, port, config) {
  class Stub extends serviceDefinition {
    constructor(port, securitySettings) {
      super(port, securitySettings);

      // serviceDefinition is from routeGuide
      this.serviceDefinition = serviceDefinition;

      // methods would look something like this: [ 'UnaryChat', 'ServerStream',
      // 'ClientStream', 'BidiChat' ]
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
      // console.log({methodName});
      // console.log({serviceDef: this.serviceDefinition});
      const method = this.serviceDefinition.service[methodName];

      // getMethodType will find which type of session connection -> Duplex /
      // ClientStream / ServerStream / Unary
      const methodType = getMethodType(method);

      const lowerCaseName =
        methodName[0].toLowerCase() + methodName.substring(1);

      if (methodType === "Unary") {
        // 'message' could be *any* kind of data that fits the *.proto file
        // configuation
        this[lowerCaseName] = function(
          message,
          interceptors,
          metaObject,
          callback
        ) {
          const that = this;
          const metadata = generateMeta(metaObject);
          if (callback === undefined) {
            return new Promise((resolve, reject) => {
              that[methodName](
                message,
                metadata,
                interceptors,
                (err, response) => {
                  if (err) {
                    reject(err);
                  }
                  resolve(response);
                }
              );
            });
          } else {
            that[methodName](message, metadata, interceptors, callback);
          }
        };
      } else if (methodType === "ClientStream") {
        this[lowerCaseName] = function(metaObject, interceptorArray, callback) {
          if (typeof metaObject === "function") {
            // if first argument is a function, treat it as a callback
            return this[methodName](undefined, undefined, metaObject);
          } else if (
            typeof metaObject === "object" &&
            !Array.isArray(metaObject) &&
            typeof interceptorArray === "function"
          ) {
            const metadata = generateMeta(metaObject);
            return this[methodName](metadata, undefined, interceptorArray);
          } else if (
            typeof metaObject === "object" &&
            Array.isArray(metaObject) &&
            typeof interceptorArray === "function"
          ) {
            const interceptors = { interceptors: interceptorArray };
            return this[methodName](undefined, interceptors, callback);
          }
          const metadata = generateMeta(metaObject);
          const interceptors = { interceptors: interceptorArray };
          return this[methodName](metadata, interceptors, callback);
        };
      } else if (methodType === "ServerStream") {
        this[lowerCaseName] = function(message, metaObject, interceptorArray) {
          const metadata = generateMeta(metaObject);
          const interceptors = { interceptors: interceptorArray };
          return this[methodName](message, metadata, interceptors);
        };
      } else if (methodType === "Duplex") {
        // console.log({methodName});
        this[lowerCaseName] = function(metaObject, interceptorArray) {
          const metadata = generateMeta(metaObject);
          const interceptors = { interceptors: interceptorArray };
          return this[methodName](metadata, interceptors);
        };
      } else {
        throw new Error("Method type undefined.");
      }
    }
  }

  /////////////////////////////////////////////////////////////////////
  // we configure if the stub/client will be using an SSL connection or not
  if (config === undefined) {
    return new Stub(port, grpc.credentials.createInsecure());
  } else {
    // read the cert file
    const { certificate: unreadCertificate } = config;
    const readCertificate = fs.readFileSync(unreadCertificate);
    return new Stub(port, grpc.credentials.createSsl(readCertificate));
  }
};
