const DuplexCall = require('../../lib/calls/duplexCall')
const {Duplex} = require('stream');

const fakeCall = Duplex;
const fakeCallback = () => {};
describe('Unit test for Duplex Call', () => {
  test('Duplex Call cannot take a callback', () => {
    expect(() => new DuplexCall(fakeCall, fakeCallback)).toThrow();
  })
})