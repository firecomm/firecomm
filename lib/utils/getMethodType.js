module.exports = function getMethodType(methodDefinition) {
  if (!methodDefinition.hasOwnProperty('requestStream')) {
    throw(new Error(
        'Service object not configured properly. Expected a Method Definition from a Service Object.'));
    }
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