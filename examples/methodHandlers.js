const grpc = require("grpc");

function unaryChat(call, callback) {
  const meta = new grpc.Metadata();
  const { request } = call;
  console.log(request);
  const response = { message: request.message + " World" };
  callback(null, response, meta);
}

function serverStream(call) {
  const { request } = call;
  call.write({ message: request.message + " World" });
}

function clientStream(call, callback) {
  console.log("is it callback");
  call.on("data", data => {});
  call.on("end", () => {});
}

function bidiChat(call) {
  call.on("data", data => {
    console.log("data");
  });
}

module.exports = {
  unaryChat,
  bidiChat,
  serverStream,
  clientStream
};
