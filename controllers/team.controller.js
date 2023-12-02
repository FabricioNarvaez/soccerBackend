'use strict';

const TeamModel = require('../models/team.model');
const { updateController, deleteController } = require('./common.controllers');

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
			{
				$lookup: {
				  from: 'players',
				  localField: 'players',
				  foreignField: '_id',
				  as: 'playersInfo',
				},
			},
			{ $addFields: { 
				'coachName': { $arrayElemAt: ['$coachTeam.name', 0] },
				'playersDetails': '$playersInfo',
				'GD': { $subtract: ['$GF', '$GC'] },
				'Pts': {
					$add: [
					  { $multiply: ['$PG', 3] },
					  '$PE',
					]
				},
			}},
			{ $project: { 'coachTeam': 0, 'playersInfo': 0, 'players': 0 } },
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
	updateController(req, res, TeamModel);
};

const deleteTeam = async (req, res) => {
	deleteController(req, res, TeamModel);
};

module.exports = { getTeams, createTeam, updateTeam, deleteTeam };
