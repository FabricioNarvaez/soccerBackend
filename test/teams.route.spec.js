require('dotenv').config();
const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');

describe('Test on teams API', ()=>{

    beforeAll(async ()=>{
        await mongoose.connect(process.env.URL_MONGODB);
    });

    afterAll(async ()=>{
        await mongoose.disconnect();
    })

    describe('GET /api/teams', ()=>{

        let response;

        beforeEach(async ()=>{
            response = await request(app).get('/api/teams').send();
        });

        it('Route works', async ()=>{
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Request returns an array of teams', ()=>{
            expect(response.body).toBeInstanceOf(Array);
        })
        
    })
})