const ClientStreamCall = require('../../lib/calls/clientStreamCall')
const {ReadableStream} = require('stream');

const fakeCall = ReadableStream;
describe('Unit test for Client Stream Call', () => {
  test('Client Stream Call must take a callback', () => {
    expect(() => new ClientStreamCall(fakeCall)).toThrow();
  })
})