const {Server} = require('../index');
const grpc = require('grpc');

// Mock the grpc server implementation

const mockServer = jest.mock('./mocks/Server.js');

describe('Unit tests for Server', () => {

  xit('Constructor extends the server class', () => {
    const server = new Server();
    expect(server instanceof grpc.Server).toBeTruthy();
  })


  it('Server bind throws an error when you pass in an object as a port.',
     () => {
       expect(() => {
         const server = new Server();
         server.bind({port: '0.0.0.0:3000'});
       }).toThrow();
     });
  xit('Is an extension of the grpc server class.',
      () => {

      })

  xit('Add service connects services to the server.',
      () => {

      })

  xit('',
      () => {

      })

});