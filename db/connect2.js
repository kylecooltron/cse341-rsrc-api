// this connection will be used by graphql
const dotenv = require('dotenv');
dotenv.config();
const MongooseClient = require('mongoose');

MongooseClient.Promise = global.Promise;

let _db2 = {};

_db2.mongoose = MongooseClient;

const connectDB = () => {
	_db2.mongoose
		.set('strictQuery', false)
		.connect(process.env.MONGODB_URI, {
			dbName: 'self_reliance',
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Connected to the database through Mongoose!');
		})
		.catch((err) => {
			console.log('Cannot connect to the database!', err);
			process.exit();
		});
};

connectDB((err, mongoosedb) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Connected to DB through Mongoose`);
	}
});

module.exports = { connectDB };
