require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const CoachModel = require('../models/coach.model');

describe('Test on coaches API', () => {
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
			coach = (await request(app).post('/api/coaches/register').send(newCoach)).body;
		});

		afterAll(async () => {
			await CoachModel.findByIdAndDelete(coach._id);
		});

		it('Should return a token when authenticating an existing coach', async () => {
			const coachCredentials = ({ userName, password } = newCoach);
			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty('data');
			expect(response.body).toHaveProperty('token');
		});

		it('Should return a 404 error if coach does not exist', async () => {
			const coachCredentials = {
				userName: 'noExiste',
				password: 'cualquierPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.statusCode).toBe(404);
			expect(response.body).toHaveProperty('message', 'Coach not found');
		});

		it('Should return a 401 error if the password is incorrect', async () => {
			const coachCredentials = {
				userName: 'testCoach',
				password: 'wrongPassword',
			};

			const response = await request(app).post('/api/coaches/login').send(coachCredentials);

			expect(response.statusCode).toBe(401);
			expect(response.body).toHaveProperty('message', 'Unauthorized');
		});
	});

	describe('DELETE /api/coaches', () => {
		it('Should deletes coach', async () => {
			const coach = (await request(app).post('/api/admins/register').send(newCoach)).body;
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
