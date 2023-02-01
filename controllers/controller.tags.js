const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-rsrc-database";
const collection = "tags";
const { validationResult } = require('express-validator');

const getAllTags = async (req, res) => {
  // #swagger.description = 'Request list of all Tags'
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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

const getTagById = async (req, res) => {
  // #swagger.description = 'Request Tag by ID'
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const resource = await mongodb.getDb().db(database).collection(collection).findOne(
      {
        "_id": ObjectId(req.params.id)
      }
    );

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
      params: req.params
    });
  }
};


const createTag = async (req, res) => {
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Create new tag (Requires user to be logged in)',
                schema: {
                    $name: 'Test tag name',
                    $usage: []
                }
        } */

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne({ title: req.body.title });
    if (alreadyExists) {
      throw new Error(`Tag with title already exists: ${req.body.title}`);
    }

    const tag = {
      name: req.body.name,
      usage: req.body.usage,
    }

    const response = await mongodb.getDb().db(database).collection(collection).insertOne(tag);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error(response.error || 'Some error occurred while creating the tag.');
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      body: req.body
    });
  }

};


const deleteTag = async (req, res) => {
  // #swagger.description = 'Delete existing tag (Requires user to be logged in)'
  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to delete resources, please log in at /login `);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const response = await mongodb.getDb().db(database).collection(collection).deleteOne(
      { _id: new ObjectId(req.params.id) },
      true
    );

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
  /*    #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Update existing tag (Requires user to be logged in)',
              schema: {
                  $name: 'Test tag name',
                    $usage: []
              }
      } */

  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to update tags, please log in at /login `);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // attempt to get previous values for date_created and likes
    let date_created = null;
    let likes = 0;
    const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne({ title: req.body.title });
    if (alreadyExists) {
      date_created = alreadyExists.date_created;
      likes = alreadyExists.likes;
    }

    const tag = {
      name: req.body.name,
      usage: req.body.usage
    }
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: new ObjectId(req.params.id) }, tag);

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
      body: req.body
    });
  }
};


module.exports = { getAllTags, getTagById, createTag, deleteTag, updateTag };