module.exports = function(customCall, originalCall) {
  customCall.call = originalCall;
  customCall.state = null;
  customCall.head = originalCall.metadata;
};
