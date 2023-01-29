const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-rsrc-database";
const collection = "resources";
const { validationResult } = require('express-validator');

const getAllResources = async (req, res) => {
  // #swagger.description = 'Request list of all resources'
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

const getResourceById = async (req, res) => {
  // #swagger.description = 'Request resource by ID'
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
        error: `Resource not found with id ${req.params.id}`,
      });
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params
    });
  }
};


const createResource = async (req, res) => {
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Create new resource (Requires user to be logged in)',
                schema: {
                    $title: 'Test Resource Title 1.0',
                    $subject: 'Test Resource Subject',
                    $description: 'description',
                    $lesson_numbers: [],
                    $links: [],
                    $search_tags: [],
                    $contributing_students: [],
                    $featured_technologies: [],
                }
        } */

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne({ title: req.body.title });
    if (alreadyExists) {
      throw new Error(`Resource with title already exists: ${req.body.title}`);
    }

    const resource = {
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description,
      likes: 0,
      date_created: new Date(),
      last_modified: new Date(),
      lesson_numbers: req.body.lesson_numbers,
      links: req.body.links,
      search_tags: req.body.search_tags,
      contributing_students: req.body.contributing_students,
      featured_technologies: req.body.featured_technologies
    }

    // const resource = constructResourceFromBody(req.body)
    const response = await mongodb.getDb().db(database).collection(collection).insertOne(resource);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error(response.error || 'Some error occurred while creating the resource.');
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      body: req.body
    });
  }

};


const deleteResource = async (req, res) => {
  // #swagger.description = 'Delete existing resource (Requires user to be logged in)'
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

const updateResource = async (req, res) => {
  /*    #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Update existing resource (Requires user to be logged in)',
              schema: {
                  $title: 'Test Resource Title 1.0',
                  $subject: 'Test Resource Subject',
                  $description: 'description',
                  $lesson_numbers: [],
                  $links: [],
                  $search_tags: [],
                  $contributing_students: [],
                  $featured_technologies: [],
              }
      } */

  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to update resources, please log in at /login `);
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

    const resource = {
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description,
      likes: likes,
      date_created: date_created,
      last_modified: new Date(),
      lesson_numbers: req.body.lesson_numbers,
      links: req.body.links,
      search_tags: req.body.search_tags,
      contributing_students: req.body.contributing_students,
      featured_technologies: req.body.featured_technologies
    }
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: new ObjectId(req.params.id) }, resource);

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


module.exports = { getAllResources, getResourceById, createResource, deleteResource, updateResource };