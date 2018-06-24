'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const cors = require('cors');
const schemas = require('./schemas');
const app = express();
const port = 3000;

mongoose.Promise = global.Promise;
var mathclubDBConnection = mongoose.connect('mongodb://localhost/mathclubDB');
var db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB at mongodb://localhost/mathclubDB');
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes(app);

app.listen(port, () => {
    console.log("Newport Math Club API is live on port " + port);
});
