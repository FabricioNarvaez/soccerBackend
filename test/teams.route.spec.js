require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const TeamModel = require('../models/team.model');

describe('Test on teams API', ()=>{

    const newTeam = {
        name: "Prueba Equipo",
        acronym: "PE",
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        shield: "Sin escudo",
        players: []
    }

    beforeAll(async ()=>{
        await mongoose.connect(process.env.URL_MONGODB);
    });

    afterAll(async ()=>{
        await mongoose.disconnect();
    });

    describe('GET /api/teams', ()=>{

        let response;

        beforeEach(async ()=>{
            response = await request(app).get('/api/teams').send();
        });

        it('Route "GET" works', async ()=>{
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Request returns an array of teams', ()=>{
            expect(response.body).toBeInstanceOf(Array);
        })
        
    });

    describe('POST /api/teams', ()=>{

        const wrongTeam = {
            name: "Prueba Equipo",
            acronym: "PE",
            PG: 0,
            PE: 0,
            PP: 0,
            GF: 0,
            GC: 0,
            shield: "Sin escudo",
            players: {}
        }

        afterAll(async ()=>{
            await TeamModel.deleteMany({ name: "Prueba Equipo"});
        });

        it('Route "POST" works', async ()=>{
            const response = await request(app).post('/api/teams').send(newTeam);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Should add new team', async ()=>{
            const response = await request(app).post('/api/teams').send(newTeam);

            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(newTeam.name);
        });

        it('Should not add new team', async ()=>{
            const response = await request(app).post('/api/teams').send(wrongTeam);

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        });
    });

})