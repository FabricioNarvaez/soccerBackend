require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const AdminModel = require('../models/admin.model');

describe('Test on admins API', () => {
	const newAdmin = {
		userName: 'testAdmin',
		password: 'password',
		name: 'Test Admin',
	};

	beforeAll(async () => {
		await mongoose.connect(process.env.URL_MONGODB);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe('POST /api/admin/register', () => {
		afterAll(async () => {
			await AdminModel.deleteMany({ userName: 'testAdmin' });
		});

		it('Route "POST" works', async () => {
			const response = await request(app).post('/api/admins/register').send(newAdmin);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});
	});
});
