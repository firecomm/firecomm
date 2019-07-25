const {Server} = require('../index');
const grpc = require('grpc');

describe('Unit tests for Server', () => {
  it('Server Constructor throws an error when you pass in an object as a port.',
     () => {
       expect(() => {
         const server = new Server();
         server.bind({port: '0.0.0.0:3000'});
       }).toThrow();
     });
});