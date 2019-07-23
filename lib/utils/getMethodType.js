module.exports = function getMethodType(methodDefinition) {
  const requestStream = methodDefinition.requestStream;
  const responseStream = methodDefinition.responseStream;
  if (requestStream && responseStream) {
    return 'Duplex';
    }
  if (requestStream) {
    return 'ClientStream';
    }
  if (responseStream) {
    return 'ServerStream';
    }
  return 'Unary';
}