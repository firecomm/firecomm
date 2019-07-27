const generateDuplexCall = require('../../lib/callFactories/generateDuplex')
const mockDuplexStream = {
  on: () => {},
  write: () => {},
};
const mockDuplex = generateDuplexCall(mockDuplexStream);

describe('Unit test for generating Duplex Call', () => {
  
  describe('Duplex should have methods', () => {

    test('Duplex Call must have throw method', () => {
      expect(typeof mockDuplex.throw === 'function').toBe(true);
    })

    test('Duplex Call must have sendMeta method', () => {
      expect(typeof mockDuplex.sendMeta === 'function').toBe(true);
    })

    test('Duplex Call must have on method', () => {
      expect(typeof mockDuplex.on === 'function').toBe(true);
    })

    test('Duplex Call must have write method', () => {
      expect(typeof mockDuplex.write === 'function').toBe(true);
    })
  })
})