// // /server/server.js
// const { Server } = require( 'firecomm' );
const { Server } = require( '../../../index.js' );
const package = require( '../proto/package.js' );
const { BidiMathHandler } = require ( './chattyMathHandlers.js' );

new Server()
  .addService( 
    package.ChattyMath,   
    { BidiMath: BidiMathHandler }
  )
  .bind('0.0.0.0: 3000')
  .start();