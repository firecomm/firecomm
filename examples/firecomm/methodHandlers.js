const grpc = require("grpc");

function unaryChat(ctx) {
  // ctx.setStatus({'trailer': 'value'});
  // ctx.throw(new Error('custom error message'));
  console.log(ctx.metadata);
  console.log(ctx.body);
  // ctx.setTrailer({'hello': 'trailer'})
  // ctx.setMeta({'hello': 'world'})
  // ctx.send({message: 'what\'s up'});
  // throw new Error("uncaught error");
  ctx.send({message: 'it works'})
}

function serverStream(context) {
  context.write({ message: " World" });
}

function clientStream(context) {
  // console.log('serverStream context: ', context);
  context.on('data', data => {console.log(data)});
  context.send({message: 'world'})
  }


function bidiChat(context) {
  // console.log('context', context);
  // console.log('context keys', Object.keys(context));
  // console.log('context proto', context.__proto__)

  context.on('data', data => {
    // console.log('data:', data);
    context.write({message: data.message + ' World'});
  });
  context.throw(new Error("error"));
  setTimeout(() => {
    context.end();
  }, 3000);
}

module.exports = {
  unaryChat,
  bidiChat,
  serverStream,
  clientStream
};
