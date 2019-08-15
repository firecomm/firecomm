# FIRECOMM
![badge](https://img.shields.io/badge/version-v2.0.3.beta%20release-brightgreen)
![badge](https://img.shields.io/badge/build-passing-green?labelColor=444444)
![badge](https://img.shields.io/badge/license-Apache--2.0-green)

Feature library for gRPC-Node. Core functions for packaging a .proto file, spinning up Servers and client Stubs, unified client-side and server-side API, chainable RPC call methods, event listeners--for data, metadata, cancellation, errors, status changes, middleware, client-side interceptors, error boundaries, and support for idempotent, cacheable, and corked requests. 

Check out the [documentation website](https://firecomm.github.io)!

# Getting Started
## Install
``` 
npm i --save firecomm
```

## 1. Define a `.proto` file
Let's begin by creating a file named `exampleAPI.proto` that will live inside a `proto` folder. This file will define the name of the *Package*, the names of the *Services*, the *RPC methods* and the structured data of each *Message* sent and received.

```protobuf
// proto/exampleAPI.proto
syntax = "proto3";

package exampleAPI;

service ChattyMath {
  rpc BidiMath (stream Benchmark) returns (stream Benchmark) {};
}

message Benchmark {
  double requests = 1;
  double responses = 2;
}
```

> Each *RPC Method* clearly defines the Message object to be sent and received. The Object we send will have the exact properties `peerSocket` with a string value and `req` or `res` with a value of `double`, which can be a Number or a String in JavaScript based on the build configuration.

## 2. Let's `build()` a `package`

Let's pass an absolute path to our `.proto` file to build our *Package*. We will create a `package.js` file which will live in our root folder and `export` an Object containing the compiled *Service* and *RPC method*.

```javascript
// package.js
const { build } = require( 'firecomm' );
const path = require( 'path' );
const PROTO_PATH = path.join( __dirname, './proto/exampleAPI.proto' );

const CONFIG_OBJECT = {
  keepCase: true, // keeps everything camelCased
  longs: Number, // compiles the potentially enormous `double`s for our BenchmarkMsg requests and responses into a JavaScript Number rather than a String
}
const package = build( PROTO_PATH, CONFIG_OBJECT );
module.exports = package;
```

## 3. Create a server
Next, let's construct a *Server* in a new `server` folder and file. 

```javascript
// /server/server.js
const { Server } = require( 'firecomm' );
const server = new Server();
```

## 4. Define the server-side handlers for our `ChattyMath` *Service*.

Let's define handler functions for our `BidiMath` *RPC method*. Server-Side handlers are how we will interact with the Client-side requests.

```javascript
// /server/chattyMathHandlers.js
function BidiMathHandler(bidi) {
  let start;
  let end;
  bidi
    .on('metadata', (metadata) => {
      start = Number(process.hrtime.bigint());
      bidi.set({thisSetsMetadata: 'responses incoming'})
      console.log(metadata.getMap());
    })
    .on('error', (err) => {
      console.exception(err)
    })
    .on('data', (benchmark) => {
      bidi.send(
        {
          requests: benchmark.requests, 
          responses: benchmark.responses + 1
        }
      );
      if (benchmark.requests % 10000 === 0) {
        end = Number(process.hrtime.bigint());
      console.log(
        'client address:', bidi.getPeer(),
        '\nnumber of requests:', benchmark.requests,
        '\navg millisecond speed per request:', ((end - start) /1000000) / benchmark.requests
      );
    }
  })
}

module.exports = { 
	BidiMathHandler,
}
```

## 5. Add each *Service* from the package to the `Server`

Let's go back to the `server.js` file and map each *Service* onto our `Server`. Mirroring the structure of the `.proto` file, the *Package* Object we built has each *Service* on it as properties. We use the `Server.addService` method to add each `Service` one at a time and map each *RPC method* to the handler we want to use.  

```javascript
// /server/server.js
const { Server } = require( 'firecomm' );
const package = require( '../package.js' );
const { BidiMathHandler } = require ( './chattyMathHandlers.js );

new Server()
  .addService( package.ChattyMath,   {
  BidiMath: BidiMathHandler,
})
```

## 6. Bind the server to sockets

```javascript
// /server/server.js
const { Server } = require( 'firecomm' );
const package = require( '../package.js' );
const { BidiMathHandler } = require ( './chattyMathHandlers.js' );

new Server()
  .addService( package.ChattyMath,   {
  BidiMath: BidiMathHandler,
})
  .bind('0.0.0.0: 3000')
```
> Note: `Server`s can be passed an array of strings to bind any number of sockets. For example:
> ```javascript
> server.bind( [ 
>   '0.0.0.0: 3000', 
>   '0.0.0.0: 8080', 
>   '0.0.0.0: 9900',
> ] );
> ```
## 7. Start the server
```javascript
// /server/server.js
const { Server } = require( 'firecomm' );
const package = require( '../package.js' );
const { BidiMathHandler } = require ( './heavyMathHandlers.js' );

new Server()
  .addService( 
    package.ChattyMath,   
    { BidiMath: BidiMathHandler }
  )
  .bind('0.0.0.0: 3000')
  .start();
```
> Run your new firecomm/gRPC-Node server with: `node /server/server.js`. It may also be worthwhile to map this command to `npm start` in your `package.json`.

## 8.  Create a *Stub* for the `ChattyMath` service:
Now that the *Server* is fully fleshed out, let's create a *Stub* with access to each *RPC method* in the  `ChattyMath` *Service*. We'll create a `chattyMath.js` file which will live inside our `clients` folder.
```javascript
// /clients/chattyMath.js
const { Stub } = require( 'firecomm' );
const package = require( '../package.js' )
const stub = new Stub( 
	package.ChattyMath, 
	'localhost: 3000', // also can be '0.0.0.0: 3000'
);
```
> Note: multiple different clients *can* share a long-lived TCP connection with a single socket on the server, but it is likely better to map individual sockets.

## 9. Make requests from the `Stub` and see how many requests and responses a duplex can make!
```javascript
// /clients/heavyMath.js
const { Stub } = require( 'firecomm' );
const package = require( '../package.js' )
const stub = new Stub( 
  package.ChattyMath, 
  'localhost: 3000',
);

let start;
let end;
const bidi = stub.bidiMath({thisIsMetadata: 'let the races begin'})
  .send({requests: 1, responses: 0})
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
```
> Run your new firecomm/gRPC-Node client with: `node /clients/chattyMath.js`. It may also be worthwhile to map this command to a custom command like `npm run math` in your `package.json`.

Now enjoy the power of gRPCs! Feel free to construct multiple Stubs to any number of ports, bind any number of ports to the Server, experiment and enjoy!
