// /clients/chattyMath.js
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