const mongoose = require('mongoose');
const CoachModel = require('../models/coach.model');
const TeamModel = require('../models/team.model');
const { registerUser, loginUser, deleteController } = require('./common.controllers');

const registerCoach = async (req, res) => {
	registerUser(req, res, CoachModel);
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
