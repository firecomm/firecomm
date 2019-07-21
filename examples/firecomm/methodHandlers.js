const grpc = require('grpc');

function unaryChat(ctx) {
  console.log(ctx.req.meta);
  console.log(ctx.req.data);
  ctx.setMeta({'hello': 'world'})
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

function bidiChat(call) {
  call.on('data', data => {
    console.log('data:', data);
    call.write({message: data.message + ' World'});
  });
}

module.exports = {
  unaryChat,
  bidiChat,
  serverStream,
  clientStream
};
