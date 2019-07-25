const {Stub} = require('../index');
const grpc = require('grpc');


// assign method... properly gets the method names...

// successfully promisifies a unary


describe('Unit tests for Stub', () => {

  xit('Should extend a service definition', () => {
    class mockServiceDef {
      constructor(port, credentials) {}
    }
    mockServiceDef.service = {
      HandlerName: {requestStream: true, responseStream: false}
    };

    const mockPort = '0.0.0.0:3000';
    const stub = Stub(mockServiceDef, mockPort);
    expect(stub instanceof mockServiceDef).toBeTruthy();
  });

  xit('Adds a method to stub matching the method handler name on service definition.',
      () => {
        class mockServiceDef {
          constructor(port, credentials) {}
        }
        mockServiceDef.service = {
          HandlerName: {requestStream: true, responseStream: false}
        };

        const mockPort = '0.0.0.0:3000';
        const stub = Stub(mockServiceDef, mockPort);

        expect(typeof stub.handlerName).toBe('function')
      })

  xit('Promisifies Unary.', () => {

    class mockServiceDef {
      constructor(port, credentials) {}
    }
    mockServiceDef.service = {
      HandlerName: {requestStream: false, responseStream: false}
    };

    const mockPort = '0.0.0.0:3000';
    const stub = Stub(mockServiceDef, mockPort);
    console.log(stub.handlerName() instanceof Promise);

  });

  it('Wraps Duplex.', () => {
    class mockServiceDef {
      constructor(port, credentials) {
        this.HandlerName = jest.fn(x => console.log(x));
        this.HandlerName.requestStream = true;
        this.HandlerName.responseStream = true;
      }
    };

    const HandlerName = jest.fn(x => console.log(x));
    HandlerName.requestStream = true;
    HandlerName.responseStream = true;

    mockServiceDef.service = {HandlerName};

    const mockPort = '0.0.0.0:3000';
    const stub = Stub(mockServiceDef, mockPort);
  });

  xit('Wraps ClientStream.',
      () => {

      });

  xit('Wraps ServerStream',
      () => {

      });


})