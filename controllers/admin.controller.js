const AdminModel = require('../models/admin.model');
const { registerUser, loginUser, deleteController } = require('./common.controllers');

const registerAdmin = async (req, res) => {
	registerUser(req, res, AdminModel);
};

const logInAdmin = async (req, res) => {
	const errorMessage = 'Admin not found';
	loginUser(req, res, AdminModel, errorMessage);
};

const deleteAdmin = async (req, res) => {
	const adminId = req.params.adminId;
	deleteController(req, res, AdminModel, adminId);
};

module.exports = { registerAdmin, logInAdmin, deleteAdmin };
