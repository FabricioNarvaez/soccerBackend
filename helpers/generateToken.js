const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (user) => {
	const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
	return token;
};

const veryfyToken = async (token) => {
	try {
		const verify = await jwt.verify(token, process.env.JWT_SECRET);
		return verify;
	} catch (error) {
		return error;
	}
};

module.exports = { generateToken, veryfyToken };
