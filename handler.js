'use strict';

/* 
	DESCRIPTION: 

		The handler which loads all the controllers from the handlers folder.

*/

const cors        = require('cors');
const http        = require('http');
const express     = require('express')
const compression = require('compression');

const port = 3000;
const app  = express();

app.options( '*', cors( { "optionsSuccessStatus": 200 } ) );
app.use( compression() );

(async() => {
	if ( !global.objects ) {
		let Objects = require('./lib/Objects').Objects;
		Objects     = new Objects();
	
		await Objects.init( { path: './lib' } );
	}
})();

app.use( /.*/, async ( req, res, next ) => {

	const PostParams = global.objects.PostParams.obj;

	res.header( "Access-Control-Allow-Origin", "*" );
	res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, apikey" );

	// Use a baseurl as the global object.
	let base_url = req.baseUrl.replace( /\//g, '' );
	let glob     = global.objects.handlers[ base_url ];
	
	// Run the code.
	let body    = await PostParams.init( { req: req } );
	let result  = await glob.obj.init( { req: req, res: res, body: body } );
	let success = result.success;
	let status  = result.status || 200;

	if ( success ) {
		res.status( status ).send( success );
	} else { 
		res.status(500).send( 'error' );
	}
} )

// Attach 'app' to http.
http.createServer( app ).listen( port );

if ( typeof PhusionPassenger !== 'undefined' ) {
	console.log( 'Running node with passenger' );
} else {
	console.log( `Running node listening on http://127.0.0.1:{port}/` );
}
