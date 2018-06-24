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
