require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const PlayerModel = require('../models/players.model');

describe('Test on players API', () => {
	let createdPlayer;

	const newPlayer = {
		name: 'PlayerTest',
		playerNumber: 0,
		alias: 'Test',
	};

	beforeAll(async () => {
		await mongoose.connect(process.env.URL_MONGODB);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	describe('POST /api/players', () => {
		afterAll(async () => {
			await PlayerModel.deleteMany({ name: newPlayer.name });
		});

		it('Route "POST" works', async () => {
			createdPlayer = await request(app).post('/api/players').send(newPlayer);

			expect(createdPlayer.status).toBe(200);
			expect(createdPlayer.headers['content-type']).toContain('json');
		});

		it('Should create a new player', async () => {
			createdPlayer = await request(app).post('/api/players').send(newPlayer);

			expect(createdPlayer.status).toBe(200);
			expect(createdPlayer.body._id).toBeDefined();
			expect(createdPlayer.body.name).toBe(newPlayer.name);
		});
	});

	describe('GET Player /api/players/:id', () => {
		beforeAll(async () => {
			createdPlayer = await request(app).post('/api/players').send(newPlayer);
		});

		afterAll(async () => {
			await PlayerModel.deleteMany({ name: createdPlayer.body.name });
		});

		it('Route "GET Player" works', async () => {
			const playerFounded = await request(app).get(`/api/players/${createdPlayer.body._id}`).send();
			expect(playerFounded.status).toBe(200);

			const player = playerFounded.body.player;
			expect(player.name).toBe(createdPlayer.body.name);
		});
	});

	describe('GET Players /api/players/all', () => {
		beforeAll(async () =>{
			createdPlayer = await request(app).post('/api/players').send(newPlayer);
		});

		afterAll(async () => {
			await PlayerModel.deleteMany({ name: createdPlayer.body.name });
		});

		it('Should ret return all players', async ()=>{
			const getPlayersResponse = await request(app).get('/api/players/all').send();
			expect(getPlayersResponse.status).toBe(200);

			const players = getPlayersResponse.body.players;
			expect(players).toBeInstanceOf(Array);

			const isOrdered = (array, key) => {
				return array.every((element, index, arrayHelper) => {
					return index === 0 || element[key] <= arrayHelper[index - 1][key];
				});
			}

			expect(isOrdered(players, 'goals')).toBe(true);
		});
	})
});
