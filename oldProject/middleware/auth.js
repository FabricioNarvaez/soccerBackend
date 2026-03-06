const { verifyToken } = require('../helpers/generateToken');

const checkAuth = async (req, res, next) => {
	try {
		const { token } = req.body;
		const tokenData = await verifyToken(token);
		if (tokenData.id) {
			next();
		} else {
			res.status(401).send({ message: 'Unauthorized' });
		}
	} catch (error) {
		res.status(401).send({ message: 'Unauthorized' });
	}
};

module.exports = { checkAuth };
