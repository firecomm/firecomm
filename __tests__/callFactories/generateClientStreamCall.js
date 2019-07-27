const generateClientStreamCall = require('../../lib/callFactories/generateClientStreamCall')
const mockServerReadableStream = {on: () => {}};
const fakeCallback = (err, object, trailer) => {};
const mockServerReadable = generateClientStreamCall(mockServerReadableStream, fakeCallback);

describe('Unit tests for generating Client Stream Call', () => {

  describe('Client Stream should have properties', () => {

    test('Client Stream Call must have metaData property', () => {
      expect(mockServerReadable.hasOwnProperty('metaData')).toBe(true);
    })

    test('Client Stream Call must have err property', () => {
      expect(mockServerReadable.hasOwnProperty('err')).toBe(true);
    })

    test('Client Stream Call must have trailer property', () => {
      expect(mockServerReadable.hasOwnProperty('trailer')).toBe(true);
    })
  });

  describe('Client Stream should have methods', () => {

    test('Client Stream Call must have throw method', () => {
      expect(typeof mockServerReadable.throw === 'function').toBe(true);
    })

    test('Client Stream Call must have setStatus method', () => {
      expect(typeof mockServerReadable.setStatus === 'function').toBe(true);
    })

    test('Client Stream Call must have setMeta method', () => {
      expect(typeof mockServerReadable.setMeta === 'function').toBe(true);
    })

    test('Client Stream Call must have send method', () => {
      expect(typeof mockServerReadable.send === 'function').toBe(true);
    })

    test('Client Stream Call must have on method', () => {
      expect(typeof mockServerReadable.on === 'function').toBe(true);
    })
  })
})