module.exports = function(ctx) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {resolve()}, 3000);
  })
}