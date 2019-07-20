const grpc = require("grpc");

const routeguide = require("./routeguide");
const interceptorProvider = require("./interceptorProvider");

const stub = new routeguide.RouteGuide(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

const firstChat = { message: "Hello" };

stub.unaryChat(firstChat, { interceptors: [interceptorProvider] }, function(
  err,
  chat
) {
  if (err) console.log(err);
  console.log("response:", chat);
});
