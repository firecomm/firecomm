const generateServerStreamCall = require('../../lib/callFactories/generateServerStreamCall')
const {WritableStream} = require('stream');

const fakeCall = WritableStream;
const fakeCallback = () => {};
describe('Unit test for generating Server Stream Call', () => {
  test('Server Stream Call cannot take a callback', () => {
    expect(() => generateServerStreamCall(fakeCall, fakeCallback)).toThrow();
  })
})