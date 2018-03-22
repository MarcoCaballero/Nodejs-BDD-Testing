'use strict';

const BAD_REQUEST_MSG = JSON.stringify({ statusCode: 400, status: 'Bad Request', message: 'Please check the request body' });
const NOT_FOUND_MSG = (id) => { return JSON.stringify({ statusCode: 404, status: 'Not Found', message: `Not Found item with id: ${id}` } )};
const checkSimpleBody = (req) => { return req.body.description && req.body.checked != undefined }
const checkCompleteBody = (req) => { return req.body.id && req.body.description && req.body.checked != undefined }

let items = [];

exports.get_items = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
}

exports.get_item_by_id = (req, res) => {
    let item = undefined;
    items.map((obj) => {
        item =  (obj.id == req.params.id) ? obj : item;
    });
    res.writeHead((item) ? 200 : 404, { 'Content-Type': 'application/json' });
    res.end((item) ? JSON.stringify(item) : NOT_FOUND_MSG(req.params.id));
}

exports.post_item = (req, res) => {
    let newItem = (checkSimpleBody(req)) ? { id: items.length + 1, description: req.body.description, checked: req.body.checked } : undefined;
    items.push(newItem);
    res.writeHead((checkSimpleBody(req)) ? 201 : 400, { 'Content-Type': 'application/json' });
    res.end((checkSimpleBody(req)) ? JSON.stringify(newItem) : BAD_REQUEST_MSG);
}

exports.put_item = (req, res) => {
    if (checkCompleteBody(req)) {
        var newItem = { id: req.body.id, description: req.body.description, checked: req.body.checked };
        items = items.map((item) => {
            return (item.id == req.params.id) ? newItem : item;
        });
        res.writeHead((newItem) ? 200 : 404, { 'Content-Type': 'application/json' });
        res.end((newItem) ? JSON.stringify(newItem) : NOT_FOUND_MSG(req.params.id));
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(BAD_REQUEST_MSG);
    }
}

exports.delete_item = (req, res) => {
    var aux = undefined;
    items = items.filter((item) => {
        if (item.id == req.params.id) {
            aux = item;
        }
        return item.id != req.params.id;
    });
    res.writeHead((aux) ? 200 : 404, { 'Content-Type': 'application/json' });
    res.end((aux) ? JSON.stringify(aux) : NOT_FOUND_MSG(req.params.id));
}
