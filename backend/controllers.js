'use strict'

// dependencies
require('dotenv').config()
const mongoose = require('mongoose')
const async = require('async')
const schemas = require('./schemas')
const sockets = require('./sockets')
const auth = require('./auth')
const helper = require('sendgrid').mail
const defaultPassword = 'newportmathclub'

// mongoose models
const Meetings = schemas.Meeting
const Members = schemas.Member
const Schools = schemas.School
const Competitors = schemas.Competitor
const Teams = schemas.Team

// helper function
const validateInput = (...parameters) => {
	for (var i = 0; i < parameters.length; i++) {
		if (!parameters[i]) return false
	}
	return true
}

const hat = (length = 32) => {
	var text = ''
	var possible = 'abcdef0123456789'

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length))

	return text
}

// route controllers
exports.login = (req, res) => {
	var user = res.locals.user
	req.session._id = user._id

	res.status(200).end()
}

exports.logout = (req, res) => {
	req.session.destroy(err => {
		if (err) res.status(500).end()
		else res.status(200).end()
	})
}

exports.fetchProfile = (req, res) => {
	res.status(200).json(res.locals.user)
}

exports.changePassword = (req, res) => {
	var newPassword = req.body.newPassword
	var user = res.locals.user

	if (!newPassword) return res.status(400).end()

	auth.hash(newPassword, hash => {
		Members.updateOne(
			{
				_id: user._id
			},
			{
				$set: {
					passHashed: hash
				}
			},
			(err, newMember) => {
				if (err) res.status(500).end()
				else res.status(200).end()
			}
		)
	})
}

exports.forgotPass = async (req, res) => {
	var email = req.body.email

	console.log('API KEY: ' + process.env.SENDGRID)
	if (!email) return res.status(400).end()

	const user = await Members.findOne({ email: email }).exec()

	if (!user) {
		return res.status(404).end()
	}

	// token consists of a random token as well as timestamp converted to hex
	const token = hat() + '-' + Date.now().toString(16)

	// save token to user
	await Members.updateOne(
		{ _id: user._id },
		{ $set: { passResetToken: token } }
	).exec()

	// send email
	var fromEmail = new helper.Email('newportmathclub@gmail.com')
	var toEmail = new helper.Email(user.email)
	var subject = 'Newport Math Club Password Reset'
	var content = new helper.Content(
		'text/plain',
		'Here is your password reset link: https://newportmathclub.org/reset?token=' +
			token +
			'\n\n If you did not request for a password reset, please ignore this email.'
	)
	var mail = new helper.Mail(fromEmail, subject, toEmail, content)

	var sg = require('sendgrid')(process.env.SENDGRID)
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	})

	sg.API(request, function(error, response) {
		if (error) {
			console.log('SendGrid error: ' + error)
			res.status(500).end()
		}
		res.status(200).end()
	})
}

exports.newMeeting = async (req, res) => {
	var piPoints = req.body.piPoints || 1
	var date = req.body.date || Date.now()
	var memberIds = req.body.memberIds
	var description = req.body.description || ''

	if (!memberIds) return res.status(400).end()

	var newMeeting = new Meetings({
		date: date,
		members: memberIds,
		description: description,
		piPoints: piPoints
	})

	try {
		const meetingObject = await newMeeting.save()

		sockets.onMeetingsChange('add', meetingObject)

		// increment these pi points
		await Members.updateMany(
			{ _id: { $in: memberIds } },
			{ $inc: { piPoints: piPoints } }
		).exec()

		// socket this change to everyone affected
		memberIds.forEach(memberId => {
			sockets.onPiPointChange(memberId.toString(), piPoints)
			sockets.onMembersChange('edit', {
				_id: memberId.toString(),
				data: [{ field: 'piPoints', value: piPoints }]
			})
		})

		res.status(200).end()
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.removeMeeting = async (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	try {
		const meeting = await Meetings.findOne({ _id: id }).exec()

		if (!meeting) return res.status(404).end()

		await Meetings.deleteOne({
			_id: id
		}).exec()

		sockets.onMeetingsChange('remove', id)

		// decrement these pi points
		await Members.updateMany(
			{ _id: { $in: meeting.members } },
			{ $inc: { piPoints: 0 - meeting.piPoints } }
		).exec()

		meeting.members.forEach(memberId => {
			sockets.onPiPointChange(memberId.toString(), 0 - meeting.piPoints)
			sockets.onMembersChange('edit', {
				_id: memberId.toString(),
				data: [{ field: 'piPoints', value: 0 - meeting.piPoints }]
			})
		})

		res.status(200).end()
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.editMeeting = async (req, res) => {
	var id = req.body.id
	var piPoints = req.body.piPoints || 1
	var date = req.body.date || Date.now()
	var memberIds = req.body.memberIds
	var description = req.body.description || ''

	if (!validateInput(id, memberIds)) return res.status(400).end()

	const oldMeeting = await Meetings.findOne({
		_id: id
	}).exec()

	if (!oldMeeting) return res.status(404).end()

	await Meetings.updateOne(
		{
			_id: id
		},
		{
			$set: {
				date: date,
				description: description,
				piPoints: piPoints,
				members: memberIds
			}
		}
	).exec()

	// decrement these pi points from all old members
	await Members.updateMany(
		{ _id: { $in: oldMeeting.members } },
		{ $inc: { piPoints: 0 - oldMeeting.piPoints } }
	).exec()

	// socket the decrement
	oldMeeting.members.forEach(memberId => {
		sockets.onPiPointChange(memberId.toString(), 0 - oldMeeting.piPoints)
		sockets.onMembersChange('edit', {
			_id: memberId.toString(),
			data: [{ field: 'piPoints', value: 0 - oldMeeting.piPoints }]
		})
	})

	await Members.updateMany(
		{ _id: { $in: memberIds } },
		{ $inc: { piPoints: piPoints } }
	).exec()

	// socket the increment
	memberIds.forEach(memberId => {
		sockets.onPiPointChange(memberId.toString(), piPoints)
		sockets.onMembersChange('edit', {
			_id: memberId.toString(),
			data: [{ field: 'piPoints', value: piPoints }]
		})
	})

	sockets.onMeetingsChange('edit', {
		_id: id,
		data: [
			{ field: 'piPoints', value: piPoints },
			{ field: 'description', value: description },
			{ field: 'members', value: memberIds },
			{ field: 'date', value: date }
		]
	})

	res.status(200).end()
}

exports.fetchMeetings = (req, res) => {
	Meetings.find({})
		.sort({
			date: -1
		})
		.exec((err, meetings) => {
			if (err) res.status(500).end()
			else res.status(200).json(meetings)
		})
}

exports.fetchMembers = (req, res) => {
	Members.find({})
		.sort({
			admin: -1
		})
		.exec((err, members) => {
			if (err) res.status(500).end()
			else res.status(200).json(members)
		})
}

exports.newMember = async (req, res) => {
	var name = req.body.name
	var yearOfGraduation = req.body.yearOfGraduation
	var email = req.body.email
	var admin = req.body.admin

	if (admin == null || admin == undefined) admin = false
	if (!validateInput(name, yearOfGraduation, email))
		return res.status(400).end()

	auth.hash(defaultPassword, async hash => {
		const newMember = new Members({
			name: name,
			yearOfGraduation: yearOfGraduation,
			piPoints: 0,
			email: email,
			passHashed: hash,
			admin: admin
		})

		try {
			const memberObject = await newMember.save()

			sockets.onMembersChange('add', memberObject)

			res.status(200).end()
		} catch (err) {
			console.log(err)
			res.status(500).end()
		}
	})
}

exports.removeMember = async (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	try {
		await Meetings.updateMany(
			{
				members: id
			},
			{
				$pull: {
					members: id
				}
			}
		).exec()

		// clear empty meetings
		await Meetings.deleteMany({ members: [] }).exec()

		await Members.deleteOne({
			_id: id
		}).exec()

		sockets.onMembersChange('remove', id)

		res.status(200).end()
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.editMember = async (req, res) => {
	var id = req.body.id
	var name = req.body.name
	var yearOfGraduation = req.body.yearOfGraduation
	var email = req.body.email
	var admin = req.body.admin

	if (
		!validateInput(id, name, yearOfGraduation, email) ||
		admin == undefined ||
		admin == null
	)
		return res.status(400).end()

	const oldMember = await Members.findOne({ _id: id }).exec()

	if (!oldMember) return res.status(404).end()

	await Members.updateOne(
		{
			_id: id
		},
		{
			$set: {
				name: name,
				yearOfGraduation: yearOfGraduation,
				email: email,
				admin: admin
			}
		}
	).exec()

	sockets.onMembersChange('edit', {
		_id: id,
		data: [
			{ field: 'name', value: name },
			{ field: 'yearOfGraduation', value: yearOfGraduation },
			{ field: 'email', value: email },
			{ field: 'admin', value: admin }
		]
	})

	res.status(200).end()
}

exports.promoteMember = (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	Members.updateOne(
		{
			_id: id
		},
		{
			$set: {
				admin: true
			}
		},
		err => {
			if (err) res.status(500).end()
			else res.status(200).end()
		}
	)
}

exports.demoteMember = (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	Members.updateOne(
		{
			_id: id
		},
		{
			$set: {
				admin: false
			}
		},
		err => {
			if (err) res.status(500).end()
			else res.status(200).end()
		}
	)
}

exports.exportMathClub = (req, res) => {
	var master = {}
	Members.find({}, (err, members) => {
		if (err) return res.status(500).end()

		master.members = members

		Meetings.find({}, (err, meetings) => {
			if (err) return res.status(500).end()

			master.meetings = meetings
			res.status(200).json(master)
		})
	})
}

exports.clearMathClub = async (req, res) => {
	try {
		await Members.remove({
			name: {
				$ne: 'Admin Math Club'
			}
		}).exec()

		await Meetings.remove({}).exec()

		res.status(200).end()
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.registerKPMT = (req, res) => {
	if (registrationLock) return res.status(403).end()
	var school = req.body.school
	var coachName = req.body.coachName
	var email = req.body.email
	var password = req.body.password

	if (!validateInput(school, coachName, email, password))
		return res.status(400).end()

	auth.hash(password, async hash => {
		var newSchool = new Schools({
			name: school,
			coachName: coachName,
			coachEmail: email,
			passHashed: hash,
			registrationDate: new Date(),
			active: false,
			teams: [],
			competitors: []
		})

		try {
			const schoolObject = await newSchool.save()

			const populatedSchool = await Schools.findOne({ _id: schoolObject._id })
				.populate('teams')
				.exec()
			sockets.onSchoolsChange('add', populatedSchool)
			res.status(200).end()
		} catch (err) {
			console.log(err)
			res.status(500).end()
		}
	})
}

exports.fetchSchoolProfile = (req, res) => {
	res.status(200).json(res.locals.user)
}

exports.changeSchoolPassword = (req, res) => {
	var newPassword = req.body.newPassword
	var school = res.locals.user

	if (!newPassword) return res.status(400).end()

	auth.hash(newPassword, hash => {
		Schools.updateOne(
			{
				_id: school._id
			},
			{
				$set: {
					passHashed: hash
				}
			},
			err => {
				if (err) res.status(500).end()
				else res.status(200).end()
			}
		)
	})
}

exports.addTeam = (req, res) => {
	if (kpmtLock && !res.locals.elevated) return res.status(403).end()
	var school = res.locals.user
	var team = req.body.team

	if (!team || team.length > 4 || team.length < 3) return res.status(400).end()

	// check that the new members are valid
	for (var i = 0; i < team.length; i++) {
		if (!team[i].name || !team[i].grade) return res.status(400).end()

		if (team[i].name.isOnlyWhitespace() || isNaN(team[i].grade))
			return res.status(400).end()

		if (team[i].grade > 8) return res.status(400).end()
		if (team[i].grade < 5) team[i].grade = 5
	}

	var calls = []
	var competitorIds = []

	team.forEach(competitor => {
		calls.push(callback => {
			var competitorObject = new Competitors({
				name: competitor.name,
				grade: competitor.grade,
				school: school._id,
				scores: {}
			})
			competitorObject.save(async (err, savedCompetitor) => {
				if (err) callback(err)
				else {
					// socket the new competitors here
					const populatedCompetitor = await Competitors.find({
						_id: savedCompetitor._id
					})
						.populate('school')
						.populate('team')
						.exec()
					sockets.onCompetitorsChange('add', populatedCompetitor)

					competitorIds.push(savedCompetitor._id)
					Schools.update(
						{ _id: school._id },
						{ $push: { competitors: savedCompetitor._id } },
						(err, updated) => {
							if (err) callback(err)
							else callback(null, savedCompetitor)
						}
					)
				}
			})
		})
	})

	async.parallel(calls, async (err, competitors) => {
		if (err) return res.status(500).end()

		var maxGrade = 0
		competitors.forEach(competitor => {
			if (competitor.grade > maxGrade) maxGrade = competitor.grade
		})

		if (maxGrade < 5) maxGrade = 5

		const existingTeams = await Teams.find({}).exec()

		var teamNumberDigits = 3
		var nextNumber = 10 ** (teamNumberDigits - 1) * maxGrade
		while (existingTeams.filter(t => t.number == nextNumber).length > 0) {
			// this number of digits wont suffice, time to step it up
			// this step is highly unlikely for the near future, but should future years need more than 100 teams for a grade, i gotchu covered :)
			if (10 ** (teamNumberDigits - 1) * (maxGrade + 1) - 1 === nextNumber) {
				teamNumberDigits++
				var nextNumber = 10 ** (teamNumberDigits - 1) * maxGrade
			} else {
				nextNumber++
			}
		}

		var teamObject = new Teams({
			members: competitors.map(c => c._id),
			grade: maxGrade,
			number: nextNumber,
			school: school._id,
			scores: {}
		})

		teamObject.save(async (err, savedTeam) => {
			if (err) res.status(500).end()
			else {
				// socket the new team here
				const populatedTeam = await Teams.findOne({ _id: savedTeam._id })
					.populate('members')
					.populate('school')
					.exec()
				sockets.onTeamsChange('add', populatedTeam)

				competitorIds.forEach(async competitorId => {
					await Competitors.updateOne(
						{ _id: competitorId },
						{ $set: { team: savedTeam._id } }
					).exec()
				})
				Schools.updateOne(
					{ _id: school._id },
					{ $push: { teams: savedTeam._id } },
					async (err, updated) => {
						if (err) res.status(500).end()
						else {
							// socket the updated school here
							const populatedSchool = await Schools.findOne({
								_id: school._id
							})
								.populate('teams')
								.exec()

							sockets.onSchoolsChange('edit', {
								_id: populatedSchool._id.toString(),
								data: [
									{ field: 'competitors', value: populatedSchool.competitors },
									{ field: 'teams', value: populatedSchool.teams }
								]
							})

							res.status(200).end()
						}
					}
				)
			}
		})
	})
}

exports.editTeam = async (req, res) => {
	if (kpmtLock && !res.locals.elevated) return res.status(403).end()
	const id = req.body.id
	const newMembers = req.body.members
	const school = res.locals.user

	if (!validateInput(id, newMembers)) return res.status(400).end()
	if (newMembers.length > 4) return res.status(400).end()
	if (newMembers.length < 3) return res.status(400).end()

	// make sure the team belongs to the school
	const targetTeam = await Teams.findOne({ _id: id }).exec()
	if (targetTeam.school.toString() !== school._id.toString())
		return res.status(404).end()

	// check that the new members are valid

	for (var i = 0; i < newMembers.length; i++) {
		if (!newMembers[i].name || !newMembers[i].grade)
			return res.status(400).end()

		if (newMembers[i].name.isOnlyWhitespace() || isNaN(newMembers[i].grade))
			return res.status(400).end()

		if (newMembers[i].grade > 8) return res.status(400).end()
		if (newMembers[i].grade < 5) newMembers[i].grade = 5
	}

	try {
		// perform the edits

		// remove all the old members cuz atomic edits are too tedious
		await Competitors.deleteMany({
			_id: { $in: targetTeam.members }
		}).exec()

		// socket delete these competitors
		for (var i = 0; i < targetTeam.members.length; i++) {
			await Schools.updateOne(
				{ _id: targetTeam.school },
				{ $pull: { competitors: targetTeam.members[i] } }
			).exec()

			sockets.onCompetitorsChange('remove', targetTeam.members[i].toString())
		}

		// create the new members

		var newMemberObjects = []

		for (var i = 0; i < newMembers.length; i++) {
			const newMember = new Competitors({
				name: newMembers[i].name,
				grade: newMembers[i].grade,
				team: targetTeam._id,
				school: school._id,
				scores: {}
			})

			const newMemberObject = await newMember.save()

			await Schools.updateOne(
				{ _id: targetTeam.school },
				{ $push: { competitors: newMemberObject._id } }
			).exec()

			const populatedCompetitor = await Competitors.findOne({
				_id: newMemberObject._id
			})
				.populate('school')
				.populate('team')
				.exec()

			sockets.onCompetitorsChange('add', populatedCompetitor)

			newMemberObjects.push(newMemberObject)
		}

		// recompute maxgrade
		var maxGrade = 0

		newMemberObjects.forEach(newMember => {
			if (newMember.grade > maxGrade) maxGrade = newMember.grade
		})

		if (maxGrade !== Math.floor(targetTeam.number / 100)) {
			// maxgrade changed, calculate new number
			const existingTeams = await Teams.find({}).exec()

			var teamNumberDigits = 3
			var nextNumber = 10 ** (teamNumberDigits - 1) * maxGrade
			while (existingTeams.filter(t => t.number == nextNumber).length > 0) {
				// this number of digits wont suffice, time to step it up
				// this step is highly unlikely for the near future, but should future years need more than 100 teams for a grade, i gotchu covered :)
				if (10 ** (teamNumberDigits - 1) * (maxGrade + 1) - 1 === nextNumber) {
					teamNumberDigits++
					var nextNumber = 10 ** (teamNumberDigits - 1) * maxGrade
				} else {
					nextNumber++
				}
			}

			await Teams.updateOne(
				{ _id: targetTeam._id },
				{ $set: { number: nextNumber } }
			).exec()
		}

		await Teams.updateOne(
			{ _id: targetTeam._id },
			{ $set: { grade: maxGrade, members: newMemberObjects.map(m => m._id) } }
		).exec()

		// socket the team edit
		const populatedTeam = await Teams.findOne({ _id: targetTeam._id })
			.populate('members')
			.populate('school')
			.exec()

		sockets.onTeamsChange('edit', {
			_id: populatedTeam._id.toString(),
			data: [
				{ field: 'number', value: populatedTeam.number },
				{ field: 'members', value: populatedTeam.members },
				{ field: 'grade', value: populatedTeam.grade }
			]
		})

		// socket a school change
		const populatedSchool = await Schools.findOne({ _id: targetTeam.school })
			.populate('teams')
			.exec()
		sockets.onSchoolsChange('edit', {
			_id: populatedSchool._id.toString(),
			data: [{ field: 'competitors', value: populatedSchool.competitors }]
		})

		res.status(200).end()
	} catch (error) {
		console.log(error)
		res.status(500).end()
	}
}

exports.removeTeam = async (req, res) => {
	if (kpmtLock && !res.locals.elevated) return res.status(403).end()
	var id = req.body.id
	const school = res.locals.user

	if (!id) return res.status(400).end()

	const target = await Teams.findOne({ _id: id }).exec()

	if (!target || target.school.toString() !== school._id.toString())
		return res.status(404).end()

	var calls = []

	calls.push(callback => {
		Teams.remove(
			{
				_id: id
			},
			err => {
				if (err) callback(err)
				else {
					// socket the team remove
					sockets.onTeamsChange('remove', id.toString())
					callback(null)
				}
			}
		)
	})

	calls.push(callback => {
		Schools.update(
			{
				_id: school._id
			},
			{
				$pull: { teams: id }
			},
			(err, updated) => {
				if (err) callback(err)
				else {
					callback(null)
				}
			}
		)
	})

	Teams.findOne({ _id: id }, (err, team) => {
		if (err) return res.status(404).end()

		team.members.forEach(memberID => {
			calls.push(callback => {
				Competitors.remove({ _id: memberID }, err => {
					if (err) callback(err)
					else {
						// socket remove member
						sockets.onCompetitorsChange('remove', memberID)
						callback(null)
					}
				})
			})

			calls.push(callback => {
				Schools.update(
					{ _id: school._id },
					{ $pull: { competitors: memberID } },
					err => {
						if (err) callback(err)
						else callback(null)
					}
				)
			})
		})

		async.parallel(calls, async err => {
			if (err) res.status(500).end()
			else {
				// socket the updated school here
				const populatedSchool = await Schools.findOne({ _id: school._id })
					.populate('teams')
					.exec()

				sockets.onSchoolsChange('edit', {
					_id: populatedSchool._id.toString(),
					data: [
						{ field: 'competitors', value: populatedSchool.competitors },
						{ field: 'teams', value: populatedSchool.teams }
					]
				})

				res.status(200).end()
			}
		})
	})
}

exports.addIndiv = (req, res) => {
	if (kpmtLock && !res.locals.elevated) return res.status(403).end()
	var school = res.locals.user
	var name = req.body.name
	var grade = req.body.grade

	if (!validateInput(name, grade) || isNaN(grade) || grade > 8)
		return res.status(400).end()

	if (grade < 5) grade = 5

	var newCompetitor = new Competitors({
		name: name,
		grade: grade,
		school: school._id,
		scores: {}
	})

	newCompetitor.save(async (err, savedCompetitor) => {
		if (err) res.status(500).end()
		else {
			const populatedCompetitor = await Competitors.find({
				_id: savedCompetitor._id
			})
				.populate('school')
				.populate('team')
				.exec()
			sockets.onCompetitorsChange('add', populatedCompetitor)

			Schools.update(
				{ _id: school._id },
				{ $push: { competitors: savedCompetitor._id } },
				async (err, updated) => {
					if (err) res.status(500).end()
					else {
						// socket the updated school here
						const populatedSchool = await Schools.findOne({ _id: school._id })
							.populate('teams')
							.exec()

						sockets.onSchoolsChange('edit', {
							_id: populatedSchool._id.toString(),
							data: [
								{ field: 'competitors', value: populatedSchool.competitors }
							]
						})

						res.status(200).end()
					}
				}
			)
		}
	})
}

exports.editIndiv = async (req, res) => {
	if (kpmtLock && !res.locals.elevated) return res.status(403).end()
	var school = res.locals.user
	var id = req.body.id
	var name = req.body.name
	var grade = req.body.grade

	if (!validateInput(name, grade) || isNaN(grade) || grade > 8)
		return res.status(400).end()

	if (grade < 5) grade = 5

	try {
		const targetIndiv = await Competitors.findOne({ _id: id }).exec()

		if (!targetIndiv || targetIndiv.school.toString() !== school._id.toString())
			return res.status(404).end()

		await Competitors.updateOne(
			{ _id: id },
			{ $set: { name: name, grade: grade } }
		).exec()

		sockets.onCompetitorsChange('edit', {
			_id: id,
			data: [{ field: 'name', value: name }, { field: 'grade', value: grade }]
		})

		res.status(200).end()
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.removeIndiv = async (req, res) => {
	if (kpmtLock && !res.locals.elevated) return res.status(403).end()
	const school = res.locals.user
	var id = req.body.id

	if (!id) return res.status(400).end()

	const target = await Competitors.findOne({ _id: id }).exec()

	if (!target || target.school.toString() !== school._id.toString())
		return res.status(404).end()

	Competitors.remove(
		{
			_id: id
		},
		err => {
			if (err) return res.status(500).end()

			// socket remove competitor
			sockets.onCompetitorsChange('remove', id)

			Schools.update(
				{ _id: school._id },
				{ $pull: { competitors: id } },
				async (err, updated) => {
					if (err) res.status(500).end()
					else {
						// socket the updated school here
						const populatedSchool = await Schools.findOne({ _id: school._id })
							.populate('teams')
							.exec()

						sockets.onSchoolsChange('edit', {
							_id: populatedSchool._id.toString(),
							data: [
								{ field: 'competitors', value: populatedSchool.competitors }
							]
						})

						res.status(200).end()
					}
				}
			)
		}
	)
}

exports.approveSchoolKPMT = async (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	Schools.updateOne(
		{
			_id: id
		},
		{
			$set: {
				active: true
			}
		},
		(err, updated) => {
			if (err) res.status(500).end()
			else {
				// socket updated school
				sockets.onSchoolsChange('edit', {
					_id: id,
					data: [{ field: 'active', value: true }]
				})

				res.status(200).end()
			}
		}
	)
}

exports.deactivateSchoolKPMT = (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	Schools.updateOne(
		{
			_id: id
		},
		{
			$set: {
				active: false
			}
		},
		(err, updated) => {
			if (err) res.status(500).end()
			else {
				// socket updated school
				sockets.onSchoolsChange('edit', {
					_id: id,
					data: [{ field: 'active', value: false }]
				})

				res.status(200).end()
			}
		}
	)
}

exports.removeSchoolKPMT = async (req, res) => {
	var id = req.body.id

	if (!id) return res.status(400).end()

	try {
		await Schools.deleteOne({ _id: id }).exec()

		// socket school remove
		sockets.onSchoolsChange('remove', id)

		const removeTeams = await Teams.find({ school: id }).exec()
		removeTeams.forEach(removeTeam => {
			// socket team remove
			sockets.onTeamsChange('remove', removeTeam._id)
		})

		await Teams.deleteMany({ school: id }).exec()

		const removeCompetitors = await Competitors.find({ school: id }).exec()
		removeCompetitors.forEach(removeCompetitor => {
			// socket competitor remove
			sockets.onCompetitorsChange('remove', removeCompetitor._id)
		})

		await Competitors.deleteMany({ school: id }).exec()

		res.status(200).end()
	} catch (error) {
		console.log(error)
		res.status(500).end()
	}
}

exports.setSchoolAmountPaid = async (req, res) => {
	var id = req.body.id
	var amount = req.body.amount

	if (!validateInput(id, amount)) return res.status(400).end()
	if (isNaN(amount)) return res.status(400).end()

	try {
		await Schools.updateOne(
			{ _id: id },
			{ $set: { amountPaid: amount } }
		).exec()

		sockets.onSchoolsChange('edit', {
			_id: id,
			data: [{ field: 'amountPaid', value: amount }]
		})

		res.status(200).end()
	} catch (e) {
		console.log(e)
		res.status(500).end()
	}
}

exports.getLockStatus = (req, res) => {
	res.status(200).json({ coachLock: kpmtLock, regLock: registrationLock })
}

exports.modifyKPMTLock = (req, res) => {
	if (req.body.lock === null || req.body.lock === undefined)
		res.status(400).end()
	else if (req.body.lock == true) kpmtLock = true
	else kpmtLock = false
	res.status(200).end()
}

exports.modifyKPMTRegistrationLock = (req, res) => {
	if (req.body.lock === null || req.body.lock === undefined)
		res.status(400).end()
	else if (req.body.lock == true) registrationLock = true
	else registrationLock = false
	res.status(200).end()
}

exports.exportKPMT = async (req, res) => {
	var master = {}

	try {
		master.schools = await Schools.find({})
			.populate('teams')
			.populate('competitors')
			.exec()
		master.teams = await Teams.find({})
			.populate('members')
			.exec()
		master.competitors = await Competitors.find({})
			.populate('school')
			.populate('team')
			.exec()

		res.status(200).json(master)
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.clearKPMT = (req, res) => {
	registrationLock = true
	kpmtLock = true

	Schools.remove({}, err => {
		if (err) return res.status(500).end()

		Teams.remove({}, err => {
			if (err) return res.status(500).end()

			Competitors.remove({}, err => {
				if (err) return res.status(500).end()

				res.status(200).end()
			})
		})
	})
}

exports.importKPMT = (req, res) => {
	var payload = req.body.payload

	if (
		!validateInput(payload, payload.schools, payload.teams, payload.competitors)
	)
		return res.status(400).end()

	/**
	 * payload is an object (similar to master for the export routes)
	 *
	 * {
	 *    schools: [],
	 *    teams: [],
	 *    competitors: []
	 * }
	 */

	var calls = []

	calls.push(callback => {
		Schools.insertMany(payload.schools, err => {
			if (err) callback(err)
			else callback(null)
		})
	})

	calls.push(callback => {
		Teams.insertMany(payload.teams, err => {
			if (err) callback(err)
			else callback(null)
		})
	})

	calls.push(callback => {
		Competitors.insertMany(payload.competitors, err => {
			if (err) callback(err)
			else callback(null)
		})
	})

	async.parallel(calls, err => {
		if (err) res.status(500).end()
		else res.status(200).end()
	})
}

exports.fetchCompetitors = async (req, res) => {
	try {
		const competitors = await Competitors.find({})
			.populate('school')
			.populate('team')
			.exec()

		res.status(200).json(competitors)
	} catch (err) {
		console.log(err)
		res.status(500).end()
	}
}

exports.fetchTeams = async (req, res) => {
	try {
		const teams = await Teams.find({})
			.populate('members')
			.populate('school')
			.exec()

		res.status(200).json(teams)
	} catch (error) {
		console.log(error)
		res.status(500).end()
	}
}

exports.fetchSchools = async (req, res) => {
	try {
		const schools = await Schools.find({})
			.populate('teams')
			.exec()

		res.status(200).json(schools)
	} catch (error) {
		console.log(error)
		res.status(500).end()
	}
}

const calculateWeightedScore = async competitorId => {
	const competitor = await Competitors.findOne({ _id: competitorId }).exec()

	var indiv = competitor.scores.individual
	var last = competitor.scores.individualLast
	var block = competitor.scores.block
	var mental = competitor.scores.mental
	var weightedScore =
		indiv + block / 3.0 + last / 100.0 + block / 1000.0 + mental / 10000.0

	await Competitors.updateOne(
		{ _id: competitor._id },
		{ $set: { 'scores.weighted': weightedScore } }
	)

	// socket competitor change
	const weightedCompetitor = await Competitors.findOne({
		_id: competitorId
	}).exec()
	sockets.onCompetitorsChange('edit', {
		_id: competitorId,
		data: [{ field: 'scores', value: weightedCompetitor.scores }]
	})
}

const calculateWeightedScoreTeam = async teamId => {
	const team = await Teams.findOne({ _id: teamId })
		.populate('members')
		.exec()

	var algebra = team.scores.algebra
	var geometry = team.scores.geometry
	var probability = team.scores.probability

	var mentalScores = team.members.map(m => m.scores.mental).sort((a, b) => {
		return b - a
	})
	var indivScores = team.members.map(m => m.scores.individual).sort((a, b) => {
		return b - a
	})
	var blockScores = team.members.map(m => m.scores.block).sort((a, b) => {
		return b - a
	})
	var topThreeMental = mentalScores.slice(0, 3).reduce((total, num) => {
		return total + num
	})
	var topThreeIndiv = indivScores.slice(0, 3).reduce((total, num) => {
		return total + num
	})
	var topThreeBlock = blockScores.slice(0, 3).reduce((total, num) => {
		return total + num
	})
	var weightedScore =
		algebra +
		geometry +
		probability +
		2 * topThreeMental +
		topThreeIndiv +
		topThreeBlock +
		indivScores[indivScores.length - 1] / 100.0 +
		blockScores[blockScores.length - 1] / 1000.0 +
		algebra / 10000.0

	await Teams.updateOne(
		{ _id: teamId },
		{ $set: { 'scores.weighted': weightedScore } }
	)

	// socket team change
	const weightedTeam = await Teams.findOne({
		_id: teamId
	}).exec()
	sockets.onTeamsChange('edit', {
		_id: teamId,
		data: [{ field: 'scores', value: weightedTeam.scores }]
	})
}

exports.scoreIndividual = async (req, res) => {
	var id = req.body.id
	var score = req.body.score
	var last = req.body.last

	if (!id || (!last && last !== 0) || (!score && score !== 0))
		return res.status(400).end()

	const targetIndiv = await Competitors.findOne({ _id: id }).exec()

	if (!targetIndiv) return res.status(404).end()

	Competitors.updateOne(
		{
			_id: id
		},
		{
			$set: {
				'scores.individual': score,
				'scores.individualLast': last
			}
		},
		async (err, updated) => {
			if (err) res.status(500).end()
			else {
				calculateWeightedScore(id)

				if (targetIndiv.team) {
					calculateWeightedScoreTeam(targetIndiv.team)
				}

				res.status(200).end()
			}
		}
	)
}

exports.scoreBlock = async (req, res) => {
	var id = req.body.id
	var score = req.body.score

	if (!id || (!score && score !== 0)) return res.status(400).end()

	const targetIndiv = await Competitors.findOne({ _id: id }).exec()

	if (!targetIndiv) return res.status(404).end()

	Competitors.updateOne(
		{
			_id: id
		},
		{
			$set: {
				'scores.block': score
			}
		},
		async (err, updated) => {
			if (err) res.status(500).end()
			else {
				calculateWeightedScore(id)

				if (targetIndiv.team) {
					calculateWeightedScoreTeam(targetIndiv.team)
				}

				res.status(200).end()
			}
		}
	)
}

exports.scoreMentalMath = async (req, res) => {
	var id = req.body.id
	var score = req.body.score

	if (!id || (!score && score !== 0)) return res.status(400).end()

	const targetIndiv = await Competitors.findOne({ _id: id }).exec()

	if (!targetIndiv) return res.status(404).end()

	Competitors.updateOne(
		{
			_id: id
		},
		{
			$set: {
				'scores.mental': score
			}
		},
		async (err, updated) => {
			if (err) res.status(500).end()
			else {
				calculateWeightedScore(id)

				if (targetIndiv.team) {
					calculateWeightedScoreTeam(targetIndiv.team)
				}

				res.status(200).end()
			}
		}
	)
}

exports.scoreTeam = (req, res) => {
	var id = req.body.id
	var type = req.body.type
	var score = req.body.score

	if (
		!validateInput(id, type, score) ||
		(type != 'algebra' && type != 'geometry' && type != 'probability')
	) {
		return res.status(400).end()
	}

	var id = req.body.id
	var score = req.body.score

	if (!id || (!score && score !== 0)) return res.status(400).end()

	var fieldString = 'scores.' + type

	Teams.updateOne(
		{
			_id: id
		},
		{
			$set: {
				[fieldString]: score
			}
		},
		async (err, updated) => {
			if (err) res.status(500).end()
			else {
				calculateWeightedScoreTeam(id)

				res.status(200).end()
			}
		}
	)
}
