require('dotenv').config();
require('./mongoDB.js');
const app = require('../app.js');
const request = require('supertest');
const CoachModel = require('../models/coach.model.js');
const TeamModel = require('../models/team.model.js');

describe('Test on coaches API', () => {
	const newCoach = {
		name: 'Coach Name',
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
		it('Should add new coach', async () => {
			const response = await request(app).post('/api/coaches/register').send(newCoach);
			const message = `El usuario ${newCoach.dni} se ha creado correctamente. Un administrador del torneo se pondrá en contacto con usted para validar el usuario.`;

			expect(response.status).toBe(200);
			expect(response.body.message).toBe(message);
		});
	});

	describe('Login Coach', () => {
		const coachCredentials = {
			loginUsername: newCoach.dni,
			password: newCoach.password
		}

		afterAll(async () => {
			await CoachModel.deleteMany({ name: newCoach.name });
		});

		it('Should return error message if user is not validates', async () => {
			const errorMessage = "El usuario aún no ha sido validado. Un administrador del torneo se pondrá en contacto con usted para validar el usuario.";
			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.status).toBe(401);
			expect(response.body.message).toBe(errorMessage)
		});

		it('Should return error if coach does not exist', async () => {
			const coachCredentials = {
				loginUsername: 'noExiste',
				password: 'cualquierPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.status).toBe(401);
			expect(response.body.message).toBe('El usuario que ha introducido no existe.');
		});

		it('Should return a 401 error if the password is incorrect', async () => {
			const coachCredentials = {
				userName: 'testCoach',
				password: 'wrongPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.status).toBe(401);
			expect(response.body.message).toBe('El usuario que ha introducido no existe.');
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
