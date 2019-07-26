const generateDuplexCall = require('../../lib/callFactories/generateDuplex')
const {Duplex} = require('stream');

const fakeCall = Duplex;
const fakeCallback = () => {};
describe('Unit test for generating Duplex Call', () => {
  test('Duplex Call cannot take a callback', () => {
    expect(() => generateDuplexCall(fakeCall, fakeCallback)).toThrow();
  })
})