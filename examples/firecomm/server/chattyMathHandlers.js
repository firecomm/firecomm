// /server/chattyMathHandlers.js
function BidiMathHandler(bidi) {
  let start;
  let current;
  let perReq;
  let perSec;
  bidi
    .on('metadata', (metadata) => {
      start = Number(process.hrtime.bigint());
      bidi.set({thisSetsMetadata: 'responses incoming'})
      console.log(metadata.getMap()); // maps the special metadata object as a simple Object
    })
    .on('error', (err) => {
      console.error(err)
    })
    .on('data', (benchmark) => {
      bidi.send(
        {
          requests: benchmark.requests, 
          responses: benchmark.responses + 1
        }
      );
      if (benchmark.requests % 10000 === 0) {
        current = Number(process.hrtime.bigint());
        perReq = ((current - start) /1000000) / benchmark.requests; // nanoseconds to milliseconds averaging total requests
        perSec = 1 / (perReq / 1000); // inverting milliseconds per request to requests per second
      console.log(
        '\nclient address:', bidi.getPeer(),
        '\nnumber of requests:', benchmark.requests,
        '\navg millisecond speed per request:', perReq,
        '\nrequests per second:', perSec,
      );
    }
  })
}

module.exports = { 
	BidiMathHandler,
}
