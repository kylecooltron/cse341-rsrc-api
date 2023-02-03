const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../db/connect');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server')
const { ObjectId } = require('mongodb');

const database_name = "cse341-rsrc-database";
const collection_name = "tags";
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


const fake_tags = [
    /**
     * Define some fake tags to use in tests
     * Sets the _id explicitly so we know it will match
     */
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7c'),
        "name": "Test Tag 1",
        "usage": []
    },
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7d'),
        "name": "Test Tag 2",
        "usage": []
    }
]

const addFakeData = async () => {
    /**
     * Adds fake tags to in-memory DB
     */
    await mongodb.getDb().db(database_name).collection(collection_name).insertMany(
        fake_tags
    )
}

const clearTags = async () => {
    /**
     * Wipes all tags from in-memory DB
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


describe('Test tags handlers with in-memory mongo', () => {
    /**
     * Test suite for Tags handlers
     */

    // define app
    const app = new express();
    // set up to use routes, and json encoding for post/put
    app.use(mock_auth)
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use('/', require('../routes'));

    // clear tags collection after each test
    afterEach(async () => {
        await clearTags();
    });

    test('get all tags /', async () => {
        /**
         * Test the getAllTags handler in Tags controller
         */

        // add fake tag to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get('/tags');
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_tags)
        ).toBe(true);
    });


    test('get tags by ID /:id', async () => {
        /**
         * Test the getTagById handler in Tags controller
         */

        // add fake resources to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get(`/tags/${fake_tags[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_tags[0])
        ).toBe(true);
    });


    test('create tag /', async () => {
        /**
         * Test the createTag handler in Tags controller
         */

        // send get request
        const res = await request(app).post('/tags').send(fake_tags[0]);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
        expect(res.body.acknowledged).toBe(true);
    });


    test('delete tag by ID /:id', async () => {
        /**
         * Test the deleteTag handler in Tag controller
         */
        // add fake tags to in-memory DB
        addFakeData();

        // send delete request
        const res = await request(app).delete(`/tags/${fake_tags[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure tag got deleted - - - - - -
        // send get all resources request
        const validate_result = await request(app).get('/tags');
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        // expect data response to not include deleted tag
        expect(
            JSON.stringify(validate_result.body) === JSON.stringify([fake_tags[1]])
        ).toBe(true);

    });


    test('update tag by ID /:id', async () => {
        /**
         * Test the updateTag handler in Tags controller
         */
        // add fake tags to in-memory DB
        addFakeData();

        let updated_tag = fake_tags[0];
        updated_tag.name = "Updated Name";

        // send put request
        const res = await request(app).put(`/tags/${fake_tags[0]._id}`).send(updated_tag);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure tag got updated - - - - - -
        // send get all tags request
        const validate_result = await request(app).get(`/tags/${fake_tags[0]._id}`);
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        console.log(validate_result.body);
        // expect data response to prove title was updated
        expect(validate_result.body.name).toBe("Updated Name");
    });

})


