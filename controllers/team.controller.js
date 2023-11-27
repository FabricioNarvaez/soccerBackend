'use strict';

const TeamModel = require('../models/team.model');
const { update } = require('./common.controllers');

const getTeams = async (req, res) => {
	try {
		const teams = await TeamModel.aggregate([
			{
				$lookup: {
					from: 'coaches',
					localField: 'coach',
					foreignField: '_id',
					as: 'coachTeam',
				},
			},
			{ $addFields: { 'coachName': { $arrayElemAt: ['$coachTeam.name', 0] } } },
			{ $project: { 'coachTeam': 0 } },
		]);
		res.json(teams);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const createTeam = async (req, res) => {
	try {
		const newTeam = await TeamModel.create(req.body);
		res.json(newTeam);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const updateTeam = async (req, res) => {
	update(req, res, TeamModel);
};

const deleteTeam = async (req, res) => {
	try {
		const teamId = req.params.teamId;
		const teamDelete = await TeamModel.findByIdAndDelete(teamId);
		res.json(teamDelete);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

module.exports = { getTeams, createTeam, updateTeam, deleteTeam };
