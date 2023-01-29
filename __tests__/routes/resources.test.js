const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../../db/connect');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server')
const { ObjectId } = require('mongodb');

const database_name = "cse341-rsrc-database";
const collection_name = "resources";
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
    //eslint-disable-next-line no-undef
    process.env.MONGODB_URI = uri
    //eslint-disable-next-line no-unused-vars
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


const fake_resources = [
    /**
     * Define some fake resources to use in tests
     * Sets the _id explicitly so we know it will match
     */
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7c'),
        "title": "Jest Resource 1",
        "subject": "Test",
        "description": "Test",
        "lesson_numbers": [1],
        "links": [],
        "search_tags": [],
        "contributing_students": [],
        "featured_technologies": []
    },
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7d'),
        "title": "Jest Resource 2",
        "subject": "Test",
        "description": "Test",
        "lesson_numbers": [2],
        "links": [],
        "search_tags": [],
        "contributing_students": [],
        "featured_technologies": []
    }
]

const addFakeData = async () => {
    /**
     * Adds fake resources to in-memory DB
     */
    await mongodb.getDb().db(database_name).collection(collection_name).insertMany(
        fake_resources
    )
}

const clearResources = async () => {
    /**
     * Wipes all resources from in-memory DB
     */
    await mongodb.getDb().db(database_name).collection(collection_name).deleteMany({});
}


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
}


describe('Test Resources handlers with in-memory mongo', () => {
    /**
     * Test suite for Resources handlers
     */

    // define app
    const app = new express();
    // set up to use routes, and json encoding for post/put
    app.use(mock_auth)
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use('/', require('../../routes'));

    // clear resources collection after each test
    afterEach(async () => {
        await clearResources();
    });

    test('get all resources /', async () => {
        /**
         * Test the getAllResources handler in Resources controller
         */

        // add fake resources to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get('/resources');
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_resources)
        ).toBe(true);
    });


    test('get resource by ID /:id', async () => {
        /**
         * Test the getResourceById handler in Resources controller
         */

        // add fake resources to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get(`/resources/${fake_resources[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_resources[0])
        ).toBe(true);
    });


    test('create resource /', async () => {
        /**
         * Test the createResource handler in Resources controller
         */

        // send get request
        const res = await request(app).post('/resources').send(fake_resources[0]);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
        expect(res.body.acknowledged).toBe(true);
    });


    test('delete resource by ID /:id', async () => {
        /**
         * Test the deleteResource handler in Resources controller
         */
        // add fake resources to in-memory DB
        addFakeData();

        // send delete request
        const res = await request(app).delete(`/resources/${fake_resources[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure resource got deleted - - - - - -
        // send get all resources request
        const validate_result = await request(app).get('/resources');
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        // expect data response to not include deleted resource
        expect(
            JSON.stringify(validate_result.body) === JSON.stringify([fake_resources[1]])
        ).toBe(true);

    });


    test('update resource by ID /:id', async () => {
        /**
         * Test the deleteResource handler in Resources controller
         */
        // add fake resources to in-memory DB
        addFakeData();

        let updated_resource = fake_resources[0];
        updated_resource.title = "Updated Title";

        // send put request
        const res = await request(app).put(`/resources/${fake_resources[0]._id}`).send(updated_resource);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure resource got updated - - - - - -
        // send get all resources request
        const validate_result = await request(app).get(`/resources/${fake_resources[0]._id}`);
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        console.log(validate_result.body);
        // expect data response to prove title was updated
        expect(validate_result.body.title).toBe("Updated Title");
    });

})


