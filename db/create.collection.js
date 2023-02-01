// run in terminal to create new collection
// and list existing collections in database
// > node db/create.collection.js
const mongodb = require('./connect');

mongodb.initDb((err, mongodb) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to DB!');
		const databaseName = 'cse341-rsrc-database';
		const collectionName = 'technologies';
		createCollection(databaseName, collectionName);
		listCollections(databaseName);
	}
});

async function listCollections(dbName) {
	const dbo = await mongodb.getDb().db(dbName);
	dbo.listCollections().toArray(function (err, cols) {
		if (!err) {
			console.log('Collections:');
			cols.forEach((col) => {
				console.log(`- ${col.name}`);
			});
		}
	});
}

async function createCollection(dbName, colName) {
	const dbo = await mongodb.getDb().db(dbName);
	dbo.createCollection(colName, function (err, res) {
		if (err) throw err;
		console.log('Collection created!');
	});
}
