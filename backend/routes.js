'use strict';

module.exports = (app) => {
    var nmcController = require('./controllers');
    var nmcMiddleware = require('./middleware');

    // health check route
    app.get('/api/ping/', (req, res) => {
        res.json('pong');
    });
}