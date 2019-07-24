const compose = require('../lib/compose');

describe('Unit tests for compose', () => {
  const arrayOfFuns = [
    (context) => {},
    (context) => {

    }
  ];
  const mockServiceDef = {
    HandlerName: {requestStream: false, responseStream: false}
  }

  it('Returns a function',
     () => {expect(typeof compose(
                       {handler: 'handlerName', middlewareStack: arrayOfFuns},
                       mockServiceDef))
                .toBe('function')})
})