function Promisify(methodName) {
  const closureThis = this;
  console.log('inside promisify', {closureThis});
  return function(message, interceptors) {
    console.log({closureThis});
    return new Promise((resolve, reject) => {
      console.log({closureThis})
      closureThis[methodName](message, interceptors, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
}

module.exports = {Promisify}