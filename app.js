var express = require('express');
var app = express();
var router = express.Router();
var elasticsearch = require('elasticsearch');
var redis = require('redis');
var bodyParser = require('body-parser');
var client1 = elasticsearch.Client({
    host: 'localhost:9200'
});
var client2 = require('redis').createClient();
client2.on('error', function(err) {
    console.log('Error ' + err);
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});
app.use(bodyParser.json())
app.get('/index/:string', function(req, res) {
    var string = req.params.string
    client2.set(string, 'value for given key:' + string, function(err, reply) {})
    var result = client1.index({
        index: 'cldb',
        type: 'posts',
        body: {
            title: string,
            post_date: new Date(),
            message: 'cloudboost collection'
        },
        refresh: true
    });
    res.json({
        "result": "success"
    })
});
app.get('/search/:string', function(req, res) {
    var string = req.params.string
    client1.search({
        index: 'cldb',
        q: 'title:' + string
    }, function(error, response) {
        console.log(response.hits.hits)
        res.json(response.hits.hits)
    });
});
app.get('/redis/:string', function(req, res) {
    var string = req.params.string
    client2.get(string, function(err, reply) {
        console.log('ans', reply)
        if (reply == null) {
            res.json({
                "result": "doesn't exist"
            })
        } else {
            res.json({
                "result": reply
            })
        }
    })
});
app.post('/try', function(req, res) {
    res.send(req.body)
});
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});