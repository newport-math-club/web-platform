'use strict';

// dependencies
const request = require('request-promise');
const schemas = require('./schemas');
const bcrypt = require('bcrypt');

// mongoose models
const Meetings = schemas.Meeting;
const Members = schemas.Member;
const Schools = schemas.School;
const Competitors = schemas.Competitor;
const Teams = schemas.Team;

const bcryptCompare = (inputPassword, storedPassword, callback) => {
  bcrypt.compare(inputPassword, storedPassword, (err, res) => {
    callback(res);
  });
}

exports.authenticateMember = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) return res.status(400);

  Members.findOne({
    email: email
  }, (member) => {
    if (!member) return res.status(404);

    bcryptCompare(password, member.passHashed, (valid) => {
      if (valid) res.status(200);
      else res.status(401);
    });
  });
}

exports.authenticateCoach = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) return res.status(400);

  Schools.findOne({
    coachEmail: email
  }, (school) => {
    if (!school) return res.status(404);

    bcryptCompare(password, school.passHashed, (valid) => {
      if (valid) res.status(200);
      else res.status(401);
    });
  });
}

exports.verifyAdminSession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401);

  Members.findOne({
    _id: id
  }, (member) => {
    if (!member) return res.status(401);
    if (!member.admin) return res.status(403);
    res.locals.user = user;
    next();
  });
}

exports.verifySession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401);

  Members.findOne({_id: id}, (member) => {
    if (!member) return res.status(401);
    res.locals.user = user;
    next();
  });
}

exports.verifyCoachSession = (req, res, next) => {
  var id = req.session._id;

  if (!id) return res.status(401);

  Schools.findOne({
    _id: id
  }, (school) => {
    if (!school) return res.status(401);
    res.locals.user = user;
    next();
  });
}
