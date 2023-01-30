function technologyModel(req, p_date_created) {
	const model = {
		name: req.body.name,
		description: req.body.description,
		category: req.body.category,
		date_created: p_date_created,
		last_modified: new Date(),
	};
	return model;
}

module.exports = { technologyModel };
