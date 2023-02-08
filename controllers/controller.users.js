const mongodb = require('../db/connect');
const database = "cse341-rsrc-database";
const collection = "users";
const { validationResult } = require('express-validator');

const getAllUsers = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = '🔒 Request list of all Users (Must be logged in)'
    // #swagger.summary = 'Return list of users'
    /* #swagger.security = [{
               "Basic": []
        }] */
    try {
        await mongodb.getDb().db(database).collection(collection).find().toArray((err, list) => {
            if (err) {
                res.status(500).send({
                    error: `Cannot convert to array: ${err}`
                });
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list);
        });

    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

const getUserById = async (req, res) => {
	// #swagger.tags = ['Users']
	// #swagger.description = 'Request User by ID'
	// #swagger.summary = 'Find user by ID'
	try {
		const resource = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.findOne({
				_id: ObjectId(req.params.id),
			});

		if (resource) {
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json(resource);
		} else {
			res.status(500).send({
				error: `Tag not found with id ${req.params.id}`,
			});
		}
	} catch (err) {
		res.status(500).send({
			error: String(err),
			params: req.params,
		});
	}
};

const createUser = async (req, res) => {
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Create user',
	/*  #swagger.parameters['obj'] = {
              in: 'body',
              description: '🔒 Create new tag (Requires user to be logged in)',
              schema: {
                  $profile_id: 'Google Oauth2 Profile',
                  $name: "user name"
              }
      } */
	/* #swagger.security = [{
               "Basic": []
        }] */
	try {
		const alreadyExists = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.findOne({ title: req.body.name });
		if (alreadyExists) {
			throw new Error(`Tag with name already exists: ${req.body.name}`);
		}

		const user = {
			profile_id: req.body.profile_id,
			name: req.body.name,
		};

		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.insertOne(user);

		if (response.acknowledged) {
			res.status(201).json(response);
		} else {
			throw new Error(
				response.error || 'Some error occurred while creating the tag.'
			);
		}
	} catch (err) {
		res.status(500).send({
			error: String(err),
			body: req.body,
		});
	}
};

const deleteUser = async (req, res) => {
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Deletes user by ID'
	// #swagger.description = '🔒 Delete existing user (Requires user to be logged in)'
	/* #swagger.security = [{
               "Basic": []
        }] */
	try {
		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.deleteOne({ _id: new ObjectId(req.params.id) }, true);

		if (response.deletedCount > 0) {
			res.status(204).send();
		} else {
			const err_string = `ID: ${req.params.id} may not exist in the DB`;
			throw new Error(response.error || err_string);
		}
	} catch (err) {
		res.status(500).send({
			error: String(err),
			params: req.params,
		});
	}
};

const updateUser = async (req, res) => {
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Updates user by ID'
	/*    #swagger.parameters['obj'] = {
              in: 'body',
              description: '🔒 Update existing user (Requires user to be logged in)',
              schema: {
                  $profile_id: 'Google Oauth2 Profile',
                  $name: "user name"
              }
      } */
	/* #swagger.security = [{
               "Basic": []
        }] */
	try {
		const user = {
			profile_id: req.body.profile_id,
			name: req.body.name,
		};
		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.replaceOne({ _id: new ObjectId(req.params.id) }, user);

		if (response.modifiedCount > 0) {
			res.status(204).send();
		} else {
			const err_string = `ID: ${req.params.id} may not exist in the DB`;
			throw new Error(response.error || err_string);
		}
	} catch (err) {
		res.status(500).send({
			error: String(err),
			params: req.params,
			body: req.body,
		});
	}
};

const isAuthenticated = async (req, res) => {
    // # swagger.ignore = true
    /**
     * Returns login state
     *  If login succesful user profile information is saved to database
     * 
     */
    try {
        if (req.oidc.isAuthenticated()) {
            // User is logged in, save user profile info to DB
            const user_profile_info = {
                profile_id: req.oidc.user.sub,
                name: req.oidc.user.name
            }
            let msg;
            if (!await mongodb.getDb().db(database).collection(collection).findOne(user_profile_info)) {
                const response = await mongodb.getDb().db(database).collection(collection).insertOne(user_profile_info);
                if (response.acknowledged) {
                    msg = `User profile info saved. Name: ${user_profile_info.name}, Profile ID: ${user_profile_info.profile_id}`
                } else {
                    msg = 'Some error occurred while adding new user to db.';
                }
            } else {
                msg = "User info already in database";
            }
            // send response
            res.status(200).json({
                "authorized": true,
                "message": msg,
                "name": user_profile_info.name,
                "profile_id": user_profile_info.profile_id,
            });

        } else {
            // User is not logged in
            res.status(200).json({
                "authorized": false,
            });
        }

    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { isAuthenticated, getAllUsers, getUserById, createUser, deleteUser, updateUser };