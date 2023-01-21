const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-database";
const collection = "class_resources";
const { validationResult } = require('express-validator');


const getAllResources = async (req, res) => {
  try {
    await mongodb.getDb().db(database).collection(collection).find().toArray((err, list) => {
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

const getResourceById = async (req, res) => {
  try {

    await mongodb.getDb().db(database).collection(collection).find(
      {
        "_id": ObjectId(output.id)
      }
    ).toArray((err, list) => {

      if (err) {
        res.status(500).send({
          error: `Cannot convert to array: ${err}`,
        });
      }

      if (list.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list[0]);
      } else {
        res.status(500).send({
          error: `Level not found with id ${output.id}`,
        });
      }

    })

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params
    });
  }
};


const createResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }


    const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne({ level_name: output.level_name });
    if (alreadyExists) {
      throw new Error(`Level with name already exists: ${output.level_name}`);
    }

    const response = await mongodb.getDb().db(database).collection(collection).insertOne(output);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error(response.error || 'Some error occurred while creating the level.');
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      body: req.body
    });
  }

};


const deleteResource = async (req, res) => {
  try {


    const levelId = new ObjectId(output.id);
    const response = await mongodb.getDb().db(database).collection(collection).deleteOne({ _id: levelId }, true);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      const err_string = `ID: ${output.id} may not exist in the DB`;
      throw new Error(response.error || err_string);
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params
    });
  }
};

const updateResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const levelId = new ObjectId(params_output.id);
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: levelId }, body_output);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      const err_string = `ID: ${params_output.id} may not exist in the DB`;
      throw new Error(response.error || err_string);
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params,
      body: req.body
    });
  }
};


module.exports = { getAllResources, getResourceById, createResource, deleteResource, updateResource };