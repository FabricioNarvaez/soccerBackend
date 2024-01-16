require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const MatchweekModel = require('../models/matchweek.model');

describe('Test on admins API', () => {
	const newMatchweek = {
        "matchweek": 1,
        "date": "2023-01-15T00:00:00.000Z"
      };

	beforeAll(async () => {
		await mongoose.connect(process.env.URL_MONGODB);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe('Create new matchweek', () => {
		afterAll(async () => {
			await MatchweekModel.deleteMany({ matchweek: newMatchweek.matchweek });
		});

		it('Should add new matchweek', async () => {
			const response = await request(app).post('/api/matchweek/create').send(newMatchweek);

			expect(response.status).toBe(200);
            expect(response.body.matchweek).toBe(newMatchweek.matchweek);
            expect(response.body.date).toBe(newMatchweek.date);
		});

		it('Should not add new matchweek', async () => {
			const errorMock = new Error('Error creating matchweek');
			jest.spyOn(MatchweekModel, 'create').mockRejectedValue(errorMock);
			const response = await request(app).post('/api/matchweek/create').send({});

			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
			jest.restoreAllMocks();
		});
	});

    describe('Delete matchweek', ()=>{
        it('Should deletes matchweek', async () => {
			const matchweek = (await request(app).post('/api/matchweek/create').send(newMatchweek)).body;
			const response = await request(app).delete(`/api/matchweek/${matchweek._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const foundMatchweek = await MatchweekModel.findById(matchweek._id);
			expect(foundMatchweek).toBeNull();
		});

		it('Should fail if matchweek does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/matchweek/${idFail}`);
			expect(response.status).toBe(500);
		});
    })
});
