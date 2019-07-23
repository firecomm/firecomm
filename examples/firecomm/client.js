const grpc = require('grpc');

const routeguide = require('./routeguide');
const firecomm = require('../../index');

const stub = new firecomm.Stub(routeguide.RouteGuide);

stub.openChannel('localhost:3000');

// const stub = new routeguide.RouteGuide(
//     'localhost:3000', new grpc.credentials.createInsecure());

const interceptorProvider = require('./interceptorProvider');

console.log(Object.keys(stub))


// const stub = new routeguide.RouteGuide(
//     'localhost:3000', grpc.credentials.createInsecure());

// console.log(stub.getChannel().getConnectivityState(true))

const firstChat = { message: 'Hello', };

const { log: c } = console;

stub.unaryChat(firstChat).then(res => c(res)).catch(err => c(err));

const testUnaryChat = () => {
  // console.log(stub.getChannel().getConnectivityState(true))

  stub.unaryChat(
    firstChat, { interceptors: [interceptorProvider] }, (err, chat) => {
      if (err) console.log({ err });
      // console.log(stub.getChannel().getConnectivityState(true))
      console.log('response:', chat);
    });
};

// testUnaryChat()

const testClientStream = () => {
  const clientStream = stub.clientStream((err, chat) => {
    if (err) console.log(err);
    console.log('response:', chat);
  }, { interceptors: [interceptorProvider] });

  clientStream.write(firstChat);
  clientStream.end();
};
testClientStream();


const testServerStream = () => {
  const serverStream = stub.serverStream(firstChat);
  serverStream.on('data', (data) => {
    console.log('data::', data);
  });
};
// testServerStream();

const testBidiChat = () => {
  const duplexStream = stub.bidiChat();
  duplexStream.write(firstChat);
  duplexStream.on('data', (data) => {
    console.log(data);
  });
  duplexStream.on('error', (err) => {
    console.log({ err });
  })
};

// testBidiChat();
