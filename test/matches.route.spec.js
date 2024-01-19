require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const MatchModel = require('../models/match.model');
const TeamModel = require('../models/team.model');

describe('Test on matches API', () => {
	let createdMatch;

	const newLocalTeam = {
		name: 'Local Test Team',
		acronym: 'LTT',
		shield: '',
		players: [],
		group: 'A',
	};

	const newVisitorTeam = {
		name: 'Visitor Test Team',
		acronym: 'VTT',
		shield: '',
		players: [],
		group: 'A',
	};

	const newMatch = {
		hour: new Date(),
	};

	beforeAll(async () => {
		await mongoose.connect(process.env.URL_MONGODB);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe('Create new Match', () => {
		beforeEach(async () => {
			const localTeamTest = await request(app).post('/api/teams').send(newLocalTeam);
			newMatch.localId = localTeamTest.body._id;

			const visitorTeamTest = await request(app).post('/api/teams').send(newVisitorTeam);
			newMatch.visitorId = visitorTeamTest.body._id;
		});

		afterEach(async () => {
			await TeamModel.findByIdAndDelete(newMatch.localId);
			await TeamModel.findByIdAndDelete(newMatch.visitorId);
			await MatchModel.findByIdAndDelete(createdMatch.body._id);
		});

		it('Should create a new match', async () => {
			createdMatch = await request(app).post('/api/matches').send(newMatch);

			expect(createdMatch.status).toBe(200);
			expect(createdMatch.body._id).toBeDefined();
			expect(createdMatch.body.localId).toBe(newMatch.localId);
			expect(createdMatch.body.visitorId).toBe(newMatch.visitorId);
		});
	});

	describe('Get match by id', () => {
		beforeAll(async () => {
			const localTeamTest = await request(app).post('/api/teams').send(newLocalTeam);
			newMatch.localId = localTeamTest.body._id;

			const visitorTeamTest = await request(app).post('/api/teams').send(newVisitorTeam);
			newMatch.visitorId = visitorTeamTest.body._id;

			createdMatch = await request(app).post('/api/matches').send(newMatch);
		});

		afterAll(async () => {
			await TeamModel.findByIdAndDelete(newMatch.localId);
			await TeamModel.findByIdAndDelete(newMatch.visitorId);
			await MatchModel.findByIdAndDelete(createdMatch.body._id);
		});

		it('Route "GET Match" works', async () => {
			const foundMatch = await request(app).get(`/api/matches/${createdMatch.body._id}`).send();
			expect(foundMatch.status).toBe(200);

			const match = foundMatch.body.match;
			expect(match._id).toBe(createdMatch.body._id);
			expect(match.localTeamName).toBe(newLocalTeam.name);
			expect(match.visitorTeamName).toBe(newVisitorTeam.name);
		});
	});

	describe('Get all matches', () => {
		let response;

		beforeAll(async () => {
			const localTeamTest = await request(app).post('/api/teams').send(newLocalTeam);
			newMatch.localId = localTeamTest.body._id;

			const visitorTeamTest = await request(app).post('/api/teams').send(newVisitorTeam);
			newMatch.visitorId = visitorTeamTest.body._id;

			createdMatch = await request(app).post('/api/matches').send(newMatch);
			response = await request(app).get('/api/matches/all').send();
		});

		afterAll(async () => {
			await TeamModel.findByIdAndDelete(newMatch.localId);
			await TeamModel.findByIdAndDelete(newMatch.visitorId);
			await MatchModel.findByIdAndDelete(createdMatch.body._id);
		});

		it('Each match in the response should have all columns[finished, hour, localGoals, localTeamName, visitorGoals, visitorTeamName]', async () => {
			const allMatches = response.body;

			expect(response.status).toBe(200);
			expect(allMatches).toBeInstanceOf(Array);

			const columns = ['finished', 'hour', 'localGoals', 'localTeamName', 'visitorGoals', 'visitorTeamName'];

			allMatches.forEach((match) => {
				columns.forEach((column) => {
					expect(match[column]).toBeDefined();
					switch (column) {
						case 'localTeamName':
						case 'visitorTeamName':
							expect(typeof match[column]).toBe('string');
							break;
						case 'hour':
							expect(new Date(match[column]) instanceof Date).toBe(true);
							break;
						case 'localGoals':
						case 'visitorGoals':
							expect(typeof match[column]).toBe('number');
							break;
						case 'finished':
							expect(typeof match[column]).toBe('boolean');
							break;
						default:
							break;
					}
				});
			});
		});
	});

	describe('Update match by id', () => {
		beforeAll(async () => {
			const localTeamTest = await request(app).post('/api/teams').send(newLocalTeam);
			newMatch.localId = localTeamTest.body._id;

			const visitorTeamTest = await request(app).post('/api/teams').send(newVisitorTeam);
			newMatch.visitorId = visitorTeamTest.body._id;

			createdMatch = await request(app).post('/api/matches').send(newMatch);
		});

		afterAll(async () => {
			await TeamModel.findByIdAndDelete(newMatch.localId);
			await TeamModel.findByIdAndDelete(newMatch.visitorId);
			await MatchModel.findByIdAndDelete(createdMatch.body._id);
		});

		it('Should update match', async () => {
			createdMatch.body.finished = true;
			const response = await request(app).put(`/api/matches/${createdMatch.body._id}`).send(createdMatch.body);

			expect(response.status).toBe(200);
			expect(response.body.editObject._id).toBe(createdMatch.body._id);
			expect(response.body.status).toBe('success');
		});

		it('Should return 500 status if match is not founded', async () => {
			const notValidId = 'not_valid_id';
			const response = await request(app).put(`/api/matches/${notValidId}`).send(createdMatch.body);

			expect(response.status).toBe(500);
		});
	});

	describe('Delete match by id', () => {
		beforeAll(async () => {
			const localTeamTest = await request(app).post('/api/teams').send(newLocalTeam);
			newMatch.localId = localTeamTest.body._id;

			const visitorTeamTest = await request(app).post('/api/teams').send(newVisitorTeam);
			newMatch.visitorId = visitorTeamTest.body._id;
		});

		afterAll(async () => {
			await TeamModel.findByIdAndDelete(newMatch.localId);
			await TeamModel.findByIdAndDelete(newMatch.visitorId);
		});

		it('Should deletes match', async () => {
			const match = (await request(app).post('/api/matches').send(newMatch)).body;
			const response = await request(app).delete(`/api/matches/${match._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const matchFounded = await MatchModel.findById(match._id);
			expect(matchFounded).toBeNull();
		});

		it('Should fail if team does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/matches/${idFail}`);
			expect(response.status).toBe(500);
		});
	});
});
