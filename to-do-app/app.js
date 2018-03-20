const express = require('express');
const bodyParser = require('body-parser');
const ApiController = require('./controller/api.controller');

const app = express();

app.use(bodyParser.json());

app.get('/items', ApiController.get_items);

app.get('/items/:id', ApiController.get_item_by_id);

app.post('/items', ApiController.post_item);

app.put('/items/:id', ApiController.put_item);

app.delete('/items/:id',  ApiController.delete_item);

const server = app.listen(8080,  () => {
    console.log('TO-DO APP running at port 8080!');
    app.emit("server_started_up");
});

module.exports = server;