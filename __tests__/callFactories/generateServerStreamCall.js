const generateServerStreamCall = require('../../lib/callFactories/generateServerStreamCall')
const mockServerReadableStream = {write: () => {}, request: 'fakeMessage', metadata: 'fakeMetadata'};
const mockServerWritable = generateServerStreamCall(mockServerReadableStream);

describe('Unit tests for generating Server Stream Call', () => {
  describe('Server Stream should have properties', () => {

    test('Server Stream Call must have metaData property', () => {
      expect(mockServerWritable.hasOwnProperty('metaData')).toBe(true);
    })

    test('Server Stream Call must have metadata property', () => {
      expect(mockServerWritable.hasOwnProperty('metadata')).toBe(true);
    })

    test('Server Stream Call must have body property', () => {
      expect(mockServerWritable.hasOwnProperty('body')).toBe(true);
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

  describe('Server Stream Call should receive message as body', () => {

    test('Server Stream Call should receive message as body', () => {
      expect(mockServerWritable.body === 'fakeMessage').toBe(true);
    })

    test('Server Stream Call should receive metadata as metadata', () => {
      expect(mockServerWritable.metadata === 'fakeMetadata').toBe(true);
    })

  })
})