const CoachModel = require('../models/coach.model');
const { encryptPassword, comparePassword } = require('../helpers/handleBcrypt');
const { generateToken, veryfyToken } = require('../helpers/generateToken');

const controller = {
	registerCoach: async (req, res) => {
		try {
			const newCoach = req.body;
			newCoach.password = await encryptPassword(newCoach.password);

			const insertedCoach = await CoachModel.create(newCoach);
			res.json(insertedCoach);
		} catch (error) {
			res.status(500).json({ error: error });
		}
	},
	logInCoach: async (req, res) => {
		try {
			const { userName, password } = req.body;
			const registeredCoach = await CoachModel.findOne({ userName });

			if (!registeredCoach) {
				return res.status(404).send({ message: 'Coach not found' });
			}

			const checkPassword = await comparePassword(password, registeredCoach.password);

			if (!checkPassword) {
				return res.status(401).send({ message: 'Unauthorized' });
			}

			const tokenSession = await generateToken(registeredCoach);
			res.send({ data: registeredCoach, token: tokenSession });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	},
	checkAuth: async (req, res, next) => {
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
	},
};

module.exports = controller;
