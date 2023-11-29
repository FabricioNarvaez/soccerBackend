const CoachModel = require('../models/coach.model');
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

module.exports = { registerCoach, logInCoach, deleteCoach };
