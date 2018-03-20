
const expect = require('chai').expect; //BDD
const should = require('chai').should; //BDD
const assert = require('chai').assert; //Traditional Assertions

const chai = require('chai'), chaiHttp = require('chai-http');

describe('API HTTP Methods', function () {
    before(function (done) {
        chai.use(chaiHttp);
        done();
    });
    describe('GET /items', function () {
        it('Should return empty array of items', function (done) { // <= Pass in done callback
            chai.request(`http://localhost:8080`) 
                .get('/items') 
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal([]);
                    done();
                });
        });
    });
    describe('POST /items, body: {description: \'Milk\', \'checked\': false}', function () {
        it('Should return empty array of items', function (done) { // <= Pass in done callback
            chai.request(`http://localhost:8080`) 
                .post('/items') 
                .send({
                    "description": "Milk",
                    "checked": false
                })
                .end(function (err, res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal({
                        "id": 1,
                        "description": "Milk",
                        "checked": false
                    });
                    done();
                });
        });
    });
});