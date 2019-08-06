const grpc = require("grpc");
const fs = require("fs");
const path = require("path");
const routeguide = require("./routeguide.js");

const firecomm = require("../../index");

let certificate = path.join(__dirname, "/server.crt");

const stub = new firecomm.Stub(routeguide.RouteGuide, "localhost:3000");

// stub.openChannel('localhost:3000');

// const stub = new routeguide.RouteGuide(
//     'localhost:3000', new grpc.credentials.createSsl(certificate));
// console.log(stub);

const interceptorProvider = require("./interceptorProvider");

// console.log(Object.keys(stub))

// const stub = generateStub(routeguide.RouteGuide);
// const actualStub = new stub('localhost:3000',
// grpc.credentials.createInsecure())
// console.log(actualStub)

// const stub = new routeguide.RouteGuide(
//     'localhost:3000', grpc.credentials.createInsecure());

// console.log(stub.getChannel().getConnectivityState(true))

const firstChat = {
  message: "Hello"
};

const { log: c } = console;

// stub.unaryChat({meta: 'data'}, [interceptorProvider])
// .send(firstChat)
// .on(res => console.log(res))
// .catch(err => console.log(err))
// unaryChat.on(res => console.log(res));
// unaryChat.catch(err => console.log(err));

// testUnaryChat()
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

// stub.serverStream({meta: 'data'}, [interceptorProvider])
// // .send(firstChat)
// .on(res => console.log(res))
// .send({message: 'please'})
// .on(({message}) => console.log(message))
// // .catch(err => console.log(err))
// .catch(err => console.error(err))

// const clientStream = stub
//   .clientStream()
//   .on(res => console.log(res))
//   .catch(err => console.error(err))
//   .send({ message: "yolo" });

// setInterval(() => {
//   clientStream.send(firstChat);
// },1000)

const oldClient = stub.clientStream((err, res) => {
  if (err) console.error(err);
  console.log(res);
});

oldClient.write({ message: "hello" });

// testClientStream();

// const testServerStream = () => {
//   const serverStream = stub.serverStream(firstChat);
//   // const serverStream = stub.serverStream();
//   // serverStream.write({path: 'firstChat'});
//   serverStream.on("data", data => {
//     console.log("data::", data), " ///////////// ";
//   });
// };
// testServerStream();

const testBidiChat = () => {
  console.log({ stub });
  console.log("bidichat:", stub.bidiChat);
  const duplexStream = stub.bidiChat();
  duplexStream.write({ message: "dickhead from client" });
  duplexStream.on("data", data => {
    console.log(data);
  });
  duplexStream.on("error", err => {
    console.log({ err });
  });
};

// testBidiChat();
