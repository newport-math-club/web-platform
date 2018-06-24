'use strict';

// dependencies
const request = require('request-promise');
const schemas = require('./schemas');
const auth = require('./auth');

// mongoose models
const Meetings = schemas.Meeting;
const Members = schemas.Member;
const Schools = schemas.School;
const Competitors = schemas.Competitor;
const Teams = schemas.Team;

exports.authenticateMember = (req, res, next) => {
  console.log('authenticating member');
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) return res.status(400).end();

  Members.findOne({
    email: email
  }, (member) => {
    if (!member) return res.status(404).end();
    console.log('found member');
    auth.check(password, member.passHashed, (valid) => {
      console.log('authentication results: ' + valid);
      if (valid) {
        res.locals.user = member;
        next();
      } else res.status(401).end();
    });
  });
}

exports.authenticateCoach = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) return res.status(400).end();

  Schools.findOne({
    coachEmail: email
  }, (school) => {
    if (!school) return res.status(404).end();

    auth.check(password, school.passHashed, (valid) => {
      if (valid) {
        res.locals.user = school;
        next();
      } else res.status(401).end();
    });
  });
}

exports.verifyAdminSession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401).end();

  Members.findOne({
    _id: id
  }, (member) => {
    if (!member) return res.status(401).end();
    if (!member.admin) return res.status(403).end();
    res.locals.user = user;
    next();
  });
}

exports.verifySession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401).end();

  Members.findOne({
    _id: id
  }, (member) => {
    if (!member) return res.status(401).end();
    res.locals.user = user;
    next();
  });
}

exports.verifyCoachSession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401).end();

  Schools.findOne({
    _id: id
  }, (school) => {
    if (!school) return res.status(401).end();
    res.locals.user = user;
    next();
  });
}