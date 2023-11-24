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

	describe('POST /api/admins/register', () => {
		afterAll(async () => {
			await AdminModel.deleteMany({ userName: 'testAdmin' });
		});

		it('Route "POST" works', async () => {
			const response = await request(app).post('/api/admins/register').send(newAdmin);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

		it('Should add new admin', async () => {
			const response = await request(app).post('/api/admins/register').send(newAdmin);

			expect(response.body._id).toBeDefined();
			expect(response.body.userName).toBe(newAdmin.userName);
		});
	});

	describe('POST /api/admins/login', () => {
		let admin;

		beforeAll(async () => {
			const response = await request(app).post('/api/admins/register').send(newAdmin);
			admin = response.body;
		});

		afterAll(async () => {
			await AdminModel.findByIdAndDelete(admin._id);
		});

		it('Should return a token when authenticating an existing admin', async () => {
			const adminCredentials = ({ userName, password } = newAdmin);

			const response = await request(app).post('/api/admins/login').send(adminCredentials);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty('data');
			expect(response.body).toHaveProperty('token');
		});

		it('Should return a 404 error if admin does not exist', async () => {
			const adminCredentials = {
				userName: 'noExiste',
				password: 'password',
			};

			const response = await request(app).post('/api/admins/login').send(adminCredentials);

			expect(response.statusCode).toBe(404);
			expect(response.body).toHaveProperty('message', 'Admin not found');
		});

		it('Should return a 401 error if the password is incorrect', async () => {
			const adminCredentials = {
				userName: 'testAdmin',
				password: 'wrong',
			};

			const response = await request(app).post('/api/admins/login').send(adminCredentials);

			expect(response.statusCode).toBe(401);
			expect(response.body).toHaveProperty('message', 'Unauthorized');
		});
	});

	describe('DELETE /api/admins', () => {
		it('Should deletes admin', async () => {
			const admin = await AdminModel.create(newAdmin);
			const response = await request(app).delete(`/api/admins/${admin._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const foundAdmin = await AdminModel.findById(admin._id);
			expect(foundAdmin).toBeNull();
		});

		it('Should fail if admin does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/admins/${idFail}`);
			expect(response.status).toBe(500);
		});
	});
});
