const ServerStreamCall = require('../../lib/calls/serverStreamCall')
const {WritableStream} = require('stream');

const fakeCall = WritableStream;
const fakeCallback = () => {};
describe('Unit test for Server Stream Call', () => {
  test('Server Stream Call cannot take a callback', () => {
    expect(() => new ServerStreamCall(fakeCall, fakeCallback)).toThrow();
  })
})