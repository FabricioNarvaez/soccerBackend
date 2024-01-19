'use strict';

const TeamModel = require('../models/team.model');
const MatchModel = require('../models/match.model');
const MatchweekModel = require('../models/matchweek.model');
const { updateController, deleteController } = require('./common.controllers');

const createMatchweek = async (req, res) => {
	try {
		const { matchweek, date, matches} = req.body;
		const newMatchWeekToInsert = {
			matchweek,
			date,
			matches,
		};
		const insertedMatchWeek = await MatchweekModel.create(newMatchWeekToInsert);
		res.json(insertedMatchWeek);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const deleteMatchweek = async (req, res) => {
	deleteController(req, res, MatchweekModel);
};

const updateMatchweek = async (req, res) => {
	updateController(req, res, MatchweekModel);
};

const getMatchweek = async (req, res) => {
    try {
        const matchWeekId = req.params.id;

        const matchWeekFounded = await MatchweekModel.findById(matchWeekId)
            .populate({
                path: 'matches',
                model: MatchModel,
				populate: {
					path: 'localId visitorId',
					model: TeamModel,
					select: 'name'
				}
            }).exec();

        res.status(200).send(matchWeekFounded);
    } catch (error) {
		res.status(500).send(error);
	}
};

module.exports = { createMatchweek, deleteMatchweek, updateMatchweek, getMatchweek};
