const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../db/connect');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { ObjectId } = require('mongodb');

const database_name = "cse341-rsrc-database";
const collection_name = "technology";
let mongo_memory_server;
let uri;

beforeAll(async () => {
	/**
	 * Creates in-memory MongoDB server
	 * Sets the URI to use the new in-memory serve
	 * Initializes connection used by controllers
	 */
	mongo_memory_server = await MongoMemoryServer.create();
	uri = mongo_memory_server.getUri();
	process.env.MONGODB_URI = uri;
	await mongodb.initDb((err, mongodb) => {
		if (err) {
			console.log(err);
		}
	});
	// bypass authentication for tests
	// const stubbedIsAuth = sinon.stub(auth, 'isAuthenticated');
	// auth.isAuthenticated.callsFake((req, res, next) => next());
});

afterAll(async () => {
	/**
	 *  Stops connection
	 *  Closes in-memory server
	 */
	mongodb.closeDb();
	await mongo_memory_server.stop();
});

const fake_technologies = [
	/**
	 * Define some fake technologies to use in tests
	 * Sets the _id explicitly so we know it will match
	 */
	{
		_id: ObjectId('63d60baf2bb47b6f813f1e7c'),
		"name": "Jest Technology 1",
		"description": "Test1",
		"category": "Jest1"
	},
	{
		_id: ObjectId('63d60baf2bb47b6f813f1e7d'),
		"name": "Jest Technology 2",
		"description": "Test2",
		"category": "Jest2"
	}
]

const addFakeData = async () => {
	/**
	 * Adds fake techology to in-memory DB
	 */
	await mongodb.getDb().db(database_name).collection(collection_name).insertMany(
		fake_technologies
	)
}

const clearTechnologies = async () => {
	/**
	 * Wipes all technologies from in-memory DB
	 */
	await mongodb.getDb().db(database_name).collection(collection_name).deleteMany({});
};

//eslint-disable-next-line no-unused-vars
const mock_auth = (req, res, next) => {
	/**
	 * Mock authentication middleware and oidc object
	 */
	class mockAuth {
		isAuthenticated() {
			return true;
		}
	}
	req.oidc = new mockAuth();
	next();
};

describe('Test Technologies handlers with in-memory Mongo', () => {
	/**
	 * Test suite for Technologies handlers
	 */

	// define app
	const app = new express();
	// set up to use routes, and json encoding for post/put
	app.use(mock_auth)
		.use(express.json())
		.use(express.urlencoded({ extended: true }))
		.use('/', require('../routes'));

	// clear techologies collection after each test
	afterEach(async () => {
		await clearTechnologies();
	});

	test('get all technologies /', async () => {
		/**
		 * Test the getAllTechnologies handler in Technologies controller
		 */

		// add fake technologies to in-memory DB
		addFakeData();
		// send get request
		const res = await request(app).get('/technologies');
		// expected conditions - - - - - - -
		expect(res.header['content-type']).toBe('application/json; charset=utf-8');
		expect(res.statusCode).toBe(200);
		// expect data response to match fake data
        expect(
			JSON.stringify(res.body) === JSON.stringify(fake_technologies)
	  ).toBe(true);
	});

	// test('get technology by ID /:id', async () => {
	// 	/**
	// 	 * Test the getTechnologyById handler in Technologies controller
	// 	 */

	// 	// add fake technologies to in-memory DB
	// 	addFakeData();
	// 	// send get request
	// 	const res = await request(app).get(
	// 		`/technologies/${fake_technologies[0]._id}`
	// 	);
	// 	// expected conditions - - - - - - -
	// 	expect(res.header['content-type']).toBe(
	// 		'application/json; charset=utf-8'
	// 	);
	// 	expect(res.statusCode).toBe(200);
	// 	// expect data response to match fake data
	// 	expect(
	// 		JSON.stringify(res.body) === JSON.stringify(fake_technologies[0])
	// 	).toBe(true);
	// });

	// test('create technology /', async () => {
	// 	/**
	// 	 * Test the createTechnology handler in Technologies controller
	// 	 */

	// 	// send get request
	// 	const res = await request(app)
	// 		.post('/technologies')
	// 		.send(fake_technologies[0]);
	// 	// expected conditions - - - - - - -
	// 	expect(res.header['content-type']).toBe(
	// 		'application/json; charset=utf-8'
	// 	);
	// 	expect(res.statusCode).toBe(201);
	// 	expect(res.body.acknowledged).toBe(true);
	// });

	// test('delete technology by ID /:id', async () => {
	// 	/**
	// 	 * Test the deleteTechnology handler in Technologies controller
	// 	 */
	// 	// add fake technologies to in-memory DB
	// 	addFakeData();

	// 	// send delete request
	// 	const res = await request(app).delete(
	// 		`/technologies/${fake_technologies[0]._id}`
	// 	);
	// 	// expected conditions - - - - - - -
	// 	expect(res.statusCode).toBe(204);

	// 	// Check database to make sure technology got deleted - - - - - -
	// 	// send get all technologies request
	// 	const validate_result = await request(app).get('/technologies');
	// 	// expected conditions - - - - - - -
	// 	expect(validate_result.header['content-type']).toBe(
	// 		'application/json; charset=utf-8'
	// 	);
	// 	expect(validate_result.statusCode).toBe(200);
	// 	// expect data response to not include deleted technology
	// 	expect(
	// 		JSON.stringify(validate_result.body) ===
	// 			JSON.stringify([fake_technologies[1]])
	// 	).toBe(true);
	// });

	// test('update technology by ID /:id', async () => {
	// 	/**
	// 	 * Test the updateTechnology handler in Technologies controller
	// 	 */
	// 	// add fake technologies to in-memory DB
	// 	addFakeData();

	// 	let updated_technology = fake_technologies[0];
	// 	updated_technology.title = 'Updated Title';

	// 	// send put request
	// 	const res = await request(app)
	// 		.put(`/technologies/${fake_technologies[0]._id}`)
	// 		.send(updated_technology);
	// 	// expected conditions - - - - - - -
	// 	expect(res.statusCode).toBe(204);

	// 	// Check database to make sure technology got updated - - - - - -
	// 	// send get all technologies request
	// 	const validate_result = await request(app).get(
	// 		`/technologies/${fake_technologies[0]._id}`
	// 	);
	// 	// expected conditions - - - - - - -
	// 	expect(validate_result.header['content-type']).toBe(
	// 		'application/json; charset=utf-8'
	// 	);
	// 	expect(validate_result.statusCode).toBe(200);
	// 	console.log(validate_result.body);
	// 	// expect data response to prove title was updated
	// 	expect(validate_result.body.title).toBe('Updated Title');
	// });
});
