const generateServerStreamCall = require('../../lib/callFactories/generateServerStreamCall')
const mockServerReadableStream = {write: () => {}};
const mockServerWritable = generateServerStreamCall(mockServerReadableStream);

describe('Unit tests for generating Server Stream Call', () => {
  describe('Server Stream should have properties', () => {

    test('Server Stream Call must have metaData property', () => {
      expect(mockServerWritable.hasOwnProperty('metaData')).toBe(true);
    })

    test('Server Stream Call must have req property', () => {
      expect(mockServerWritable.hasOwnProperty('req')).toBe(true);
    })

    test('Server Stream Call req must have meta property', () => {
      expect(mockServerWritable.req.hasOwnProperty('meta')).toBe(true);
    })

    test('Server Stream Call req must have data property', () => {
      expect(mockServerWritable.req.hasOwnProperty('data')).toBe(true);
    })
  });

  describe('Server Stream should have methods', () => {

    test('Server Stream Call must have throw method', () => {
      expect(typeof mockServerWritable.throw === 'function').toBe(true);
    })

    test('Server Stream Call must have setMeta method', () => {
      expect(typeof mockServerWritable.sendMeta === 'function').toBe(true);
    })

    test('Server Stream Call must have write method', () => {
      expect(typeof mockServerWritable.write === 'function').toBe(true);
    })
  })
})