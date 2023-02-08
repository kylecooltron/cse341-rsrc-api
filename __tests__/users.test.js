const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('../db/connect');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server')
const { ObjectId } = require('mongodb');

const database_name = "cse341-rsrc-database";
const collection_name = "users";
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


const fake_users = [
    /**
     * Define some fake users to use in tests
     * Sets the _id explicitly so we know it will match
     */
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7c'),
        "profile_id": 'google-oauth2|111111111111111111111',
        "name": "Test user 1"
    },
    {
        _id: ObjectId('63d60baf2bb47b6f813f1e7d'),
        "profile_id": 'google-oauth2|111111111111111111112',
        "name": "Test user 2"
    }
]

const addFakeData = async () => {
    /**
     * Adds fake users to in-memory DB
     */
    await mongodb.getDb().db(database_name).collection(collection_name).insertMany(
        fake_users
    )
}

const clearUsers = async () => {
    /**
     * Wipes all users from in-memory DB
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


describe('Test users handlers with in-memory mongo', () => {
    /**
     * Test suite for users handlers
     */

    // define app
    const app = new express();
    // set up to use routes, and json encoding for post/put
    app.use(mock_auth)
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use('/', require('../routes'));

    // clear users collection after each test
    afterEach(async () => {
        await clearUsers();
    });

    test('get all users /', async () => {
        /**
         * Test the getAllusers handler in users controller
         */

        // add fake tag to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get('/users');
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_users)
        ).toBe(true);
    });


    test('get users by ID /:id', async () => {
        /**
         * Test the getUserById handler in users controller
         */

        // add fake resources to in-memory DB
        addFakeData();
        // send get request
        const res = await request(app).get(`/users/${fake_users[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        // expect data response to match fake data
        expect(
            JSON.stringify(res.body) === JSON.stringify(fake_users[0])
        ).toBe(true);
    });


    test('create user /', async () => {
        /**
         * Test the createUser handler in users controller
         */

        // send get request
        const res = await request(app).post('/users').send(fake_users[0]);
        // expected conditions - - - - - - -
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
        expect(res.body.acknowledged).toBe(true);
    });


    test('delete User by ID /:id', async () => {
        /**
         * Test the deleteUser handler in Tag controller
         */
        // add fake users to in-memory DB
        addFakeData();

        // send delete request
        const res = await request(app).delete(`/users/${fake_users[0]._id}`);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure user got deleted - - - - - -
        // send get all users request
        const validate_result = await request(app).get('/users');
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        // expect data response to not include deleted user
        expect(
            JSON.stringify(validate_result.body) === JSON.stringify([fake_users[1]])
        ).toBe(true);

    });


    test('update user by ID /:id', async () => {
        /**
         * Test the updateUser handler in users controller
         */
        // add fake users to in-memory DB
        addFakeData();

        let updated_user = fake_users[0];
        updated_user.name = "Updated Name";

        // send put request
        const res = await request(app).put(`/users/${fake_users[0]._id}`).send(updated_user);
        // expected conditions - - - - - - -
        expect(res.statusCode).toBe(204);

        // Check database to make sure user got updated - - - - - -
        // send get all users request
        const validate_result = await request(app).get(`/users/${fake_users[0]._id}`);
        // expected conditions - - - - - - -
        expect(validate_result.header['content-type']).toBe('application/json; charset=utf-8');
        expect(validate_result.statusCode).toBe(200);
        console.log(validate_result.body);
        // expect data response to prove title was updated
        expect(validate_result.body.name).toBe("Updated Name");
    });

})


