const {Server} = require('../index');
const grpc = require('grpc');

// Mock the grpc server implementation

// const MockServer = require('./mocks/Server')
// jest.mock('./mocks/Server.js');

// console.log(new MockServer)

// console.log({MockServer});

// console.log(MockServer.mockImplementation());

describe('Unit tests for Server', () => {

  it('Constructor extends the grpc server class.', () => {
    const server = new Server();
    expect(server instanceof grpc.Server).toBeTruthy();
  });


  it('Server bind throws an error when you pass in an object as a port.',
     () => {
       expect(() => {
         const server = new Server();
         server.bind({port: '0.0.0.0:3000'});
       }).toThrow();
     });

  xit('Add service connects services to the server.',
      () => {

      });
});