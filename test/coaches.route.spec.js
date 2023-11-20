require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const CoachModel = require('../models/coach.model');
const { encryptPassword } = require('../helpers/handleBcrypt');

describe('Test on teams API', () => {
	const newCoach = {
		userName: 'testCoach',
		password: 'passwordCoach',
		name: 'Test Coach',
	};

	beforeAll(async () => {
		await mongoose.connect(process.env.URL_MONGODB);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe('POST /api/coaches/register', () => {
		afterAll(async () => {
			await CoachModel.deleteMany({ userName: 'testCoach' });
		});

		it('Route "POST" works', async () => {
			const response = await request(app).post('/api/coaches/register').send(newCoach);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Should add new coach', async () => {
			const response = await request(app).post('/api/coaches/register').send(newCoach);

			expect(response.body._id).toBeDefined();
			expect(response.body.userName).toBe(newCoach.userName);
		});
	});

	describe('POST /api/coaches/login', () => {
		let coach;

		beforeAll(async () => {
			newCoach.password = await encryptPassword(newCoach.password);
			coach = await CoachModel.create(newCoach);
		});

		afterAll(async () => {
			await CoachModel.findByIdAndDelete(coach._id);
		});

		it('Debería devolver un token al autenticar un coach existente', async () => {
			const coachCredentials = {
				userName: 'testCoach',
				password: 'passwordCoach',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty('data');
			expect(response.body).toHaveProperty('token');
		});

		it('Debería devolver un error 404 si el coach no existe', async () => {
			const coachCredentials = {
				userName: 'noExiste',
				password: 'cualquierPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.statusCode).toBe(404);
			expect(response.body).toHaveProperty('message', 'Coach not found');
		});

		it('Debería devolver un error 401 si la contraseña es incorrecta', async () => {
			const coachCredentials = {
				userName: 'testCoach',
				password: 'wrongPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.statusCode).toBe(401);
			expect(response.body).toHaveProperty('message', 'Unauthorized');
		});
	});
});
