const { veryfyToken } = require('../helpers/generateToken');

const checkAuth = async (req, res, next) => {
	try {
		const { token } = req.body;
		const tokenData = await veryfyToken(token);
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
