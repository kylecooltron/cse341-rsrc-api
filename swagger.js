const { header } = require('express-validator');

const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		title: 'CSE 341 RSCS API',
		description: `<b>Class Resource Sharing API</b> <hr>
			This API would allow people enrolled in the class to log in, and
			create or find resources related to various subjects in the class.
			<br><i><font color="gray">Note: Some features require user to be authenticated.</font></i></br>
			To login navigate to <a href='/login' target="_blank">Login</a>
			To log out navigate to <a href='/logout' target="_blank">Log Out</a>`,
	},
	// URL for localhost
	// host: 'localhost:3000',
	// schemes: ['http'],
	host: 'cse341-rsrc-api.onrender.com',
	schemes: ['https'],
	tags: [
		{
			name: 'Resources',
			description: '',
		},
		{
			name: 'Technologies',
			description: '',
		},
		{
			name: 'Tags',
			description: '',
		},
	],
	// securityDefinitions: {
	// 	auth0: {
	// 		type: 'bearer',
	// 		in: 'header',
	// 		flow: 'accessCode',
	// 		authorizationUrl:
	// 			'https://dev-um52c854zc307eqz.us.auth0.com/authorize',
	// 		flow: 'implicit',
	// 		scopes: {
	// 			openid: 'Grant access to user',
	// 		},
	// 	},
	// },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
