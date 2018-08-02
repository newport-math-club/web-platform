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
		admin: Boolean
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

// KPMT SCHEMAS BELOW
var SchoolSchema = new Schema(
	{
		name: String,
		coachName: String,
		coachEmail: String,
		passHashed: String,
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
		]
	},
	{ collection: 'schools' }
)

var Meeting = mongoose.model('Meeting', MeetingSchema, 'meetings')
var Member = mongoose.model('Member', MemberSchema, 'members')
var School = mongoose.model('School', SchoolSchema, 'schools')
var Competitor = mongoose.model('Competitor', CompetitorSchema, 'competitors')
var Team = mongoose.model('Team', TeamSchema, 'teams')

module.exports = {
	Meeting: Meeting,
	Member: Member,
	School: School,
	Competitor: Competitor,
	Team: Team
}
