const grpc = require("grpc");
const fs = require("fs");
const path = require("path");
const routeguide = require("./routeguide.js");

const firecomm = require("../../index");

let certificate = path.join(__dirname, "/server.crt");

const stub = new firecomm.Stub(routeguide.RouteGuide, "localhost:3000");
// , {
//   certificate
// }

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

// stub
//   .unaryChat(firstChat)
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

const testUnaryChat = () => {
  // console.log(stub.getChannel().getConnectivityState(true))

  return stub.unaryChat(firstChat, { interceptors: [interceptorProvider] });
};

// testUnaryChat({ hello: "metadata" })
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

// const testClientStream = () => {
//   const clientStream = stub.clientStream((err, res) => {
//     if (err) console.log(err);
//     console.log({ res });
//   });
//   clientStream.write(firstChat);
//   clientStream.end();
// };

// testClientStream();

const newClient = stub.clientStream({meta: 'data'}, [interceptorProvider])
  .send({message: 'yolo'})
  .send(firstChat)
  .on(({message}) => console.log({ message }))
  .catch(err => console.log({ err }))

  setInterval(()=>{
    newClient.send({message:'please'})
  }, 1000)

// const testServerStream = () => {
//   const serverStream = stub.serverStream(firstChat);
//   // const serverStream = stub.serverStream();
//   // serverStream.write({path: 'firstChat'});
//   serverStream.on("data", data => {
//     console.log("data::", data), " ///////////// ";
//   });
// };
// testServerStream();

// const testBidiChat = () => {
// const duplexStream = stub.bidiChat({meta: 'data'});
// duplexStream.write({ message: "from client" });
// duplexStream.on("data", ({message}) => {
//   console.log(message);
//   duplexStream.write({ message: "from client" });
// });
// duplexStream.on('error',(err => {
//   console.log({ err });
// }));

const duplexStream = stub.bidiChat({meta: 'data'}, [interceptorProvider])
  .send({ message: "from client" })
  .on((data) => console.log(data))
  
duplexStream.on(({message}) => {
  console.log(message);
  duplexStream.send({ message: "from client2" });
})

duplexStream.catch((err => {
  console.log({ err });
}));

// testBidiChat();
