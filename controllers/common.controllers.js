const { encryptPassword, comparePassword } = require('../helpers/handleBcrypt');
const { generateToken } = require('../helpers/generateToken');

const registerUser = async (req, res, Model) => {
	try {
		const newUser = req.body;
		newUser.password = await encryptPassword(newUser.password);

		const createdUser = await Model.create(newUser);
		res.json(createdUser);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const loginUser = async (req, res, Model, errorMessage) => {
	try {
		const { userName, password } = req.body;
		const user = await Model.findOne({ userName });
		if (!user) {
			return res.status(401).send({ message: errorMessage });
		}

		const checkPassword = await comparePassword(password, user.password);
		if (!checkPassword) {
			return res.status(401).send({ message: 'Unauthorized' });
		}

		const tokenSession = await generateToken(user);
		res.send({ data: user, token: tokenSession });
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const deleteController = async (req, res, Model, userId) => {
	try {
		const userDeleted = await Model.findByIdAndDelete(userId);
		res.json(userDeleted);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const updateController = async (req, res, Model) => {
	try {
		const objectId = req.params.id;
		const updateObject = req.body;
		const editObject = await Model.findByIdAndUpdate(objectId, updateObject, { new: true }).lean();
		if(editObject){
			res.status(200).send({
				status: 'success',
				editObject,
			});
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

module.exports = { registerUser, loginUser, deleteController, updateController };
