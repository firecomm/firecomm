const {Stub} = require('../index');
const grpc = require('grpc');



describe('Unit tests for Stub', () => {

  class mockServiceDef{
    constructor(port, credentials) {
      this.service = {key: 'key'};
    }
  }

  it('Should extend a service definition',
     () => {
       console.log('mockServiceDef', mockServiceDef);
       const mockPort = '0.0.0.0:3000';
       const stub = Stub(mockServiceDef, mockPort);
       expect(stub instanceof mockServiceDef).toBeTruthy()
     })


})