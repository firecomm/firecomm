const {Stub} = require('../index');
const grpc = require('grpc');


// assign method... properly gets the method names...

// successfully promisifies a unary


describe('Unit tests for Stub', () => {



  it('Should extend a service definition', () => {
    class mockServiceDef {
      constructor(port, credentials) {}
    }
    mockServiceDef.service = {
      HandlerName: {requestStream: true, responseStream: false}
    };

    const mockPort = '0.0.0.0:3000';
    const stub = Stub(mockServiceDef, mockPort);
    console.log(stub.constructor)
    expect(stub instanceof mockServiceDef).toBeTruthy();
  });

  it('Adds a method to stub matching the method handler name on service definition.',
     () => {
       class mockServiceDef {
         constructor(port, credentials) {
           this.service = {
             HandlerName: {requestStream: true, responseStream: false}
           };
         }
         }

       const mockPort = '0.0.0.0:3000';
       const stub = Stub(mockServiceDef, mockPort);

       console.log({stub})
       expect(typeof stub.handlerName).toBe('function')
     })

  it('Promisifies Unary.', () => {

    class mockServiceDef {
      constructor(port, credentials) {
        this.service = {
          HandlerName: {requestStream: false, responseStream: false}
        };
      }
      }

    const mockPort = '0.0.0.0:3000';
    const stub = Stub(mockServiceDef, mockPort);

    expect(stub.handlerName() instanceof Promise).toBeTruthy();

  });

  it('Wraps Duplex.',
     () => {

     });

  it('Wraps ClientStream.',
     () => {

     });

  it('Wraps ServerStream',
     () => {

     });


})