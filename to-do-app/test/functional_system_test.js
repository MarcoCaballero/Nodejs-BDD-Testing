const BASE_URL = 'http://127.0.0.1:8080';
const server = require('../app');
const chai = require('chai'),
    expect = require('chai').expect,
    should = require('chai').should(),
    chaiHttp = require('chai-http');


describe('To-Do Items App BDD Testing with \'expect\' ', function () {
    before((done) => {
        chai.use(chaiHttp);
        server.on('server_started_up', done());
    });
    describe('GET /items', function () {
        it('Should return empty array of items', function (done) { // <= Pass in done callback
            chai.request(BASE_URL)
                .get('/items')
                .end(function (err, res) {
                    expect(res).to.have.status(200).and.to.be.json;
                    expect(res.body).to.deep.equal([]);
                    done();
                });
        });
    });

    describe('POST /items, body: {description: \'Milk\', \'checked\': false}', function () {
        it('Should return an array of items, which includes `{id: 1, description: \'Milk\', \'checked\': true}`', function (done) { // <= Pass in done callback
            chai.request(BASE_URL)
                .post('/items')
                .send({
                    "description": "Milk",
                    "checked": false
                })
                .end(function (err, res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object').and.to.deep.equal({
                        "id": 1,
                        "description": "Milk",
                        "checked": false
                    });
                    done();
                });
        });
    });

    describe('GET /items/1', function () {
        it('Should return an item, which includes `{id: 1, description: \'Milk\', \'checked\': true}` ', function (done) {
            chai.request(BASE_URL)
                .get('/items/1')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object').and.to.deep.equal({
                        "id": 1,
                        "description": "Milk",
                        "checked": false
                    });
                    done();
                });
        });
    });

    describe('PUT /items, body: {id: 1, description: \'Milk\', \'checked\': true}', function () {
        it('Should update item 1 and return it', function (done) { // <= Pass in done callback
            chai.request(BASE_URL)
                .put('/items/1')
                .send({
                    "id": 1,
                    "description": "Milk",
                    "checked": true
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal({
                        "id": 1,
                        "description": "Milk",
                        "checked": true
                    });
                    done();
                });
        });
    }); 
    after((done) => {
        server.close();
        done();
    });
});