require('dotenv').config();
require('./mongoDB.js');
const app = require('../app');
const request = require('supertest');
const PlayerModel = require('../models/player.model');
const TeamModel = require('../models/team.model');

describe('Test on players API', () => {
	let createdPlayer;

	const newPlayer = {
		name: 'PlayerTest',
		playerNumber: 0,
		alias: 'Test',
	};

	const newTeam = {
		name: 'Test Team',
		acronym: 'TT',
		shield: '',
		players: [],
		group: 'A',
	};

	describe('Check create player', () => {
		afterAll(async () => {
			await PlayerModel.deleteMany({ name: newPlayer.name });
			await TeamModel.deleteMany({ name: newTeam.name });
		});

		it('Should create a new player', async () => {
			const createdTeam = await request(app).post('/api/teams/create').send(newTeam);
			newPlayer.teamId = createdTeam.body._id;
			createdPlayer = await request(app).post('/api/players/create').send(newPlayer);
			const playerId = createdPlayer.body._id;

			expect(createdPlayer.status).toBe(200);
			expect(playerId).toBeDefined();
			expect(createdPlayer.body.name).toBe(newPlayer.name);

			const getTeamInfo = await request(app).get(`/api/teams/team/${createdTeam.body._id}`).send();
			const playerFounded = getTeamInfo.body.playersDetails.find(player => player._id === playerId);
			expect(playerFounded).not.toBeUndefined();
		});
	});

	describe('Check receive players by id', () => {
		beforeAll(async () => {
			createdPlayer = await request(app).post('/api/players/create').send(newPlayer);
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

	describe('Check receive all players', () => {
		beforeAll(async () => {
			createdPlayer = await request(app).post('/api/players/create').send(newPlayer);
		});

		afterAll(async () => {
			await PlayerModel.deleteMany({ name: createdPlayer.body.name });
		});

		it('Should ret return all players ordered by goals', async () => {
			const secondPlayer = (await request(app).post('/api/players/create').send(newPlayer)).body;
			const updateSecondPlayers = { goals: 2 };
			await request(app).put(`/api/players/${secondPlayer._id}`).send(updateSecondPlayers);

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

	describe('check update player data', () => {
		const updatePlayer = { name: 'Player Updated' };

		beforeAll(async () => {
			createdPlayer = await request(app).post('/api/players/create').send(newPlayer);
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

	describe('Check delete player by id', () => {
		it('Should deletes team', async () => {
			const player = (await request(app).post('/api/players/create').send(newPlayer)).body;
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
