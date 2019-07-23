const grpc = require('grpc');

function unaryChat(ctx) {
  ctx.setStatus({'trailer': 'value'});
  // ctx.throw(new Error('custom error message'));
  // console.log(ctx.req.meta);
  // console.log(ctx.req.data);
  // ctx.setTrailer({'hello': 'trailer'})
  // // ctx.throw({err: 'bad'})
  // ctx.setMeta({'hello': 'world'})
  ctx.send({message: 'what\'s up'})
  }

// function unaryChat(call, callback) {
//   const meta = new grpc.Metadata();
//   const {request} = call;
//   console.log(request);
//   const response = {message: request.message + ' World'};
//   callback(null, response, meta);
// }

function serverStream(call) {
  const {request} = call;
  call.write({message: request.message + ' World'});
  }

function clientStream(call, callback) {
  // console.log(call.request);
  // console.log("is it callback:", callback);
  call.on('data', data => {
    console.log('data:', data);
  });
  call.on('end', () => {
    const trailer = new grpc.Metadata();
    const response = {message: ' World'};
    callback(null, response, trailer);
  });
  }

function bidiChat(context) {
  console.log('context', context);
  console.log('context keys', Object.keys(context));
  // console.log('context proto', context.__proto__)

  context.on('data', data => {
    console.log('data:', data);
    context.write({message: data.message + ' World'});
  });
  context.throw(new Error('error'));
  setTimeout(() => {
    context.end();
  }, 3000)
}

module.exports = {
  unaryChat,
  bidiChat,
  serverStream,
  clientStream
};
