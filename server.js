const express = require('express');
const app = express();
const mongodb = require('./db/connect');

const dotenv = require('dotenv');
dotenv.config();

const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { auth } = require('express-openid-connect');

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: process.env.BASEURL,
	clientID: process.env.CLIENTID,
	issuerBaseURL: process.env.ISSUER,
};

const port = process.env.PORT || 3000;

app.use(auth(config))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
	.use('/', express.static(path.join(__dirname, './view')))
	.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Acccept, Z-Key'
		);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONs'
		);
		next();
	})
	.use('/', require('./routes'));

// eslint-disable-next-line no-unused-vars
mongodb.initDb((err, mongodb) => {
	if (err) {
		console.log(err);
	} else {
		app.listen(port, () => {
			console.log(`Connected to DB and listening on port ${port}`);
		});
	}
});
