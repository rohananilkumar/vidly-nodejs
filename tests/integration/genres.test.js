const request = require('supertest');
const mongoose = require('mongoose');
const {genreMongooseSchema: schema, genreMongooseSchema} = require('../../models/genre');
const Genre = mongoose.model('Genre',genreMongooseSchema);

let server;

describe('/api/genres', ()=>{

    beforeEach(()=>{server=require('../../index');});  
    afterEach(async ()=>{
        server.close();
        await Genre.remove({}); //Remove test data
        });  

    describe('GET /',()=>{
        it("Should return all genres", async ()=>{
            await Genre.insertMany([    //Insert test data
                {name:'genre1'},
                {name:'genre2'}
            ]);

            const res = await request(server).get('/api/genres'); 
            expect(res.status).toBe(200); 
            expect(res.body.some(g=> g.name === 'genre1')).toBeTruthy();    //Checking response data
            expect(res.body.some(g=> g.name === 'genre2')).toBeTruthy();    //Checking response data
        });
    });
});