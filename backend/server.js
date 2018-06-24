'use strict';

// dependencies
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const schemas = require('./schemas');
const routes = require('./routes');
const auth = require('./auth');
const port = 3000;

const rootAdminPass = 'kpmtnostradamus';

// mongodb
mongoose.Promise = global.Promise;
var mathclubDBConnection = mongoose.connect('mongodb://localhost/mathclubDB', {
  useMongoClient: true
});
var db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB at mongodb://localhost/mathclubDB');

  Members.findOne({
    name: 'rootAdmin',
    admin: true
  }, (err, rootAdmin) => {
    if (rootAdmin == null || err) { // no rootAdmin, create one
      auth.hash(rootAdminPass, (hash) => {
        Members.remove({
          name: 'rootAdmin',
          admin: true
        }, (err) => {
          var newRootAdmin = new Members({
            name: 'rootAdmin',
            email: 'officers@newportmathclub.org',
            passHashed: hash,
            admin: true
          });

          newRootAdmin.save((err) => {
            if (err) console.log(err);
            else console.log('Recreated root administrator');
          })
        });
      });
    }
  })
});

// sessions
const cookieExpire = 1000 * 60 * 60 * 24 * 7; // 1 week
app.set('trust proxy', 1);

const sessionMiddleware = session({
  name: 'session_id',
  secret: 'QFtjryqLg5I1SuS5dHZ9kkWskZC38AW8SgmPOE1i8Bdk1j3ynTJ9xryg350TyE5U',
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    httpOnly: true,
    maxAge: cookieExpire,
    path: '/',
    secure: false
  },
  rolling: true,
  unset: 'destroy'
});

app.use(sessionMiddleware);
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
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