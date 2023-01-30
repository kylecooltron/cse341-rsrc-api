// run in terminal to create new collection
// and list existing collections in database
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGODB_URI;

const databaseName = 'cse341-rsrc-database';
const collectionName = 'technologies';

MongoClient.connect(url)
	.then((client) => {
		const dbo = client.db(databaseName);

		// create new collection in specified databaseName variable
		dbo.createCollection(collectionName, function (err, res) {
			if (err) throw err;
			console.log('Collection created!');
		});

		// list collections within the databaseName variable
		dbo.listCollections().toArray(function (err, cols) {
			if (!err) {
				console.log('Collections:');
				cols.forEach((col) => {
					console.log(`- ${col.name}`);
				});
			}
		});
		client.close();
	})
	.catch((err) => {
		console.log(err.Message);
	});
