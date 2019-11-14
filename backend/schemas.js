'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MemberSchema = new Schema(
	{
		name: String,
		yearOfGraduation: Number,
		piPoints: Number,
		email: String,
		passHashed: String,
		admin: Boolean,
		passResetToken: String
	},
	{
		collection: 'members'
	}
)

var MeetingSchema = new Schema(
	{
		date: Date,
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Member'
			}
		],
		description: String,
		piPoints: {
			type: Number,
			default: 0
		}
	},
	{
		collection: 'meetings'
	}
)

var CompetitorSchema = new Schema(
	{
		name: String,
		grade: Number,
		competeGrade: Number,
		school: {
			type: Schema.Types.ObjectId,
			ref: 'School'
		},
		team: {
			type: Schema.Types.ObjectId,
			ref: 'Team'
		},
		scores: {
			weighted: {
				type: Number,
				default: 0
			},
			individual: {
				type: Number,
				default: 0
			},
			individualLast: {
				type: Number,
				default: 0
			},
			block: {
				type: Number,
				default: 0
			},
			mental: {
				type: Number,
				default: 0
			}
		}
	},
	{
		collection: 'competitors'
	}
)

var TeamSchema = new Schema(
	{
		number: {
			type: Number,
			unique: true
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Competitor'
			}
		],
		grade: Number,
		school: {
			type: Schema.Types.ObjectId,
			ref: 'School'
		},
		scores: {
			weighted: {
				type: Number,
				default: 0
			},
			algebra: {
				type: Number,
				default: 0
			},
			geometry: {
				type: Number,
				default: 0
			},
			probability: {
				type: Number,
				default: 0
			}
		}
	},
	{
		collection: 'teams'
	}
)

var VolunteerSchema = new Schema({
	name: String,
	grade: Number,
	email: String, 
	school: String,
	preferredRole: String,
	role: String,
	dropoutCode: String
}, {
	collection: "volunteers"
})

// KPMT SCHEMAS BELOW
var SchoolSchema = new Schema(
	{
		name: String,
		coachName: {
			type: String,
			unique: true
		},
		coachEmail: String,
		passHashed: String,
		amountPaid: {
			type: Number,
			default: 0
		},
		registrationDate: Date,
		active: Boolean,
		teams: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Team'
			}
		],
		competitors: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Competitor'
			}
		],
		passResetToken: String
	},
	{ collection: 'schools' }
)

var Meeting = mongoose.model('Meeting', MeetingSchema, 'meetings')
var Member = mongoose.model('Member', MemberSchema, 'members')
var School = mongoose.model('School', SchoolSchema, 'schools')
var Competitor = mongoose.model('Competitor', CompetitorSchema, 'competitors')
var Team = mongoose.model('Team', TeamSchema, 'teams')
var Volunteer = mongoose.model("Volunteer", VolunteerSchema, 'volunteers')

module.exports = {
	Meeting: Meeting,
	Member: Member,
	School: School,
	Competitor: Competitor,
	Team: Team,
	Volunteer: Volunteer
}
