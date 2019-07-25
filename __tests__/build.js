const build = require('../lib/build');
const path = require('path');
const PROTO_PATH = path.join(__dirname, 'test.proto')

describe('Unit tests for build',  () => {
  test('Builds a gRPC package with just a PROTO_PATH', () => {
    const testPkg = build(PROTO_PATH);
    expect(typeof testPkg).toBe('object');
  })
  describe('test strict typing of config object properties', () => {
    test('config object\'s keepcase must be a boolean', () => {
      expect(() => build(PROTO_PATH, {keepCase: Object})).toThrow()
    })
    test('config object\'s longs must be a boolean', () => {
      expect(() => build(PROTO_PATH, {longs: Object})).toThrow()
    })
    test('config object\'s enums must be a boolean', () => {
      expect(() => build(PROTO_PATH, {enums: Object})).toThrow()
    })
    test('config object\'s bytes must be a boolean', () => {
      expect(() => build(PROTO_PATH, {bytes: Object})).toThrow()
    })
    test('config object\'s defaults must be a boolean', () => {
      expect(() => build(PROTO_PATH, {defaults: Object})).toThrow()
    })
    test('config object\'s arrays must be a boolean', () => {
      expect(() => build(PROTO_PATH, {arrays: Object})).toThrow()
    })
    test('config object\'s objects must be a boolean', () => {
      expect(() => build(PROTO_PATH, {objects: Object})).toThrow()
    })
    test('config object\'s oneofs must be a boolean', () => {
      expect(() => build(PROTO_PATH, {oneofs: Object})).toThrow()
    })
  });

})