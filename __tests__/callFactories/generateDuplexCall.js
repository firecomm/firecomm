const generateDuplexCall = require('../../lib/callFactories/generateDuplex')
const mockServerReadableStream = {
  on: () => {},
  write: () => {},
};
const fakeCallback = (err, object, trailer) => {};
const mockServerReadable = generateClientStreamCall(mockServerReadableStream, fakeCallback);

describe('Unit test for generating Duplex Call', () => {
  describe('Duplex should have properties', () => {

    test('Duplex Call must have metaData property', () => {
      expect(mockServerReadable.hasOwnProperty('metaData')).toBe(true);
    })

    test('Duplex Call must have err property', () => {
      expect(mockServerReadable.hasOwnProperty('err')).toBe(true);
    })

    test('Duplex Call must have trailer property', () => {
      expect(mockServerReadable.hasOwnProperty('trailer')).toBe(true);
    })
  });

  describe('Duplex should have methods', () => {

    test('Duplex Call must have throw method', () => {
      expect(typeof mockServerReadable.throw === 'function').toBe(true);
    })

    test('Duplex Call must have setStatus method', () => {
      expect(typeof mockServerReadable.setStatus === 'function').toBe(true);
    })

    test('Duplex Call must have setMeta method', () => {
      expect(typeof mockServerReadable.setMeta === 'function').toBe(true);
    })

    test('Duplex Call must have send method', () => {
      expect(typeof mockServerReadable.send === 'function').toBe(true);
    })

    test('Duplex Call must have on method', () => {
      expect(typeof mockServerReadable.on === 'function').toBe(true);
    })

    test('Duplex Call must have write method', () => {
      expect(typeof mockServerReadable.write === 'function').toBe(true);
    })
  })
})