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
		beforeAll(async () => {
			createdPlayer = await request(app).post('/api/players').send(newPlayer);
		});

		afterAll(async () => {
			await PlayerModel.deleteMany({ name: createdPlayer.body.name });
		});

		it('Should ret return all players ordered by goals', async () => {
			const secondPlayer = await request(app).post('/api/players').send(newPlayer);
			const secondPlayerId = secondPlayer.body._id;
			const updateSecondPlayers = { goals: 2};
			await request(app).put(`/api/players/${secondPlayerId}`).send(updateSecondPlayers);

			const getPlayersResponse = await request(app).get('/api/players/all').send();
			expect(getPlayersResponse.status).toBe(200);

			const players = getPlayersResponse.body.players;
			expect(players).toBeInstanceOf(Array);

			const isOrdered = (array, key) => {
				return array.every((element, index, arrayHelper) => {
					return index === 0 || element[key] <= arrayHelper[index - 1][key];
				});
			};

			expect(isOrdered(players, 'goals')).toBe(true);
		});
	});

	describe('PUT Player /api/players/:id', () => {
		const updatePlayer = { name: 'Player Updated' };

		beforeAll(async () => {
			createdPlayer = await request(app).post('/api/players').send(newPlayer);
		});

		afterAll(async () => {
			await PlayerModel.deleteMany({ name: updatePlayer.name });
		});

		it('Should update player', async () => {
			const response = await request(app).put(`/api/players/${createdPlayer.body._id}`).send(updatePlayer);

			expect(response.status).toBe(200);
			expect(response.body.editObject.name).toBe(updatePlayer.name);
		});

		it('Should return 500 status if players is not founded', async () => {
			const notValidId = 'not_valid_id';
			const response = await request(app).put(`/api/players/${notValidId}`).send(updatePlayer);

			expect(response.status).toBe(500);
		});
	});

	describe('DELETE /api/players/:id', () => {
		it('Should deleats team', async () => {
			const player = (await request(app).post('/api/players').send(newPlayer)).body;
			const response = await request(app).delete(`/api/players/${player._id}`);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toContain('json');

			const playerFounded = await PlayerModel.findById(player._id);
			expect(playerFounded).toBeNull();
		});

		it('Should fail if team does not exist', async () => {
			const idFail = 'notExist';
			const response = await request(app).delete(`/api/teams/${idFail}`);
			expect(response.status).toBe(500);
		});
	});
});
