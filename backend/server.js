'use strict'

// dependencies
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const app = express()
const schemas = require('./schemas')
const routes = require('./routes')
const auth = require('./auth')
const sockets = require('./sockets')
const Members = schemas.Member
const port = 3000

// string helper functions
String.prototype.isValidEmail = function() {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(this.toLowerCase())
}

String.prototype.isOnlyWhitespace = function() {
	if (this === '') return true
	return this.replace(/\s/g, '').length === 0
}

const rootAdminPass = process.env.DEFAULT_ADMIN_PASS

const server = require('http').Server(app)

// mongodb
mongoose.Promise = global.Promise
mongoose.connect(
	'mongodb://localhost/mathclubDB',
	{
		useMongoClient: true
	}
)
var db = mongoose.connection

db.once('open', async () => {
	console.log('Connected to MongoDB at mongodb://localhost/mathclubDB')

	try {
		const rootAdmin = await Members.findOne({
			name: 'Admin Math Club',
			admin: true
		}).exec()

		if (!rootAdmin) {
			// no rootAdmin, create one
			console.log(rootAdminPass)
			auth.hash(rootAdminPass, async hash => {
				var newRootAdmin = new Members({
					name: 'Admin Math Club',
					email: 'officers@newportmathclub.org',
					passHashed: hash,
					admin: true
				})

				await newRootAdmin.save()

				console.log('Recreated root administrator')
			})
		}
	} catch (err) {
		console.log('error while checking/creating root admin')
		console.log(err)
	}
})

global.kpmtLock = false
global.registrationLock = false

// sessions
const cookieExpire = 1000 * 60 * 60 * 24 * 7 // 1 week
app.set('trust proxy', 1)

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
})

sockets.init(server, sessionMiddleware)

app.use(sessionMiddleware)
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(bodyParser.json())
app.use((req, res, next) => {
	var allowedOrigins = [
		'http://localhost:3000',
		'http://localhost:3001',
		'https://newportmathclub.org',
		'http://159.89.150.152',
		'https://www.newportmathclub.org',
		'https://mobile.newportmathclub.org'
	]
	var origin = req.headers.origin

	if (allowedOrigins.indexOf(origin) > -1) {
		res.setHeader('Access-Control-Allow-Origin', origin)
	}
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

routes(app)

server.listen(port, () => {
	console.log('Newport Math Club API is live on port ' + port)
})
