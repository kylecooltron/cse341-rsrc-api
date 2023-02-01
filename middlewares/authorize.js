const checkAccess = (req, res, next) => {
	if (!req.oidc.isAuthenticated()) {
		res.status(401).send({
			success: false,
			message: 'User Not Authorised to perform this operation',
			login_url: 'https://cse341-rsrc-api.onrender.com/login',
		});
	} else {
		next();
	}
};

module.exports = { checkAccess };
