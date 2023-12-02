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
		name: 'Prueba Equipo',
		acronym: 'PE',
		PG: 0,
		PE: 0,
		PP: 0,
		GF: 2,
		GC: 1,
		shield: 'Sin escudo',
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

		it('Each team in the response should have all columns[name, acronym, PG, PP, PE, GF, GC, GD, shield, players, coachName, group]', async () => {
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

		it('Should return correct GD', async() =>{
			const firstTeam = response.body[0];
			expect(firstTeam.GD).toBe(newTeam.GF - newTeam.GC);
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
		const wrongTeam = {
			name: 'Prueba Equipo',
			acronym: 'PE',
			PG: 0,
			PE: 0,
			PP: 0,
			GF: 0,
			GC: 0,
			group: 'A',
			shield: 'Sin escudo',
			players: {},
		};

		afterAll(async () => {
			await TeamModel.deleteMany({ name: newTeam.name });
		});

		it('Route "POST" works', async () => {
			const response = await request(app).post('/api/teams').send(newTeam);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Should add new team', async () => {
			const response = await request(app).post('/api/teams').send(newTeam);

			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe(newTeam.name);
		});

		it('Should not add new team', async () => {
			const response = await request(app).post('/api/teams').send(wrongTeam);

			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
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
