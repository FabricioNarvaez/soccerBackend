require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const PlayerModel = require('../models/players.model');

describe('Test on players API', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.URL_MONGODB);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/players', () => {
        const newPlayer = {
            name: "PlayerTest",
            playerNumber: 0, 
            alias: "Test"
        }
        
        it('Route "POST" works', async () => {
			const response = await request(app).post('/api/players').send(newPlayer);

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');
		});

        it('Should create a new player', async ()=>{
            const response = await request(app).post('/api/players').send(newPlayer);

            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe(newPlayer.name);
        });
    })
});