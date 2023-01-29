CSE 341 Team Final | CSE 341 | 2023

Authors:
Kyle Coulon - kylecooltron.github.io

Repository at:
https://kylecooltron.github.io/

Render URL
https://cse341-rsrc-api.onrender.com



To start server:
    "npm start"

Development Notes:
    To start server in dev-mode:
        "npm run devStart"

    To run Swagger Autogen:
        "npm run swagger"

    If dependency tree gets messed up again just remember to install express-graphQL before graphql like this:
        npm install express-graphql graphql --save



ROBERT:

    Tags
        Make Collection
        Make Routes
        Make Controller
        Set up express-validator for POST & PUT
        Add authorization requirement to certain routes
        Write unit tests for tags handlers
        Ensure tags requests are available and descriptions/example data is provided on Swagger UI


MICHAEL:

    Technologies/Languages
        Make Collection
        Make Routes
        Make Controller
        Set up express-validator for POST & PUT
        Add authorization requirement to certain routes
        Write unit tests for technologies/languages handlers
        Ensure technologies requests are available and descriptions/example data is provided on Swagger UI

    Set up GraphQL
        Set up Mongoose DB
        Create Schema, Models
        Set up GraphQL Routes


KYLE:

    General
        ✔️Set up repo and added teammates as collaborators
        ✔️Set up render with environment variables
        ✔️Set up MongoDB

    Validation
        ✔️set up express validator middleware

    Users Authentication
        ✔️Set up Auth0 account
        ✔️added auth middleware
        ✔️Made users collection
        ✔️Made user data saving controller/handler
        ✔️Add authorization requirement to certain routes

    Resources Controller
        ✔️Wrote GET GET/id PUT POST DELETE routes/controller handlers for Resources
        ✔️express validator conditions for resources
        ✔️Require authorization on certain routes
        ✔️Write Unit tests
            - unit tests mock authentication
            - unit tests use in-memory database
            - unit tests use mock data
        ❌Include user roicd.sub ID in resources
        ✔️Ensured resources requests are available on Swagger UI
            - have descriptions and example data



TODO:
    
    Double check that swagger.json is up to date and all requests are functional
    Clean up code/comments
    Update README.MD

    EXTRA:
        resources documents to store id of related tags from tags collection
        resources documents to store id of related technologies/languages from collection
        tags documents to store list of resource documents they appear in
        handler to search tags by name (case insensitive, partial matches)
        handlers to search resources by title, subject, lesson, authors, languages/technologies
        front-end UI form for creating resources after logging in
        

    










