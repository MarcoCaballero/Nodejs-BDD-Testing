# Nodejs-BDD-Testing

Testing BDD Node.js with Mocha and Chai, and Non-Functional Sytem tests with Artillery.io.


## Introduction

This repository is intended to show a simple example of how to test Node.js Express.

For this, an Rest API is exposed, similar to that of the example provided by Micael Gallego in the document System Tests (Functional and Non-functional).


>  #### EACS. Pruebas del Software

> Tema 4: Introducción.

> Tema 4: Pruebas Unitarias.

> Tema 4: Pruebas Unitarias C++.

>  **Tema 4: Pruebas de Sistema.**

 
In our case we will show BDD Testing with Mocha & Chai as functional system tests, and Artillery.io as non-functional. 

- Mocha.js: Javascript test framework running on Node.js and in the browser and easing us making asynchronous testing (
https://mochajs.org/)

- Chai: BDD / TDD assertion library for [Node.js](http://nodejs.org/) and the browser that can be delightfully paired with any javascript testing framework (http://www.chaijs.com/).

- Artillery: Modern, powerful & easy-to-use load testing toolkit. Use it to ship  scalable applications that stay performant  _&_  resilient  under high load (https://artillery.io).

## API Docs

```JSON
	
API Docs

Base Url: http://127.0.0.1:8080

------------------------------------------------------------------

Request:
- Method: GET 
- Url: /items
- Response: 200 OK

Response Example:
- Status: 200 OK
- Body: [{"id":1,"description":"Leche","checked":false},{"id":2,"description":"Pan","checked":true}]


------------------------------------------------------------------

Request:
- Method: GET 
- Url: /items/:id
- Responses: 200 OK, 404 Not Found

Response Example:
(Good)
- Status: 200 OK
- Body: {"id":1,"description":"Leche","checked":false}
  
------------------------------------------------------------------

Request:
- Method: POST
- Url: /items/:id
- Body: {"description":"Vino","checked":false}
- Responses: 200 OK, 400 Bad Request

Response Example:
- Status: 200 OK
- Body: {"id":3,"description":"Vino","checked":false}

------------------------------------------------------------------

Request:
- Method: PUT
- Url: /items/:id
- Body: {"id": 3, "description":"Vino","checked":true}
- Responses: 200 OK, 400 Bad Request

Response Example:
(Good)
- Status: 200 OK
- Body: {"id":3,"description":"Vino","checked":true}
------------------------------------------------------------------

Request:
- Method: DELETE
- Url: /items/:id
- Responses: 200 OK, 404 Not Found

Response Example:
- Status: 200 OK
- Body: {"id":3,"description":"Vino","checked":true}

------------------------------------------------------------------

Error Responses:

(400)
- Status: 400 Bad Request
- Body: {
	"statusCode": 400,
	"status": "Bad Request",
	"message": "Please check the request body"
} 


(404)
- Status: 404 Not Found
- Body: {
    "statusCode": 404,
	"status": "Not Found",
	"message": "Not Found item with id: {:id}"
}
```

## Functional System Test
 As we told previously we will use Mocha & Chai, with the Chai-Http plugin and the BDD Assertions libraries for \`Should\` and \`Expect\` assertions. The main flow of the test specifications is basically the following:

  
#### Hooks

  With its default “BDD”-style interface, Mocha provides the hooks `before()`, `after()`, `beforeEach()`, and `afterEach()`. These should be used to set up preconditions and clean up after your tests.
  
```javascript

describe('hooks', () => {

	before(function() {
	   // runs before all tests in this block
	});

	after(function() {
	  // runs after all tests in this block
	});

	beforeEach(function() {
	  // runs before each test in this block
	});

	afterEach(function() {
	  // runs after each test in this block
	});

	// test cases
	
});

```

The hooks have many variations:

```javascript

	beforeEach(function() {
	  // beforeEach simple
	});
	
	beforeEach(function named() {
	  // beforeEach:named
	});
	
	beforeEach('Some description', function () {
	  // beforeEach:Some Description
	});
	
	beforeEach(function (done) {
	  // asynchronous
	  if (err) done(err); // finish with error
	  done(); // finish
	});

```

Main flow:

```js

describe('Suite', function() {
	describe('Sub suite 1', function() {
	    it('should accomplish with something', function() {
		      // Assert, Expect or Should (Chai Assertions)
	    });
   });
	describe('Sub suite 2', function() {
	    it('should accomplish with something', function() {
		      // Assert, Expect or Should (Chai Assertions)
	    });
   });
});

```

#### Matchers:


Provided as chainable getters to improve the readability of our assertions.


##### Chains:

 `to, be, been, have, with, at, of, does ....`


##### Examples:


**.not**
- Negates all assertions that follow in the chain

```js
    expect(function () {}).to.not.throw();
    expect({a: 1}).to.not.have.property('b');
    expect([1, 2]).to.be.an('array').that.does.not.include(3);
``` 

**.deep**
- Causes all `.equal, .include, .members, .keys,` and `.property` assertions that follow in the chain to use deep equality instead of strict `(===) `equality. See the deep-eql project page for info on the deep equality algorithm: https://github.com/chaijs/deep-eql.

```js

    // Target object deeply (but not strictly) equals `{a: 1}`
    expect({a: 1}).to.deep.equal({a: 1});
    expect({a: 1}).to.not.equal({a: 1});

    // Target array deeply (but not strictly) includes `{a: 1}`
    expect([{a: 1}]).to.deep.include({a: 1});
    expect([{a: 1}]).to.not.include({a: 1});

    // Target object deeply (but not strictly) includes `x: {a: 1}`
    expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
    expect({x: {a: 1}}).to.not.include({x: {a: 1}});

```

**.ok**
- Asserts that the target is loosely `(==)` equal to true. However, it’s often best to assert that the target is strictly `(===)` or deeply equal to its expected value.

```js

    expect(1).to.equal(1); // Recommended
    expect(1).to.be.ok; // Not recommended

    expect(true).to.be.true; // Recommended
    expect(true).to.be.ok; // Not recommended

    expect(false).to.be.false; // Recommended
    expect(false).to.not.be.ok; // Not recommended

```


#### Chai-Http
- Allows us to make request and assert on its reponse, for that we could use the `end()` method.

```js

chai.request('https://127.0.0.1:8080') // Could inject the app
    .put('/user/me') // Request
    .set('X-API-Key', 'foobar') // Headers
    .send({ password: '123', confirmPassword: '123' }) // Body
    .end(function (err, res) {
        expect(err).to.be.null;
        expect(req).to.have.headers; // Assert headers
        expect(res).to.have.status(200); // Assert status
  });

```


## Non-Functional System Test

Artillery docs:

> Welcome to Artillery.io Docs 📖
> Artillery is a modern, powerful & easy-to-use load testing toolkit. Use it to make your applications stay scalable, performant & resilient under high load.

> If you’re new to Artillery, Getting Started is a good place to start, followed by an overview of how Artillery works. When you’re writing your tests, the various references (HTTP, Socket.io, WebSockets, the CLI) will come in handy.

> When you're ready to take your load testing to the next level, run distributed tests from AWS, and integrate performance testing with your CI/CD pipelines, Artillery Pro has you covered.

> appy load testing! Ship indestructible systems. 👩‍💻 🏰

We will run the following example, in which 20 virtual users will be created during 60 seconds, we can see reports each 10 seconds and the global report at the end.

Configuration file: artillery.yml :

```yml
config:
  target: 'http://127.0.0.1:8080'
  phases:
    - duration: 60
      arrivalRate: 20
  defaults:
    headers:
     some-headers: 'some-value'
scenarios:
  - flow:
    - get:
        url: "/items"
    - post:
        url: "/items"
        json:
              description: "Milk"
              checked: false
    - get:
            url: "/items/1"
    - delete:
            url: "/items/1"

```

10s' example report (phase 0): 

```txt

Started phase 0, duration: 60s @ 14:58:13(-0400) 2018-03-21
Report @ 14:58:23(-0400) 2018-03-21
  Scenarios launched:  199
  Scenarios completed: 199
  Requests completed:  796
  RPS sent: 80
  Request latency:
    min: 0.5
    max: 56
    median: 3.1
    p95: 14.8
    p99: 30.8
  Codes:
    200: 201
    201: 199
    404: 396

```



final report example: 

```txt
    All virtual users finished
    Summary report @ 14:41:45(-0400) 2018-03-21
    Scenarios launched:  1200
    Scenarios completed: 1200
    Requests completed:  4800
    RPS sent: 79.35
    Request latency:
        min: 0.4
        max: 151.2
        median: 2.3
        p95: 13.9
        p99: 28.2
    Scenario counts:
        0: 1200 (100%)
    Codes:
        200: 1203
        201: 1200
        404: 2397
```

## Try It

#### Install

    git clone https://github.com/MarcoCaballero/Nodejs-BDD-Testing.git
    cd to-do-app
    npm install

#### Run Server

    npm start

#### Run Functional Tests

    npm test


#### Run Non-Functional Tests

    npm run test_nft