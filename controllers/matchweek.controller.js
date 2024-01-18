'use strict';

const MatchweekModel = require('../models/matchweek.model');
const MatchModel = require('../models/match.model');
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

        const data = await MatchweekModel.findById(matchWeekId)
            .populate({
                path: 'matches',
                model: MatchModel,

            }).exec();

        res.status(200).send(data);
    } catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { createMatchweek, deleteMatchweek, updateMatchweek, getMatchweek};
