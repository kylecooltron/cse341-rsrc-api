const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = 'cse341-rsrc-database';
const collection = 'technologies';
const { technologyModel } = require('../models/model.technology');

const getAllTechnologies = async (req, res) => {
	// #swagger.tags = ['Technologies'],
	// #swagger.description = 'Request list of all technologies/languages'
	// #swagger.summary = 'Return list of technologies/languages'
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

const getTechnologyById = async (req, res) => {
	// #swagger.tags = ['Technologies'],
	// #swagger.description = 'Request technology by ID'
	// #swagger.summary = 'Find technology by ID'
	try {
		const technology = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.findOne({
				_id: ObjectId(req.params.id),
			});

		if (technology) {
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json(technology);
		} else {
			res.status(500).send({
				error: `Technology not found with id ${req.params.id}`,
			});
		}
	} catch (err) {
		res.status(500).send({
			error: String(err),
			params: req.params,
		});
	}
};

const createTechnology = async (req, res) => {
	// #swagger.tags = ['Technologies'],
	// #swagger.summary = 'Create technology',
	/*    #swagger.parameters['obj'] = {
				in: 'body',
				description: '🔒 Create new technology (Requires user to be logged in)',
				schema: {
					$name: 'Test Technology Name 1.0',
					$description: 'description',
					$category: 'programming language'
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
			.findOne({ name: req.body.name });
		if (alreadyExists) {
			throw new Error(
				`Technology with that name already exists: ${req.body.name}`
			);
		}

		const date_created = new Date();
		const techModel = technologyModel(req, date_created);
		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.insertOne(techModel);

		if (response.acknowledged) {
			res.status(201).json(response);
		} else {
			throw new Error(
				response.error ||
					'Some error occurred while creating the technology.'
			);
		}
	} catch (err) {
		res.status(500).send({
			error: String(err),
			body: req.body,
		});
	}
};

const deleteTechnology = async (req, res) => {
	// #swagger.tags = ['Technologies'],
	// #swagger.summary = 'Deletes technology by ID'
	// #swagger.description = '🔒 Delete existing technology (Requires user to be logged in)'
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

const updateTechnology = async (req, res) => {
	// #swagger.tags = ['Technologies'],
	// #swagger.summary = 'Updates technology by ID'
	/*    #swagger.parameters['obj'] = {
			  in: 'body',
			  description: '🔒 Update existing technology (Requires user to be logged in)',
			  schema: {
					$name: 'Test Technology Name 1.0',
					$description: 'description',
					$category: 'programming language'
			  }
	  } */
	/* #swagger.security = [{
			   "Basic": []
		}] */
	try {
		let date_created = null;
		const alreadyExists = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.findOne({ name: req.body.name });
		if (alreadyExists) {
			date_created = alreadyExists.date_created;
		}

		const techModel = technologyModel(req, date_created);
		const response = await mongodb
			.getDb()
			.db(database)
			.collection(collection)
			.replaceOne({ _id: new ObjectId(req.params.id) }, techModel);

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

module.exports = {
	getAllTechnologies,
	getTechnologyById,
	createTechnology,
	deleteTechnology,
	updateTechnology,
};
