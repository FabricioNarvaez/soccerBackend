'use strict';

const mongoose = require('mongoose');
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
			{
				$addFields: {
					'coachName': { $arrayElemAt: ['$coachTeam.name', 0] },
					'playersDetails': '$playersInfo',
					'GD': { $subtract: ['$GF', '$GC'] },
					'Pts': {
						$add: [{ $multiply: ['$PG', 3] }, '$PE'],
					},
				},
			},
			{ $project: { 'coachTeam': 0, 'playersInfo': 0, 'players': 0 } },
		]);
		const teamsOnGroups = {
			A: [],
			B: []
		};
		teams.forEach(team =>{
			if(team.group === 'A') teamsOnGroups.A.push(team);
			else teamsOnGroups.B.push(team);
		})
		res.json(teamsOnGroups);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const getTeamById = async (req, res) => {
	try {
		const teamId = new mongoose.Types.ObjectId(req.params.id);
		const teamFounded = await TeamModel.aggregate([
			{
				$match: {
					_id: teamId,
				},
			},
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
			{
				$addFields: {
					'coachName': { $arrayElemAt: ['$coachTeam.name', 0] },
					'playersDetails': '$playersInfo',
					'GD': { $subtract: ['$GF', '$GC'] },
					'Pts': {
						$add: [{ $multiply: ['$PG', 3] }, '$PE'],
					},
				},
			},
			{ $project: { 'coachTeam': 0, 'playersInfo': 0, 'players': 0 } },
		]);
		res.json(teamFounded[0]);
	} catch (error) {
		
	}
}

const createTeam = async (req, res) => {
	try {
		const { name, coach, acronym, shield, group, color } = req.body;

		const newTeamToInsert = {
			name,
			acronym,
			PG: 0,
			PP: 0,
			PE: 0,
			GF: 0,
			GC: 0,
			shield:
				shield
					? shield
					: 'https://res.cloudinary.com/dzd68sxue/image/upload/v1695055988/default_bnoacd.png',
			group,
			coach,
			color
		};

		const insertedTeam = await TeamModel.create(newTeamToInsert);
		res.json(insertedTeam);
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

module.exports = { getTeams, getTeamById, createTeam, updateTeam, deleteTeam };
