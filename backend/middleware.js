'use strict'

// dependencies
const request = require('request-promise')
const schemas = require('./schemas')
const auth = require('./auth')

// mongoose models
const Meetings = schemas.Meeting
const Members = schemas.Member
const Schools = schemas.School
const Competitors = schemas.Competitor
const Teams = schemas.Team

exports.authenticateMember = (req, res, next) => {
	var email = req.body.email
	var password = req.body.password

	if (!email || !password) return res.status(400).end()

	Members.findOne(
		{
			email: email
		},
		(err, member) => {
			if (err || !member) return res.status(404).end()
			auth.check(password, member.passHashed, valid => {
				if (valid) {
					res.locals.user = member
					req.session.authenticated = true
					next()
				} else res.status(401).end()
			})
		}
	)
}

exports.authenticateCoach = async (req, res, next) => {
	var email = req.body.email
	var password = req.body.password

	if (!email || !password) return res.status(400).end()

	try {
		const school = await Schools.findOne({ coachEmail: email })
			.populate({ path: 'teams', populate: { path: 'members' } })
			.populate({ path: 'competitors', populate: { path: 'team' } })
			.exec()

		if (!school) return res.status(404).end()
		if (!school.active) return res.status(403).end()

		auth.check(password, school.passHashed, valid => {
			if (valid) {
				res.locals.user = school
				req.session.authenticated = true
				next()
			} else res.status(401).end()
		})
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.verifyAdminSession = (req, res, next) => {
	var id = req.session._id

	if (!id || !req.session.authenticated) return res.status(401).end()

	Members.findOne(
		{
			_id: id
		},
		(err, member) => {
			if (err || !member) return res.status(401).end()
			if (!member.admin) return res.status(403).end()
			res.locals.user = member
			next()
		}
	)
}

exports.mockSchoolSession = async (req, res, next) => {
	var schoolId = req.body.schoolId
	try {
		res.locals.user = await Schools.findOne({ _id: schoolId })
			.populate({ path: 'teams', populate: { path: 'members' } })
			.populate({ path: 'competitors', populate: { path: 'team' } })
			.exec()

		// sets elevated permissions to override all locks
		res.locals.elevated = true

		next()
	} catch (error) {
		console.log(error)
		res.status(500).end()
	}
}

exports.verifySession = (req, res, next) => {
	var id = req.session._id

	if (!id || !req.session.authenticated) return res.status(401).end()

	Members.findOne(
		{
			_id: id
		},
		(err, member) => {
			if (err || !member) return res.status(401).end()
			res.locals.user = member
			next()
		}
	)
}

exports.verifyCoachSession = async (req, res, next) => {
	var id = req.session._id

	if (!id) return res.status(401).end()

	try {
		const school = await Schools.findOne({ _id: id })
			.populate({ path: 'teams', populate: { path: 'members' } })
			.populate({ path: 'competitors', populate: { path: 'team' } })
			.exec()

		res.locals.user = school

		if (!school.active) return res.status(403).end()

		next()
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}
