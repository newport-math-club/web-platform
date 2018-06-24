'use strict';

// dependencies
const request = require('request-promise');
const schemas = require('./schemas');

// mongoose models
const Meetings = schemas.Meeting;
const Members = schemas.Member;
const Schools = schemas.School;
const Competitors = schemas.Competitor;
const Teams = schemas.Team;

exports.login = (req, res) => {
  var user = res.locals.user;
  req.session._id = user._id;

  res.status(200).end();
}

exports.logout = (req, res) => {
  var user = res.locals.user;

  req.session.destroy((err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.fetchProfile = (req, res) => {
  res.status(200).json(res.locals.user);
}

exports.changePassword = (req, res) => {

}

exports.newMeeting = (req, res) => {
  if (!req.body.members) return res.status(400).end();

  var piPoints = req.body.piPoints ? req.body.piPoints : 1;
  var date = req.body.date ? req.body.date : Date.now();
  var members = req.body.members;
  var newMeeting = new Meetings({
    date: date,
    members: members,
    piPoints: piPoints
  });

  newMeeting.save((err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  })
}

exports.fetchMeetings = (req, res) => {

}

exports.fetchMembers = (req, res) => {

}

exports.newMember = (req, res) => {

}

exports.removeMember = (req, res) => {

}

exports.editMember = (req, res) => {

}

exports.promoteMember = (req, res) => {

}

exports.demoteMember = (req, res) => {

}

exports.fetchSchoolProfile = (req, res) => {

}

exports.addTeam = (req, res) => {

}

exports.editTeam = (req, res) => {

}

exports.removeTeam = (req, res) => {

}

exports.addIndiv = (req, res) => {

}

exports.editIndiv = (req, res) => {

}

exports.removeIndiv = (req, res) => {

}

exports.exportKPMT = (req, res) => {

}

exports.clearKPMT = (req, res) => {

}

exports.importKPMT = (req, res) => {

}

exports.validateKPMT = (req, res) => {

}

exports.fetchCompetitors = (req, res) => {

}

exports.fetchTeams = (req, res) => {

}

exports.fetchSchools = (req, res) => {

}

exports.scoreIndividual = (req, res) => {

}

exports.scoreBlock = (req, res) => {

}

exports.scoreMentalMath = (req, res) => {

}

exports.scoreTeam = (req, res) => {

}
