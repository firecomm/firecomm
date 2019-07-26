const generateUnaryCall = require('../../lib/callFactories/generateUnaryCall');

const fakeCall = () => {};
describe('Unit test for Unary Call', () => {
  test('Unary Call must take a callback', () => {
    expect(() => generateUnaryCall(fakeCall)).toThrow();
  })
})