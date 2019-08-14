// /server/server.js
const { Server } = require( '../../index.js' );
const package = require( './package.js' );
const { BidiMathHandler } = require ( './chattyMathHandlers.js' );

new Server()
  .addService( 
    package.ChattyMath,   
    { BidiMath: BidiMathHandler }
  )
  .bind('0.0.0.0: 3000')
  .start();


// const grpc = require("grpc");
// const firecomm = require("../../index");
// const fs = require("fs");
// const path = require("path");

// const package = require("./packageDefinition");

// const {
//   unaryChat,
//   serverStream,
//   clientStream,
//   bidiChat
// } = require("./methodHandlers");
// const waitFor = require("./middleware");

// const server = new firecomm.Server();

// server.addService(
//   package.RouteGuide,
//   { unaryChat: unaryChat, serverStream, clientStream, bidiChat }
//   // context => {
//   //   console.log("inside of service level middleware");
//   // },
//   // (err, call) => {
//   //   console.log("error from error handler:", err);
//   //   console.log("call in error:", call);
//   //   call.send({ message: "BULLDOZE THROUGH ERRORS" });
//   // }
// );

// // console.log({ server });
// // console.log("server proto", server.__proto__);
// // console.log(
// //   "proto of server handler",
// //   server.handlers["/routeguide.RouteGuide/UnaryChat"]
// // );

// let certPath = path.join(__dirname, "/server.crt");
// let keyPath = path.join(__dirname, "/server.key");

// // const result = 
// server.bind(["0.0.0.0:3000", "0.0.0.0:2999"], [{
//   privateKey: keyPath,
//   certificate: certPath
// }, null]);
// // console.log({ result });
// // console.log({ server });
// // console.log(server.__proto__);
// // console.log(new grpc.Server().__proto__)

// server.start();
