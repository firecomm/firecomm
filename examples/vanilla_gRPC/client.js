const grpc = require('grpc');

const routeguide = require('../firecomm/routeguide');
const interceptorProvider = require('./interceptorProvider');

const stub = new routeguide.RouteGuide(
  'localhost:3001', grpc.credentials.createInsecure()
);

const firstChat = {
  message: 'Hello'
};


const testUnaryChat = () => {
  stub.unaryChat(
    firstChat, { interceptors: [interceptorProvider] }, function (err, chat) {
      if (err) console.log(err);
      console.log(stub.getChannel().getConnectivityState(true))
      console.log('response:', chat);
    });
};

testUnaryChat();

const testClientStream = () => {
  const clientStream = stub.clientStream(function (err, chat) {
    if (err) console.log(err);
    console.log('response:', chat);
  }, { interceptors: [interceptorProvider] });

  clientStream.write(firstChat);
  clientStream.end();
};
// testClientStream();

const testServerStream = () => {
  const serverStream = stub.serverStream(firstChat);
  serverStream.on('data', data => {
    console.log('data::', data);
  });
};
// testServerStream();

const testBidiChat = () => {
  const duplexStream = stub.bidiChat();
  duplexStream.write(firstChat);
  duplexStream.on('data', data => {
    console.log(data);
  });
};

// testBidiChat();
