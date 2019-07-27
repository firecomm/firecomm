const generateDuplexCall = require('../../lib/callFactories/generateDuplex')
const mockServerReadableStream = {
  on: () => {},
  write: () => {},
};
const mockServerReadable = generateDuplexCall(mockServerReadableStream);

describe('Unit test for generating Duplex Call', () => {
  
  describe('Duplex should have methods', () => {

    test('Duplex Call must have throw method', () => {
      expect(typeof mockServerReadable.throw === 'function').toBe(true);
    })

    test('Duplex Call must have sendMeta method', () => {
      expect(typeof mockServerReadable.sendMeta === 'function').toBe(true);
    })

    test('Duplex Call must have on method', () => {
      expect(typeof mockServerReadable.on === 'function').toBe(true);
    })

    test('Duplex Call must have write method', () => {
      expect(typeof mockServerReadable.write === 'function').toBe(true);
    })
  })
})