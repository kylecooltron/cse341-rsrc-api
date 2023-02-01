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
	host: 'localhost:3000',
	schemes: ['http'],
	// host: 'cse341-rsrc-api.onrender.com',
	// schemes: ['https']
	tags: [
		{
			name: 'Resources',
			description: 'Get All Resources',
		},
		{
			name: 'Technologies',
			description: 'Get All Technologies / Languages',
		},
		{
			name: 'Tags',
			description: 'Get All Tags',
		},
	],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
