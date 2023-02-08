const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = 'cse341-rsrc-database';
const collection = 'tags';
const { validationResult } = require('express-validator');

const getAllTags = async (req, res) => {
	// #swagger.tags = ['Tags']
	// #swagger.description = 'Request list of all Tags'
	// #swagger.summary = 'Return list of tags'
	try {
		await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.find()
			.toArray((err, list) => {
				if (err) {
					res.status(500).send({
						error: `Cannot convert to array: ${err}`,
					});
				}
				res.setHeader('Content-Type', 'application/json');
				res.status(200).json(list);
			});
	} catch (err) {
		res.status(500).json(err);
	}
};

const getTagById = async (req, res) => {
	// #swagger.tags = ['Tags']
	// #swagger.description = 'Request Tag by ID'
	// #swagger.summary = 'Find tag by ID'
	try {
		const tag = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.findOne({
				_id: ObjectId(req.params.id),
			});

		if (tag) {
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json(tag);
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

const createTag = async (req, res) => {
	// #swagger.tags = ['Tags']
	// #swagger.summary = 'Create tag',
	/*  #swagger.parameters['obj'] = {
              in: 'body',
              description: '🔒 Create new tag (Requires user to be logged in)',
              schema: {
                  $name: 'Test tag name',
                  $usage: []
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

		const tag = {
			name: req.body.name,
			usage: req.body.usage,
		};

		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.insertOne(tag);

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

const deleteTag = async (req, res) => {
	// #swagger.tags = ['Tags']
	// #swagger.summary = 'Deletes tag by ID'
	// #swagger.description = '🔒 Delete existing tag (Requires user to be logged in)'
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

const updateTag = async (req, res) => {
	// #swagger.tags = ['Tags']
	// #swagger.summary = 'Updates tag by ID'
	/*    #swagger.parameters['obj'] = {
              in: 'body',
              description: '🔒 Update existing tag (Requires user to be logged in)',
              schema: {
                  $name: 'Test tag name',
                    $usage: []
              }
      } */
	/* #swagger.security = [{
               "Basic": []
        }] */
	try {
		const tag = {
			name: req.body.name,
			usage: req.body.usage,
		};
		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.replaceOne({ _id: new ObjectId(req.params.id) }, tag);

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

module.exports = { getAllTags, getTagById, createTag, deleteTag, updateTag };
