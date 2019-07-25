const compose = require('../lib/compose');

describe('Unit tests for compose', () => {
  let arrayOrder = [];
  const arrayOfFuncs = [
    (ctx) => {arrayOrder.push(1)},
    (ctx) => {arrayOrder.push(2)},
    (ctx) => {arrayOrder.push(3)},
    (ctx) => {arrayOrder.push(4)},
  ];
  const mockServiceDef = {
    UnaryCall: {requestStream: false, responseStream: false},
    ClientStream: {requestStream: true, responseStream: false},
    ServerStream: {requestStream: false, responseStream: true},
    DuplexStream: {requestStream: true, responseStream: true},
  }

  test('Returns a unary composed function', () => {
    expect(
      typeof 
      compose({ 
      handler: 'unaryCall', 
      middlewareStack: arrayOfFuncs
    }, 
    mockServiceDef)
    )
    .toBe('function')
  })

  test('Returns a client-side streaming composed function', () => {
    expect(
      typeof 
      compose({ 
      handler: 'clientStream', 
      middlewareStack: arrayOfFuncs
    }, 
    mockServiceDef)
    )
    .toBe('function')
  })

  test('Returns a server-side streaming composed function', () => {
    expect(
      typeof 
      compose({ 
      handler: 'serverStream', 
      middlewareStack: arrayOfFuncs
    }, 
    mockServiceDef)
    )
    .toBe('function')
  })

  test('Returns a bidirectional composed function', () => {
    expect(
      typeof 
      compose({ 
      handler: 'duplexStream', 
      middlewareStack: arrayOfFuncs
    }, 
    mockServiceDef)
    )
    .toBe('function')
  })

})