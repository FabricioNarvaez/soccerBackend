const AdminModel = require('../models/admin.model');
const { registerUser, loginUser } = require('./common.controllers');

const registerAdmin = async (req, res) => {
	registerUser(req, res, AdminModel);
};

const logInAdmin = async (req, res) => {
	const errorMessage = 'Admin not found';
	loginUser(req, res, AdminModel, errorMessage);
};

module.exports = { registerAdmin, logInAdmin };
