const BASE_URL = 'http://127.0.0.1:8080';
const server = require('../app');
const chai = require('chai'),
    expect = require('chai').expect,
    should = require('chai').should(),
    chaiHttp = require('chai-http');
let stubItem;


describe('To-Do Items App BDD Testing with \'expect\' ', () => {
    /* @BeforeAll */
    before((done) => {
        chai.use(chaiHttp);
        server.on('server_started_up', done());
    });

    describe('- Given an empty array of items \n    - When \'GET /items\' is launched', () => {
        it('Then Should return an empty array of items', (done) => {
            chai.request(BASE_URL)
                .get('/items')
                .end((err, res) => {
                    expect(res).to.have.status(200).and.to.be.json;
                    expect(res.body).to.deep.equal([]);
                    done();
                });
        });
    });

    describe('- Given an empty array of items \n    - When \'POST /items, body: {description: \'Milk\', \'checked\': false}\' is launched', () => {
        it('Should return an JSON Object equals to \`{id: 1, description: \'Milk\', \'checked\': true}\`', (done) => {
            chai.request(BASE_URL)
                .post('/items')
                .send({
                    "description": "Milk",
                    "checked": false
                })
                .end((err, res) => {
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

    describe('- Given an array with one item \n    - When \'GET /items/1\' is launched', () => {
        it('Should return a JSON Object which includes \`{id: 1, description: \'Milk\', \'checked\': false}\` ', (done) => {
            chai.request(BASE_URL)
                .get('/items/1')
                .end((err, res) => {
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

    describe('- Given an array with one item \n    - When \'PUT /items/1,  body: {id: 1, description: \'Milk\', \'checked\': true}\' is launched', () => {
        before(() => {
            stubItem = {
                "id": 1,
                "description": "Milk",
                "checked": true
            }
        });
        it('Should update the item with id:1 and return it as JSON Object', (done) => {
            chai.request(BASE_URL)
                .put('/items/1')
                .send(stubItem)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(stubItem);
                    done();
                });
        });
    });

    describe('- Given an array with one modified item \n    - When \'GET /items/1\' is launched', () => {
        it('Should return a JSON Object which includes \`{id: 1, description: \'Milk\', \'checked\': true}\` ', (done) => {
            chai.request(BASE_URL)
                .get('/items/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object').and.to.deep.equal({
                        "id": 1,
                        "description": "Milk",
                        "checked": true
                    });
                    done();
                });
        });
    });

    describe('- Given an array with one item \n    - When \'DELETE /items/1\' is launched', () => {
        before(() => {
            stubItem = {
                "id": 1,
                "description": "Milk",
                "checked": true
            }
        });
        it('Should delete the item with id:1 and return it as JSON Object', (done) => {
            chai.request(BASE_URL)
                .delete('/items/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(stubItem);
                    done();
                });
        });
    });

    describe('- Given an empty array of items \n    - When \'GET /items\' is launched', () => {
        it('Then Should return an empty array of items (Should assertions version)', (done) => {
            chai.request(BASE_URL)
                .get('/items')
                .end((err, res) => {
                    res.should.have.status(200).and.to.be.json;
                    res.body.should.be.deep.equal([]);
                    done();
                });
        });
    });


    
    describe('- Given an empty array of items\n    - When \'GET /items/10\' is launched', () => {
        before(() => {
            errorItem = {
                "statusCode": 404,
                "status": "Not Found",
                "message": "Not Found item with id: 10"
            }
        });
        it('Should return an error with statusCode:404 and return it as JSON Object', (done) => {
            chai.request(BASE_URL)
                .get('/items/10')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(errorItem);
                    done();
                });
        });
    });

    describe('- Given an array with 2 items\n    - When \'GET /items/2\' is launched', () => {
        before(() => {
            chai.request(BASE_URL)
                .post('/items')
                .send({
                    "description": "Milk",
                    "checked": false
                }).end();
            chai.request(BASE_URL)
                .post('/items')
                .send({
                    "description": "Coffe",
                    "checked": false
                }).end();
        });
        it('Should return item with id:2 and return it as JSON Object', (done) => {
            chai.request(BASE_URL)
                .get('/items/2')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object').and.to.deep.equal({
                        "id": 2,
                        "description": "Coffe",
                        "checked": false
                    });
                    done();
                });
        });
    });


    describe('- Given an array with 2 items\n  - When \'PUT /items/2\' is launched with a bad body request', () => {
        before(() => {   
            errorItem = {
                "statusCode": 400,
                "status": "Bad Request",
                "message": "Please check the request body"
            }
        });
        it('Should return an error with statusCode:400 and return it as JSON Object', (done) => {
            chai.request(BASE_URL)
                .put('/items/2')
                .send({
                    "description": "Coffe",
                }).end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(errorItem);
                    done();
                });
        });
    });
    /* {
    "statusCode": 400,
    "status": "Bad Request",
    "message": "Please check the request body"
}
    } */
    /* @AfterAll */
    after((done) => {
        server.close();
        done();
    });
});