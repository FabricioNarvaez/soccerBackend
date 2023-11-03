const request = require('supertest');
const app = require('../../app');

describe('Test on teams API', ()=>{

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