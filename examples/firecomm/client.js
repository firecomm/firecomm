const { Stub } = require( "../../../index" );
const package = require( '../proto/package.js' )
const stub = new Stub( 
  package.ChattyMath, 
  'localhost: 3000',
);

let start;
let end;
const bidi = stub.bidiMath({thisIsMetadata: 'let the races begin'})
  .send({requests: 0, responses: 0})
  .on( 'metadata', (metadata) => {
    start = Number(process.hrtime.bigint());
    console.log(metadata.getMap())
  })
  .on( 'error', (err) => console.error(err))
  .on( 'data', (benchmark) => {
    bidi.send(
      {
        requests: benchmark.requests + 1, 
        responses: benchmark.responses
      }
    )
    if (benchmark.responses % 10000 === 0) {
      end = Number(process.hrtime.bigint());
    console.log(
      'server address:', bidi.getPeer(),
      '\ntotal number of responses:', benchmark.responses,
      '\navg millisecond speed per response:', ((end - start) /1000000) / benchmark.responses
    )
  }
});
// const grpc = require("grpc");
// const fs = require("fs");
// const path = require("path");
// const routeguide = require("./routeguide.js");

// const firecomm = require("../../index");

// let certificate = path.join(__dirname, "/server.crt");


// const stub = new firecomm.Stub(routeguide.RouteGuide, "localhost:3000");



// const healthStub = new firecomm.HealthStub("localhost:3000");

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

// const interceptorProvider = require("./interceptorProvider");

// // console.log(stub.getChannel().getConnectivityState(true))

// const firstChat = {
//   message: "Hello"
// };

// setInterval(() => {
//   newClient.send({ message: "please" });
// }, 1000);

// const duplexStream = stub
//   .bidiChat({ meta: "data" }, [interceptorProvider])
//   .send({ message: "from client" })
//   .on(data => console.log(data));

// stub
//   .unaryChat({ hello: "metadata" })
//   .send({ firstChat })
//   .on(data => console.log(data))
//   .on("metadata", data => console.log(data))
//   .on("status", data => console.log(data))
//   .catch(err => console.error(err));


// const testClientStream = () => {
//   const clientStream = stub.clientStream((err, res) => {
//     if (err) console.log(err);
//     console.log({ res });
//     clientStream.write(firstChat);
//   });
//   console.log({ clientStream });
//   clientStream.write(firstChat);
//   console.log({ clientStream });
//   clientStream.write(firstChat);

//   // setTimeout(() => {
//   //   // clientStream.write(firstChat);
//   //   clientStream.end();
//   // }, 400);
// };

// testClientStream();

// const newClient = stub.clientStream(
//   {hello: 'world yo',
//   options: {
//     idempotentRequest: true,
//     cacheableRequest: true,
//     corked: true,
//     waitForReady: false,
//   }})
//   .send({message: 'yolo'})
//   .send(firstChat)
//   .on((data) => console.log({ data }))
//   .on('status', (status) => console.log({ status }))
//   .on('metadata', (metadata) => console.log(metadata, metadata.getMap()))
//   .catch(err => console.log({ err }))

//   setInterval(()=>{
//     newClient.send({message:'please'})
//   }, 1000)

// const testServerStream = () => {
// const serverStream = stub.serverStream(firstChat);
// const serverStream = stub.serverStream(
//   {
//     stream: 'server',
//     options: {
//       idempotentRequest: true,
//       cacheableRequest: true,
//       corked: true,
//       waitForReady: false,
//     }
//   }
//   );
// serverStream.write(firstChat);
// serverStream.on("data", data => {
//   console.log(data);
// })
// serverStream.on("status", status => {
//   console.log(status);
// })
// serverStream.on("metadata", metadata => {
//   console.log(metadata);
// })
// .catch((err) => console.error(err));
// };
// testServerStream();

// const duplexStream = stub.bidiChat(
//   {bidi: 'meta',
//   options: {
//       idempotentRequest: true,
//       cacheableRequest: true,
//       corked: true,
//       waitForReady: false,
//     }}
//   );
// duplexStream.write({ message: "from client" });
// duplexStream.on("data", ({message}) => {
//   // console.log(message);
//   duplexStream.send({ message: "from client2" });
// });

// duplexStream.catch(err => {
//   console.log({ err });
// });

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


// testBidiChat();
