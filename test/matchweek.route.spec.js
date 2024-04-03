require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const MatchModel = require('../models/match.model');
const TeamModel = require('../models/team.model');
const MatchweekModel = require('../models/matchweek.model');

describe('Test on admins API', () => {
	const newMatchweek = {
		'matchweek': 1,
		'date': '2023-01-15T00:00:00.000Z',
	};

	const localTeam = {
		name: 'Local Team',
		acronym: 'TT',
		shield: '',
		players: [],
		group: 'A',
	};

	const visitorTeam = {
		name: 'Visitor Team',
		acronym: 'TT',
		shield: '',
		players: [],
		group: 'A',
	};

	beforeAll(async () => {
		await mongoose.connect(process.env.URL_MONGODB);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe('Create new matchweek', () => {
		afterAll(async () => {
			await MatchweekModel.deleteMany({ matchweek: newMatchweek.matchweek });
		});

		it('Should add new matchweek', async () => {
			const response = await request(app).post('/api/matchweek/create').send(newMatchweek);

			expect(response.status).toBe(200);
			expect(response.body.matchweek).toBe(newMatchweek.matchweek);
			expect(response.body.date).toBe(newMatchweek.date);
		});

		it('Should not add new matchweek', async () => {
			const errorMock = new Error('Error creating matchweek');
			jest.spyOn(MatchweekModel, 'create').mockRejectedValue(errorMock);
			const response = await request(app).post('/api/matchweek/create').send({});

			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
			jest.restoreAllMocks();
		});
	});

	describe('Delete matchweek', () => {
		it('Should deletes matchweek', async () => {
			const matchweek = (await request(app).post('/api/matchweek/create').send(newMatchweek)).body;
			const response = await request(app).delete(`/api/matchweek/${matchweek._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const foundMatchweek = await MatchweekModel.findById(matchweek._id);
			expect(foundMatchweek).toBeNull();
		});

		it('Should fail if matchweek does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/matchweek/${idFail}`);
			expect(response.status).toBe(500);
		});
	});

	describe('Update Matchweek', () => {
		it('Should updates matchweek', async () => {
			const matchweek = await MatchweekModel.create(newMatchweek);
			const updateMatchweek = { 'matchweek': 2 };
			const response = await request(app).put(`/api/matchweek/${matchweek._id}`).send(updateMatchweek);

			expect(response.status).toBe(200);
			expect(response.body.editObject.matchweek).toBe(updateMatchweek.matchweek);
		});
	});

	describe('Get Matchweek by id', () => {
		let matchweek;

		const newMatch = {
			hour: new Date(),
		};

		beforeAll(async () => {
			const localTeamTest = await request(app).post('/api/teams/create').send(localTeam);
			const visitorTeamTest = await request(app).post('/api/teams/create').send(visitorTeam);

			newMatch.localId = localTeamTest.body._id;
			newMatch.visitorId = visitorTeamTest.body._id;
			const createdMatch = await request(app).post('/api/matches/create').send(newMatch);

			let testMatchweek = newMatchweek;
			testMatchweek.matches = [createdMatch.body._id];
			matchweek = await request(app).post('/api/matchweek/create').send(testMatchweek);
		});

		afterAll(async () => {
			await TeamModel.deleteMany({ name: localTeam.name });
			await TeamModel.deleteMany({ name: visitorTeam.name });
			await MatchModel.deleteMany({ hour: newMatch.hour });
			await MatchweekModel.deleteMany({ matchweek: newMatchweek.matchweek });
		});

		it('Get match by id', async () => {
			const foundMatchweek = (await request(app).get(`/api/matchweek/${matchweek.body._id}`).send()).body;
			expect(foundMatchweek._id).toBe(matchweek.body._id);
			expect(foundMatchweek.matches[0].localId.name).toBe(localTeam.name);
			expect(foundMatchweek.matches[0].visitorId.name).toBe(visitorTeam.name);
		});
	});

	describe('Get all Matchweeks ordered by "matchweek" key', () => {
		let firstMatchweek;

		const newMatch = {
			hour: new Date(),
		};

		beforeAll(async () => {
			const localTeamTest = await request(app).post('/api/teams').send(localTeam);
			const visitorTeamTest = await request(app).post('/api/teams').send(visitorTeam);

			newMatch.localId = localTeamTest.body._id;
			newMatch.visitorId = visitorTeamTest.body._id;
			const createdMatch = await request(app).post('/api/matches').send(newMatch);

			let testMatchweek = newMatchweek;
			testMatchweek.matches = [createdMatch.body._id];
			firstMatchweek = await request(app).post('/api/matchweek/create').send(newMatchweek);
			testMatchweek.matchweek = 2;
			firstMatchweek = await request(app).post('/api/matchweek/create').send(testMatchweek);
		});

		afterAll(async () => {
			await TeamModel.deleteMany({ name: localTeam.name });
			await TeamModel.deleteMany({ name: visitorTeam.name });
			await MatchModel.deleteMany({ hour: newMatch.hour });
			await MatchweekModel.deleteMany({ matchweek: 1 });
			await MatchweekModel.deleteMany({ matchweek: newMatchweek.matchweek });
		});

		it('Get all Matchweeks ordered by "matchweek" key', async () => {
			const allMatchweeks = (await request(app).get(`/api/matchweek/all`).send()).body;
			expect(allMatchweeks[0].matchweek).toBe(1);
			expect(allMatchweeks[1].matchweek).toBe(2);
		});
	});
});
