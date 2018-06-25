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
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) return res.status(400).end();

  Members.findOne({
    email: email
  }, (err, member) => {
    if (err || !member) return res.status(404).end();
    auth.check(password, member.passHashed, (valid) => {
      if (valid) {
        res.locals.user = member;
        req.session.authenticated = true;
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
  }, (err, school) => {
    if (err || !school) return res.status(404).end();
    if (!school.active) return res.status(403).end();
    
    auth.check(password, school.passHashed, (valid) => {
      if (valid) {
        res.locals.user = school;
        req.session.authenticated = true;
        next();
      } else res.status(401).end();
    });
  });
}

exports.verifyAdminSession = (req, res, next) => {
  var id = req.session._id;

  if (!id || !req.session.authenticated) return res.status(401).end();

  Members.findOne({
    _id: id
  }, (err, member) => {
    if (err || !member) return res.status(401).end();
    if (!member.admin) return res.status(403).end();
    res.locals.user = member;
    next();
  });
}

exports.verifySession = (req, res, next) => {
  var id = req.session._id;

  if (!id || !req.session.authenticated) return res.status(401).end();

  Members.findOne({
    _id: id
  }, (err, member) => {
    if (err || !member) return res.status(401).end();
    res.locals.user = member;
    next();
  });
}

exports.verifyCoachSession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401).end();

  Schools.findOne({
    _id: id
  }, (err, school) => {
    if (err || !school) return res.status(401).end();
    res.locals.user = school;
    next();
  });
}