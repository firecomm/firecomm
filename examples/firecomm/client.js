const grpc = require('grpc');
const fs = require('fs');
const routeguide = require('./routeguide.js');

const firecomm = require('../../index');

const interceptorProvider = require('./interceptorProvider');

let certificate = fs.readFileSync(__dirname + '/server.crt');

const stub = new routeguide.RouteGuide(
    'localhost:3000', grpc.credentials.createSsl(certificate));

// console.log(stub.getChannel().getConnectivityState(true))



const firstChat = {
  message: 'Hello',
};

const testUnaryChat = () => {
  console.log(stub.getChannel().getConnectivityState(true))

  stub.unaryChat(
      firstChat, {interceptors: [interceptorProvider]}, (err, chat) => {
        if (err) console.log({err});
        console.log(stub.getChannel().getConnectivityState(true))
        console.log('response:', chat);
      });
};

// testUnaryChat()

const testClientStream = () => {
  const clientStream = stub.clientStream((err, chat) => {
    if (err) console.log(err);
    console.log('response:', chat);
  }, {interceptors: [interceptorProvider]});

  clientStream.write(firstChat);
  clientStream.end();
};
// testClientStream();

const testServerStream = () => {
  const serverStream = stub.serverStream(firstChat);
  // const serverStream = stub.serverStream();
  // serverStream.write({path: 'firstChat'});
  serverStream.on('data', (data) => {
    console.log('data::', data), ' ///////////// ';
  });
};

testServerStream();

const testBidiChat = () => {
  const duplexStream = stub.bidiChat();
  duplexStream.write({message: 'dickhead from client'});
  duplexStream.on('data', (data) => {
    console.log(data);
  });
  duplexStream.on('error', (err) => {
    console.log({err});
  })
};

// testBidiChat();
