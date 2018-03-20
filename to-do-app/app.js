var express = require('express');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

let items = [];

app.get('/items', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
});

app.get('/items/:id', function (req, res) {
    let item = items.filter((obj) => {
        return obj.id == req.params.id;
    });
    if (item) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item[0]));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Item not found');
    }
});

app.post('/items', function (req, res) {
    if (checkSimpleBody(req)) {
        let newItem = { id: items.length + 1, description: req.body.description, checked: req.body.checked };
        items.push(newItem);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newItem));
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad JSON Body');
    }
});

app.put('/items/:id', function (req, res) {
    if (checkCompleteBody(req)) {
        var newItem = undefined;
        items = items.map((item) => {
            if (item.id == req.params.id) {
                item.id = req.body.id;
                item.description = req.body.description;
                item.checked = req.body.checked;
                newItem = item;
                return newItem;
            }
            return item;
        });
        if (newItem) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newItem));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Item not found');
        }
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad JSON Body');
    }
});

app.delete('/items/:id', function (req, res) {
    var exists = false;
    items = items.filter((item) => {
        if (item.id == req.params.id) {
            exists = true;
        }
        return item.id != req.params.id;
    });
    if (exists) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Item not found');
    }
});

checkSimpleBody = (req) => {
    return req.body.description && req.body.checked != undefined
}
checkCompleteBody = (req) => {
    return req.body.id && req.body.description && req.body.checked != undefined
}

const server = app.listen(8080, function () {
    console.log('TO-DO APP running at port 8080!');
    app.emit("server_started_up");
});

module.exports = server;