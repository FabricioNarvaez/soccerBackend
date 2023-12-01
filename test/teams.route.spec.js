require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const TeamModel = require('../models/team.model');
const CoachModel = require('../models/coach.model');

describe('Test on teams API', () => {
	const coachTeam = {
		userName: 'testCoach',
		password: 'passwordCoach',
		name: 'Test Coach',
	};

	const newTeam = {
		name: 'Test Team',
		acronym: 'TT',
		PG: 0,
		PE: 0,
		PP: 0,
		GF: 0,
		GC: 0,
		shield: 'Without shield',
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

		beforeEach(async () => {
			response = await request(app).get('/api/teams').send();
		});

		afterAll(async () => {
			await CoachModel.deleteMany({ userName: coachTeam.userName });
			await TeamModel.deleteMany({ name: newTeam.name });
		});

		it('Route "GET" works', async () => {
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Request returns an array of teams', () => {
			expect(response.body).toBeInstanceOf(Array);
		});

		it('Each team in the response should have all columns[name, acronym, PG, PP, PE, GF, GC, shield, players, coachName, group]', async () => {
			const teamcoachTest = await request(app).post('/api/coaches/register').send(coachTeam);
			newTeam.coach = teamcoachTest.body._id;

			await request(app).post('/api/teams').send(newTeam);
			response = await request(app).get('/api/teams').send();

			expect(response.body).toBeInstanceOf(Array);

			const columns = [
				'name',
				'acronym',
				'PG',
				'PP',
				'PE',
				'GF',
				'GC',
				'shield',
				'players',
				'coachName',
				'group',
			];

			response.body.forEach((team) => {
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
							expect(typeof team[column]).toBe('number');
							break;
						case 'players':
							expect(typeof team[column]).toBe('object');
							break;

						default:
							break;
					}
				});
			});
		});
	});

	describe('POST /api/teams', () => {
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

		it('Should add new team and change shield if it is empty', async () => {
			const emptyShieldTeam = {
				name: 'Test Team',
				acronym: 'TT',
				group: 'A',
				shield: '',
				players: {},
			};
			const response = await request(app).post('/api/teams').send(emptyShieldTeam);

			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe(newTeam.name);
			expect(response.body.shield).toBe(
				'https://res.cloudinary.com/dzd68sxue/image/upload/v1695055988/default_bnoacd.png',
			);
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
			const update = { name: 'Team Updated' };
			const response = await request(app).put(`/api/teams/${team._id}`).send(update);

			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe(update.name);
		});
	});

	describe('DELETE /api/teams', () => {
		it('Should deleats team', async () => {
			const team = await TeamModel.create(newTeam);
			const response = await request(app).delete(`/api/teams/${team._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const foundTrip = await TeamModel.findById(team._id);
			expect(foundTrip).toBeNull();
		});

		it('Should fail if team does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/teams/${idFail}`);
			expect(response.status).toBe(500);
		});
	});
});
