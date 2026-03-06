require('dotenv').config();
require('./mongoDB.js');
const app = require('../app');
const request = require('supertest');
const AdminModel = require('../models/admin.model');

describe('Test on admins API', () => {
	const newAdmin = {
		userName: 'testAdmin',
		password: 'password',
		name: 'Test Admin',
	};

	describe('Check create new admin', () => {
		afterAll(async () => {
			await AdminModel.deleteMany({ userName: 'testAdmin' });
		});

		it('Should add new admin', async () => {
			const response = await request(app).post('/api/admins/register').send(newAdmin);

			expect(response.status).toBe(200);
			expect(response.body._id).toBeDefined();
			expect(response.body.userName).toBe(newAdmin.userName);
		});
	});

	describe('Check Login admin', () => {
		let admin;

		beforeAll(async () => {
			admin = (await request(app).post('/api/admins/register').send(newAdmin)).body;
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

		it('Should return a 401 error if admin does not exist', async () => {
			const adminCredentials = {
				userName: 'noExiste',
				password: 'password',
			};

			const response = await request(app).post('/api/admins/login').send(adminCredentials);

			expect(response.statusCode).toBe(401);
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

	describe('Check delete admin', () => {
		it('Should deletes admin', async () => {
			const admin = (await request(app).post('/api/admins/register').send(newAdmin)).body;
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
