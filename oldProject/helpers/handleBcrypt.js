const bcrypt = require('bcryptjs');

const encryptPassword = async (password) => {
	const hash = await bcrypt.hash(password, 10);
	return hash;
};

const comparePassword = async (password, passwordDB) => {
	const match = await bcrypt.compare(password, passwordDB);
	return match;
};

module.exports = { encryptPassword, comparePassword };
