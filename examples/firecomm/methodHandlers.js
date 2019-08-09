const grpc = require("grpc");

function unaryChat(call) {
  // ctx.setStatus({'trailer': 'value'});
  // ctx.throw(new Error('custom error message'));
  // console.log(ctx.metadata);
  // console.log(ctx.body);
  console.log({ call });
  ctx.on(data => console.log({ data }));
  ctx.set({ hello: "world" });
  ctx.send({ message: "message body" });
  // ctx.setTrailer({'hello': 'trailer'})
  // ctx.setMeta({'hello': 'world'})
  // ctx.send({message: 'what\'s up'});
  // throw new Error("uncaught error");
}

function serverStream(context) {
  context.write({ message: " World" });
}

function clientStream(call) {
  console.log("serverStream call: ", call);
  context.on("data", data => {
    console.log(data);
    context.send({ message: "world" });
  });
}

function bidiChat(context) {
  console.log("context", context);
  // console.log('context keys', Object.keys(context));
  // console.log('context proto', context.__proto__)

  context.on("data", data => {
    // console.log('data:', data);
    context.write({ message: data.message + " World" });
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
