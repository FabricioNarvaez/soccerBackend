require('dotenv').config();
require('./mongoDB.js');
const app = require('../app.js');
const request = require('supertest');
const CoachModel = require('../models/coach.model.js');
const TeamModel = require('../models/team.model.js');

describe('Test on coaches API', () => {
	const newCoach = {
		name: 'Test Coach',
		dni: 'testCoachDNI',
		team: 'cancheritos',
		email: 'cancheritos@gmail.com',
		phoneNumber: '000000000',
		password: 'passwordCoach'
	};

	const newTeam = {
		name: 'Test Team',
		acronym: 'TT',
		shield: '',
		players: [],
		group: 'A',
	};

	describe('Create Coach', () => {
		afterAll(async () => {
			await CoachModel.deleteMany({ name: newCoach.name });
		});

		it('Should add new coach', async () => {
			const response = await request(app).post('/api/coaches/register').send(newCoach);
			const message = `El usuario ${newCoach.dni} se ha creado correctamente. Un administrador del torneo se pondrá en contacto con usted para validar el usuario.`;

			expect(response.status).toBe(200);
			expect(response.body.message).toBe(message);
		});
	});

	describe('Get Coach Team Info', () => {
		let coach;

		beforeAll(async () => {
			coach = (await request(app).post('/api/coaches/register').send(newCoach)).body;
		});

		afterAll(async () => {
			await TeamModel.deleteMany({ name: newTeam.name });
			await CoachModel.deleteMany({ name: newCoach.name });
		});

		it('Should return coach team info', async () => {
			newTeam.coach = coach._id;
			await request(app).post('/api/teams/create').send(newTeam);
			const teamInfo = await request(app).get(`/api/coaches/team/${coach._id}`).send();

			const columns = [
				'_id',
				'name',
				'acronym',
				'PG',
				'PP',
				'PE',
				'GF',
				'GC',
				'shield',
				'playersDetails',
				'group',
			];

			expect(teamInfo.body.name).toBe(newTeam.name);
			columns.forEach((key) => {
				expect(teamInfo.body[key]).toBeDefined();
			});
		});
	});

	describe('Login Coach', () => {
		let coach;

		beforeAll(async () => {
			coach = (await request(app).post('/api/coaches/register').send(newCoach)).body;
		});

		afterAll(async () => {
			await CoachModel.deleteMany({ name: newCoach.name });
		});

		it('Should return a token when authenticating an existing coach', async () => {
			const coachCredentials = ({ userName, password } = newCoach);
			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('data');
			expect(response.body).toHaveProperty('token');
		});

		it('Should return a 401 error if coach does not exist', async () => {
			const coachCredentials = {
				userName: 'noExiste',
				password: 'cualquierPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty('message', 'Coach not found');
		});

		it('Should return a 401 error if the password is incorrect', async () => {
			const coachCredentials = {
				userName: 'testCoach',
				password: 'wrongPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty('message', 'Unauthorized');
		});
	});

	describe('Delete Coach', () => {
		it('Should deletes coach', async () => {
			const coach = (await request(app).post('/api/coaches/register').send(newCoach)).body;
			const response = await request(app).delete(`/api/coaches/${coach._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const foundCoach = await CoachModel.findById(coach._id);
			expect(foundCoach).toBeNull();
		});

		it('Should fail if coach does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/coaches/${idFail}`);
			expect(response.status).toBe(500);
		});
	});
});
