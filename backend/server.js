'use strict';

// dependencies
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const cors = require('cors');
const schemas = require('./schemas');
const app = express();
const port = 3000;

// mongodb
mongoose.Promise = global.Promise;
var mathclubDBConnection = mongoose.connect('mongodb://localhost/mathclubDB');
var db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB at mongodb://localhost/mathclubDB');
});

// sessions
const cookieExpire = 1000 * 60 * 60 * 24 * 7; // 1 week
app.set('trust proxy', 1);

const sessionMiddleware = session({
    name: 'session_id',
    secret: 'QFtjryqLg5I1SuS5dHZ9kkWskZC38AW8SgmPOE1i8Bdk1j3ynTJ9xryg350TyE5U',
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        httpOnly: true,
        maxAge: cookieExpire,
        path: '/',
        secure: false
    },
    rolling: true,
    unset: 'destory'
});

app.use(sessionMiddleware);
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://165.227.54.2");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

routes(app);

app.listen(port, () => {
    console.log("Newport Math Club API is live on port " + port);
});
