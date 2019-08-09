const grpc = require("grpc");
const fs = require("fs");
const path = require("path");
const routeguide = require("./routeguide.js");

const firecomm = require("../../index");

let certificate = path.join(__dirname, "/server.crt");

// const stub = new firecomm.Stub(routeguide.RouteGuide, "localhost:3000");

const healthStub = new firecomm.HealthStub("localhost:3000");

// healthStub
//   .check()
//   .on(res => console.log(res))
//   .catch(err => console.log(err))
//   .send({ services: [] });

// healthStub
//   .watch()
//   .on(res => console.log(res))
//   .catch(err => console.log(err))
//   .send({ services: [], interval: 5 });

// console.log(Object.keys(healthStub));

// stub.openChannel('localhost:3000');

// const stub = new routeguide.RouteGuide(
//     'localhost:3000', new grpc.credentials.createSsl(certificate));
// console.log(stub);

const interceptorProvider = require("./interceptorProvider");

// console.log(stub.getChannel().getConnectivityState(true))

const firstChat = {
  message: "Hello"
};

// const newClient = stub
//   .clientStream({ meta: "data" }, [interceptorProvider])
//   .send({ message: "yolo" })
//   .send(firstChat)
//   .on(({ message }) => console.log({ message }))
//   .catch(err => console.log({ err }));

// setInterval(() => {
//   newClient.send({ message: "please" });
// }, 1000);

// const duplexStream = stub
//   .bidiChat({ meta: "data" }, [interceptorProvider])
//   .send({ message: "from client" })
//   .on(data => console.log(data));

// duplexStream.on(({ message }) => {
//   console.log(message);
//   duplexStream.send({ message: "from client2" });
// });

// duplexStream.catch(err => {
//   console.log({ err });
// });
