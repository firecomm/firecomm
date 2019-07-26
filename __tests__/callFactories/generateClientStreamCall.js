const generateClientStreamCall = require('../../lib/callFactories/generateClientStreamCall')
const {ReadableStream} = require('stream');

const fakeCall = ReadableStream;
describe('Unit test for generating Client Stream Call', () => {
  test('Client Stream Call must take a callback', () => {
    expect(() => generateClientStreamCall(fakeCall)).toThrow();
  })
})