const generateUnaryCall = require('../../lib/callFactories/generateUnaryCall');

const mockUnary = generateUnaryCall(fakeUnaryCall, fakeCallBack);
describe('Unit tests for Unary Call', () => {
  describe('Unary should have properties', () => {

    test('Unary Call must have metaData property', () => {
      expect(mockUnary.hasOwnProperty('metaData')).toBe(true);
    })

    test('Unary Call must have metadata property', () => {
      expect(mockUnary.hasOwnProperty('metadata')).toBe(true);
    })

    test('Unary Call must have body property', () => {
      expect(mockUnary.hasOwnProperty('body')).toBe(true);
    })

    test('Unary Call must have err property', () => {
      expect(mockUnary.hasOwnProperty('err')).toBe(true);
    })

    test('Unary Call must have trailer property', () => {
      expect(mockUnary.hasOwnProperty('trailer')).toBe(true);
    })
  });

  describe('Unary should have methods', () => {

    test('Unary Call must have throw method', () => {
      expect(typeof mockUnary.throw === 'function').toBe(true);
    })

    test('Unary Call must have setStatus method', () => {
      expect(typeof mockUnary.setStatus === 'function').toBe(true);
    })

    test('Unary Call must have setMeta method', () => {
      expect(typeof mockUnary.setMeta === 'function').toBe(true);
    })

    test('Unary Call must have send method', () => {
      expect(typeof mockUnary.send === 'function').toBe(true);
    })
  })
})