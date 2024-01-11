const MatchModel = require('../models/match.model');
const mongoose = require('mongoose');

const getMatch = async (req, res) => {
	try {
		const matchId = req.params.id;

		const foundMatch = await MatchModel.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(matchId),
				},
			},
			{
				$lookup: {
					from: 'teams',
					localField: 'localId',
					foreignField: '_id',
					as: 'localTeam',
				},
			},
			{
				$lookup: {
					from: 'teams',
					localField: 'visitorId',
					foreignField: '_id',
					as: 'visitorTeam',
				},
			},
			{
				$addFields: {
					'localTeamName': { $arrayElemAt: ['$localTeam.name', 0] },
					'visitorTeamName': { $arrayElemAt: ['$visitorTeam.name', 0] },
				},
			},
			{
				$project: {
					'localTeam': 0,
					'visitorTeam': 0,
					'localId': 0,
					'visitorId': 0,
				},
			},
			{
				$limit: 1,
			},
		]);
		res.status(200).send({
			status: 'success',
			match: foundMatch[0],
		});
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const getMatches = async (req, res) => {
	try {
		const foundMatches = await MatchModel.aggregate([
			{
				$lookup: {
					from: 'teams',
					localField: 'localId',
					foreignField: '_id',
					as: 'localTeam',
				},
			},
			{
				$lookup: {
					from: 'teams',
					localField: 'visitorId',
					foreignField: '_id',
					as: 'visitorTeam',
				},
			},
			{
				$addFields: {
					'localTeamName': { $arrayElemAt: ['$localTeam.name', 0] },
					'visitorTeamName': { $arrayElemAt: ['$visitorTeam.name', 0] },
				},
			},
			{
				$project: {
					'localTeam': 0,
					'visitorTeam': 0,
					'localId': 0,
					'visitorId': 0,
				},
			},
		]);
		res.json(foundMatches);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const deleteMatch = async (req, res) => {
	try {
		const matchId = req.params.id;
		const deletedMatch = await MatchModel.findByIdAndDelete(matchId);
		res.json(deletedMatch);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const saveMatch = async (req, res) => {
	try {
		const { hour, localId, visitorId } = req.body;

		const newMatch = {
			hour,
			localId,
			visitorId,
			localGoals: 0,
			visitorGoals: 0,
			finished: false,
		};

		const insertedMatch = await MatchModel.create(newMatch);
		res.json(insertedMatch);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const updateMatch = async (req, res) => {
	try {
		const matchId = req.params.id;
		const updatedMatch = req.body;
		const editedMatch = await MatchModel.findByIdAndUpdate(matchId, updatedMatch, { new: true }).lean();
		if (editedMatch) {
			res.status(200).send({
				status: 'success',
				editedMatch,
			});
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

module.exports = { getMatch, getMatches, deleteMatch, saveMatch, updateMatch };
