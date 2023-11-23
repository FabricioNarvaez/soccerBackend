const CoachModel = require('../models/coach.model');
const { registerUser, loginUser } = require('./common.controllers');

const controller = {
	registerCoach: async (req, res) => {
		registerUser(req, res, CoachModel);
	},
	logInCoach: async (req, res) => {
		const errorMessage = 'Coach not found';
		loginUser(req, res, CoachModel, errorMessage);
	},
};

module.exports = controller;
