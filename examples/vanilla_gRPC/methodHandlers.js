const grpc = require("grpc");

function unaryChat(call, callback) {
  // throw new Error("this is an error");
  const meta = new grpc.Metadata();
  meta.set("trailertest", "trailers");
  // console.log({ meta });
  const { request } = call;
  console.log(request);
  const response = { message: request.message + " World" };
  let err = new Error("hello");
  err.metadata = meta;
  callback(err, response, meta);
}

function serverStream(call) {
  const { request } = call;
  call.write({ message: request.message + " World" });
}

function clientStream(call, callback) {
  // console.log(call.request);
  // console.log("is it callback:", callback);
  call.on("data", data => {
    console.log("data:", data);
  });
  call.on("end", () => {
    const trailer = new grpc.Metadata();
    const response = { message: " World" };
    callback(null, response, trailer);
  });
}

function bidiChat(call) {
  call.on("data", data => {
    console.log("data:", data);
    call.write({ message: data.message + " World" });
  });
}

module.exports = {
  unaryChat,
  bidiChat,
  serverStream,
  clientStream
};
