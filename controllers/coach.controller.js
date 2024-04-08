const mongoose = require('mongoose');
const CoachModel = require('../models/coach.model');
const TeamModel = require('../models/team.model');
const { loginUser, deleteController } = require('./common.controllers');
const { encryptPassword, comparePassword } = require('../helpers/handleBcrypt');

const registerCoach = async (req, res) => {
	try {
		const newCoach = req.body;
		newCoach.password = await encryptPassword(newCoach.password);
		newCoach.validated = false;

		const { dni, email } = newCoach;
		const userExists = await CoachModel.findOne({
			$or: [{ dni }, { email }]
		});
		if(userExists){
			const repeatUserOrEmail = userExists.dni === newCoach.dni ? "usuario" : "email";
			const message = `El ${repeatUserOrEmail} que ha introducido ya existe. Pruebe con un ${repeatUserOrEmail} diferente.`
			return res.status(409).json({ message });
		}

		await CoachModel.create(newCoach);
		const message = `El usuario ${newCoach.dni} se ha creado correctamente. Un administrador del torneo se pondrá en contacto con usted para validar el usuario.`;
		res.status(200).json({ message });
	} catch (error) {
		res.status(500).json({ error });
	}
};

const logInCoach = async (req, res) => {
	const errorMessage = 'Coach not found';
	loginUser(req, res, CoachModel, errorMessage);
};

const deleteCoach = async (req, res) => {
	deleteController(req, res, CoachModel);
};

const getTeamInfo = async (req, res) => {
	try {
		const coachId = new mongoose.Types.ObjectId(req.params.id);
		const coachTeam = await TeamModel.aggregate([
			{
				$match: {
					coach: coachId,
				},
			},
			{
				$lookup: {
					from: 'players',
					localField: 'players',
					foreignField: '_id',
					as: 'playersInfo',
				},
			},
			{
				$addFields: {
					'playersDetails': '$playersInfo',
					'GD': { $subtract: ['$GF', '$GC'] },
					'Pts': {
						$add: [{ $multiply: ['$PG', 3] }, '$PE'],
					},
				},
			},
			{ $project: { 'playersInfo': 0, 'players': 0 } },
		]);
		res.json(coachTeam[0]);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

module.exports = { registerCoach, logInCoach, deleteCoach, getTeamInfo };
