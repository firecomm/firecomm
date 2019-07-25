const UnaryCall = require('../../lib/calls/unaryCall');

const fakeCall = () => {};
describe('Unit test for Unary Call', () => {
  test('Unary Call must take a callback', () => {
    expect(() => new UnaryCall(fakeCall)).toThrow();
  })
})