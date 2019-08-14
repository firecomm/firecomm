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
