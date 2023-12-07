require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const TeamModel = require('../models/team.model');
const CoachModel = require('../models/coach.model');
const PlayerModel = require('../models/players.model');

describe('Test on teams API', () => {
	const coachTeam = {
		userName: 'testCoach',
		password: 'passwordCoach',
		name: 'Test Coach',
	};

	const newPlayer = {
		name: 'PlayerTest',
		playerNumber: 0,
		alias: 'Test',
	};

	const newTeam = {
		name: 'Test Team',
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

	describe('GET /api/teams', () => {
		let response;

		beforeAll(async () => {
			const teamCoachTest = await request(app).post('/api/coaches/register').send(coachTeam);
			newTeam.coach = teamCoachTest.body._id;

			const createdPlayer = await request(app).post('/api/players').send(newPlayer);
			newTeam.players.push(createdPlayer.body._id);
			
			await request(app).post('/api/teams').send(newTeam);
			response = await request(app).get('/api/teams').send();
		});

		afterAll(async () => {
			await CoachModel.deleteMany({ userName: coachTeam.userName });
			await TeamModel.deleteMany({ name: newTeam.name });
			await PlayerModel.deleteMany({ name: newPlayer.name });
		});

		it('Route "GET" works', async () => {
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Each team in the response should have all columns[name, acronym, PG, PP, PE, GF, GC, GD, Pts, shield, players, coachName, group]', async () => {
			const allTeams = (response).body;

			expect(allTeams).toBeInstanceOf(Array);

			const columns = [
				'name',
				'acronym',
				'PG',
				'PP',
				'PE',
				'GF',
				'GC',
				'GD',
				'Pts',
				'shield',
				'playersDetails',
				'coachName',
				'group',
			];

			allTeams.forEach((team) => {
				columns.forEach((column) => {
					expect(team[column]).toBeDefined();
					switch (column) {
						case 'name':
						case 'acronym':
						case 'shield':
						case 'coachName':
							expect(typeof team[column]).toBe('string');
							break;
						case 'PG':
						case 'PP':
						case 'PE':
						case 'GF':
						case 'GC':
						case 'GD':
						case 'Pts':
							expect(typeof team[column]).toBe('number');
							break;
						case 'playersDetails':
							expect(typeof team[column]).toBe('object');
							break;

						default:
							break;
					}
				});
			});
		});

		it('Should return correct GD and Pts', async() =>{
			const firstTeam = response.body[0];
			expect(firstTeam.GD).toBe(newTeam.GF - newTeam.GC);
			expect(firstTeam.Pts).toBe(newTeam.PG * 3 + newTeam.PE);
		})

		it('Should return players info', async () => {
			const allTeams = (response).body;
			allTeams.forEach((team)=>{
				expect(team.players).toBe(undefined);
				expect(team.playersDetails).toBeInstanceOf(Array);
			})
		});
	});

	describe('POST /api/teams', () => {
		afterEach(async () => {
			await TeamModel.deleteMany({ name: newTeam.name });
		});

		it('Route "POST" works', async () => {
			const response = await request(app).post('/api/teams').send(newTeam);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Should add new team with default shield if it is empty', async () => {
			const response = await request(app).post('/api/teams').send(newTeam);

			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe(newTeam.name);
			expect(response.body.shield).toBe(
				'https://res.cloudinary.com/dzd68sxue/image/upload/v1695055988/default_bnoacd.png',
			);
		});

		it('Should add new team with custom shield', async () => {
			newTeam.shield = 'https://customShield.com/sample.png';
			const response = await request(app).post('/api/teams').send(newTeam);

			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe(newTeam.name);
			expect(response.body.shield).toBe('https://customShield.com/sample.png');
		});

		it('Should not add new team', async () => {
			const errorMock = new Error('Error creating team');
			jest.spyOn(TeamModel, 'create').mockRejectedValue(errorMock);
			const response = await request(app).post('/api/teams').send({});

			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
			jest.restoreAllMocks();
		});
	});

	describe('PUT /api/teams', () => {
		let team;

		beforeEach(async () => {
			team = await TeamModel.create(newTeam);
		});

		afterEach(async () => {
			await TeamModel.findByIdAndDelete(team._id);
		});

		it('Route "PUT" works', async () => {
			const update = { name: 'Team Updated' };
			const response = await request(app).put(`/api/teams/${team._id}`).send(update);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Should updates team', async () => {
			const updateTeam = { name: 'Team Updated' };
			const response = await request(app).put(`/api/teams/${team._id}`).send(updateTeam);

			expect(response.status).toBe(200);
			expect(response.body.editObject.name).toBe(updateTeam.name);
		});
	});

	describe('DELETE /api/teams/:id', () => {
		it('Should deletes team', async () => {
			const team = (await request(app).post('/api/teams').send(newTeam)).body;
			const response = await request(app).delete(`/api/teams/${team._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const foundTeam = await TeamModel.findById(team._id);
			expect(foundTeam).toBeNull();
		});

		it('Should fail if team does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/teams/${idFail}`);
			expect(response.status).toBe(500);
		});
	});
});
