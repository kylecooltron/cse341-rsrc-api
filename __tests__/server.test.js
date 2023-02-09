
const dotenv = require('dotenv');
const mongodb = require('../db/connect');

describe('Test server.js Entry Point File', () => {

    test('Test config env vars', () => {

        // define fake env variables
        process.env.SECRET = "fake_secret"
        process.env.BASEURL = "https://localhost3000"
        process.env.CLIENTID = "fake_clientid"
        process.env.ISSUER = "fake_issuer"

        // mock modules
        dotenv.config = jest.fn();
        jest.mock("express", () => () => jest.fn());
        jest.mock("swagger-ui-express", () => jest.fn());
        mongodb.initDb = jest.fn();

        const { exportConfig } = require("../server");

        const expected_config = {
            authRequired: false,
            auth0Logout: true,
            secret: process.env.SECRET,
            baseURL: process.env.BASEURL,
            clientID: process.env.CLIENTID,
            issuerBaseURL: process.env.ISSUER,
        };

        expect(JSON.stringify(exportConfig())).toBe(JSON.stringify(expected_config));

    })

});
