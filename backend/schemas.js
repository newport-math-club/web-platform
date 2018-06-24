'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: String,
  yearOfGraduation: Number,
  piPoints: Number,
  email: String,
  passHashed: String,
  admin: Boolean
}, {
  collection: 'members'
});

var MeetingSchema = new Schema({
  date: Number,
  members: [MemberSchema],
  piPoints: Number
}, {
  collection: 'meetings'
});

var SchoolSchema = new Schema();
SchoolSchema.set('collection', 'schools');
var CompetitorSchema = new Schema({
  name: String,
  grade: Number,
  school: SchoolSchema,
  scores: [Number] // TODO: figure out what the scoring will be like so we can replace this with an object
}, {
  collection: 'competitors'
});

var TeamSchema = new Schema({
  members: [CompetitorSchema],
  grade: Number,
  school: SchoolSchema,
  scores: [Number] // TODO: figure out what the scoring will be like so we can replace this with an object
}, {
  collection: 'teams'
});

// KPMT SCHEMAS BELOW
SchoolSchema.add({
  name: String,
  coachName: String,
  coachEmail: String,
  passHashed: String,
  active: Boolean,
  teams: [TeamSchema],
  competitors: [CompetitorSchema]
});

var Meeting = mongoose.model('Meeting', MeetingSchema, 'meetings');
var Member = mongoose.model('Member', MemberSchema, 'members');
var School = mongoose.model('School', SchoolSchema, 'schools');
var Competitor = mongoose.model('Competitor', CompetitorSchema, 'competitors');
var Team = mongoose.model('Team', TeamSchema, 'teams');

module.exports = {
  Meeting: Meeting,
  Member: Member,
  School: School,
  Competitor: Competitor,
  Team: Team
};