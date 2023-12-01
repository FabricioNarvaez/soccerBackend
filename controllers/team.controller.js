'use strict';

const TeamModel = require('../models/team.model');

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
		const { name, coach, acronym, shield, group } = req.body;

		const newTeamToInsert = {
			name,
			acronym,
			PG: 0,
			PP: 0,
			PE: 0,
			GF: 0,
			GC: 0,
			shield:
				shield !== ''
					? shield
					: 'https://res.cloudinary.com/dzd68sxue/image/upload/v1695055988/default_bnoacd.png',
			group,
			coach,
		};

		const insertedTeam = await TeamModel.create(newTeamToInsert);
		res.json(insertedTeam);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const updateTeam = async (req, res) => {
	try {
		const teamId = req.params.teamId;
		const updateObject = req.body;
		const teamEdit = await TeamModel.findByIdAndUpdate(teamId, updateObject, { new: true });
		res.json(teamEdit);
	} catch (error) {
		res.status(500).json({ error: error });
	}
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
