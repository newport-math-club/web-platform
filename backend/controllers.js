'use strict';

// dependencies
const request = require('request-promise');
const async = require('async');
const schemas = require('./schemas');
const auth = require('./auth');
const defaultPassword = 'newportmathclub';

// mongoose models
const Meetings = schemas.Meeting;
const Members = schemas.Member;
const Schools = schemas.School;
const Competitors = schemas.Competitor;
const Teams = schemas.Team;

// helper function
// TODO: make every controller use this
const validateInput = (...parameters) => {
  for (var i = 0; i < parameters.length; i++) {
    if (!parameters[i]) return false;
  }
}

// route controllers
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
  var newPassword = req.body.newPassword;
  var user = res.locals.user;

  if (!newPassword) return res.status(400).end();

  auth.hash(newPassword, (hash) => {
    Members.updateOne({
      _id: user._id
    }, {
      $set: {
        passHashed: hash
      }
    }, (err, newMember) => {
      if (err) res.status(500).end();
      else res.status(200).end();
    });
  });

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
  Meetings.find({}).sort({
    'date': -1
  }).exec((err, meetings) => {
    if (err) res.status(500).end();
    else res.status(200).json(meetings);
  });
}

exports.fetchMembers = (req, res) => {
  Members.find({}).sort({
    'admin': -1
  }).exec((err, members) => {
    if (err) res.status(500).end();
    else res.status(200).json(members);
  });
}

exports.newMember = (req, res) => {
  var name = req.body.name;
  var yearOfGraduation = req.body.yearOfGraduation;
  var email = req.body.email;
  var admin = req.body.admin;

  if (!name || !yearOfGraduation || !email || !admin) return res.status(400).end();

  auth.hash(defaultPassword, (hash) => {
    var newMember = new Members({
      name: name,
      yearOfGraduation: yearOfGraduation,
      piPoints: 0,
      email: email,
      passHashed: hash,
      admin: admin
    });

    newMember.save((err) => {
      if (err) res.status(500).end();
      else res.status(200).end();
    });
  });
}

exports.removeMember = (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  Meetings.update({
    members: id
  }, {
    $pull: {
      members: id
    }
  }, (err) => {
    if (err) res.status(500).end();

    Members.remove({
      _id: id
    }, (err) => {
      if (err) res.status(500).end();
      else res.status(200).end();
    });
  });
}

exports.editMember = (req, res) => {
  var id = req.body.id;
  var type = req.body.type;
  var payload = req.body.payload;

  if (!id || !type || !payload) return res.status(400).end();
  if (type != 'name' && type != 'yearOfGraduation' && type != 'piPoints' && type != 'email') return res.status(400).end();

  Members.updateOne({
    _id: id
  }, {
    $set: {
      [type]: payload
    }
  }, (err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.promoteMember = (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  Members.updateOne({
    _id: id
  }, {
    $set: {
      admin: true
    }
  }, (err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.demoteMember = (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  Members.updateOne({
    _id: id
  }, {
    $set: {
      admin: false
    }
  }, (err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.exportMathClub = (req, res) => {
  var master = {};
  Members.find({}, (err, members) => {
    if (err) return res.status(500).end();

    master.members = members;

    Meetings.find({}, (err, meetings) => {
      if (err) return res.status(500).end();

      master.meetings = meetings;
      res.status(200).json(master);
    });
  });
}

exports.clearMathClub = (req, res) => {
  Members.remove({
    name: {
      $ne: 'rootAdmin'
    }
  }, (err) => {
    if (err) return res.status(500).end();

    Meetings.remove({}, (err) => {
      if (err) return res.status(500).end();

      res.status(200).end();
    });
  });
}

exports.registerKPMT = (req, res) => {
  var school = req.body.school;
  var coachName = req.body.coachName;
  var email = req.body.email;
  var password = req.body.password;

  if (!school || !coachName || !email || !password) return res.status(400).end();

  auth.hash(password, (hash) => {
    var newSchool = new Schools({
      name: school,
      coachName: coachName,
      coachEmail: email,
      passHashed: hash,
      active: false,
      teams: [],
      competitors: []
    });

    newSchool.save((err) => {
      if (err) res.status(500).end();
      else res.status(200).end();
    })
  });

}

exports.fetchSchoolProfile = (req, res) => {
  res.status(200).json(res.locals.user);
}

exports.addTeam = (req, res) => {
  if (kpmtLock) return res.status(403).end();
  var school = res.locals.user;
  var team = req.body.team;

  if (team.length > 4 || team.length < 3) return res.status(400).end();

  var calls = [];
  for (var i = 0; i < team.length; i++) {
    var competitor = team[i];
    if (!competitor.name || !competitor.grade) return res.status(400);

    calls.push((callback) => {
      var competitorObject = new Competitors({
        name: competitor.name,
        grade: competitor.grade,
        school: school._id,
        scores: []
      });
      competitorObject.save((err, savedCompetitor) => {
        if (err) callback(err);
        else {
          Schools.update({_id: school._id}, { $push: {competitors: savedCompetitor._id}}, (err, updated) => {
            if (err) callback(err);
            else callback(null, savedCompetitor);
          });
        }
      });
    });
  }

  async.parallel(calls, (err, competitors) => {
    if (err) return res.status(500).end();

    var maxGrade = 0;
    competitors.forEach((competitor) => {
      if (competitor.grade > maxGrade) maxGrade = competitor.grade;
    });

    var teamObject = new Team({
      members: competitors.map(c => c._id),
      grade: maxGrade,
      school: school._id,
      scores: []
    });

    teamObject.save((err, savedTeam) => {
      if (err) res.status(500).end();
      else {
        Schools.update({_id: school._id}, { $push: {teams: savedTeam._id}}, (err, updated) => {
          if (err) res.status(500).end();
          else res.status(200).end();
        });
      }
    });
  })
}

exports.removeTeam = (req, res) => {
  if (kpmtLock) return res.status(403).end();
  var id = req.body.id;
  var school = res.locals.user;

  if (!id) return res.status(400).end();

  calls = [];

  calls.push((callback) => {
    Teams.remove({
      _id: id
    }, (err) => {
      if (err) callback(err);
      else callback(null);
    });
  });

  calls.push((callback) => {
    Schools.update({
      _id: school._id
    }, {
      $pull: {teams: id}
    }, (err) => {
      if (err) callback(err);
      else callback(null);
    });
  });

  Teams.findOne({_id: id}, (err, team) => {
    if (err) return res.status(404).end();

    team.members.forEach((memberID) => {
      calls.push((callback) => {
        Competitors.remove({_id: memberID}, (err) => {
          if (err) callback(err);
          else callback(null);
        });
      });

      calls.push((callback) => {
        Schools.update({_id: school._id}, { $pull: {competitors: memberID}}, (err) => {
          if (err) callback(err);
          else callback(null);
        });
      });
    });

    async.parallel(calls, (err) => {
      if (err) res.status(500).end();
      else res.status(200).end();
    });
  });
  
}

exports.addIndiv = (req, res) => {
  if (kpmtLock) return res.status(403).end();
  var school = res.locals.user;
  var name = req.body.name;
  var grade = req.body.grade;

  if (!name || !grade) return res.status(400).end();

  var newCompetitor = new Competitors({
    name: name,
    grade: grade,
    school: school._id,
    scores: []
  });

  newCompetitor.save((err, savedCompetitor) => {
    if (err) res.status(500).end();
    else {
      Schools.update({_id: school._id}, { $push: {competitors: savedCompetitor._id}}, (err, updated) => {
        if (err) res.status(500).end();
        else res.status(200).end();
      });
    }
  });
}

// TODO: remove from school competitors and master competitors
exports.removeIndiv = (req, res) => {
  if (kpmtLock) return res.status(403).end();
  var id = req.body.id;

  if (!id) return res.status(400).end();

  Competitors.remove({
    _id: id
  }, (err) => {
    if (err) return res.status(500).end();

    Schools.update({_id: res.locals.user._id}, { $pull: {competitors: id}}, (err) => {
      if (err) res.status(500).end();
      else res.status(200).end();
    });
  });
}

exports.approveSchoolKPMT = (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  Schools.updateOne({
    _id: id
  }, {
    $set: {
      active: true
    }
  }, (err, updated) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.removeSchoolKPMT = (req, res) => {
  var id = req.body.id;

  if (!id) return res.status(400).end();

  Schools.remove({
    _id: id
  }, (err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.modifyKPMTLock = (req, res) => {
  if (req.body.lock === null || req.body.lock === undefined) res.status(400).end();
  else if (req.body.lock == true) kpmtLock = true;
  else kpmtLock = false;
  res.status(200).end();
}

exports.exportKPMT = (req, res) => {
  var master = {};
  Schools.find({}, (err, schools) => {
    if (err) return res.status(500).end();

    master.schools = schools;

    Teams.find({}, (err, teams) => {
      if (err) return res.status(500).end();

      master.teams = teams;

      Competitors.find({}, (err, competitors) => {
        if (err) return res.status(500).end();

        master.competitors = competitors;
        res.status(200).json(master);
      });
    });
  });
}

exports.clearKPMT = (req, res) => {
  Schools.remove({}, (err) => {
    if (err) return res.status(500).end();

    Teams.remove({}, (err) => {
      if (err) return res.status(500).end();

      Competitors.remove({}, (err) => {
        if (err) return res.status(500).end();

        res.status(200).end();
      });
    });
  });
}

exports.importKPMT = (req, res) => {
  var payload = req.body.payload;

  if (!payload || !payload.schools || !payload.teams || !payload.competitors) return res.status(400).end();

  /**
   * payload is an object (similar to master for the export routes)
   * 
   * {
   *    schools: [],
   *    teams: [],
   *    competitors: []
   * }
   */

  var calls = [];

  calls.push((callback) => {
    Schools.insertMany(payload.schools, (err) => {
      if (err) callback(err);
      else callback(null);
    });
  });

  calls.push((callback) => {
    Teams.insertMany(payload.teams, (err) => {
      if (err) callback(err);
      else callback(null);
    });
  });

  calls.push((callback) => {
    Competitors.insertMany(payload.competitors, (err) => {
      if (err) callback(err);
      else callback(null);
    });
  });

  async.parallel(calls, (err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  })
}

// TODO: these three fetches need to take in req.params.category
exports.fetchCompetitors = (req, res) => {
  Competitors.find({}, (err, competitors) => {
    if (err) res.status(500).end();
    else res.status(200).json(competitors);
  });
}

exports.fetchTeams = (req, res) => {
  Teams.find({}, (err, teams) => {
    if (err) res.status(500).end();
    else res.status(200).json(teams);
  });
}

exports.fetchSchools = (req, res) => {
  Schools.find({}, (err, schools) => {
    if (err) res.status(500).end();
    else res.status(200).json(schools);
  });
}

exports.scoreIndividual = (req, res) => {
  var id = req.body.id;
  var score = req.body.score;
  var last = req.body.last;

  if (!id || !score || !last) return res.status(400).end();

  Competitors.updateOne({
    _id: id
  }, {
    $set: {
      'scores.individual': score,
      'scores.individualLast': last
    }
  }, (err, updated) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.scoreBlock = (req, res) => {
  var id = req.body.id;
  var score = req.body.score;

  if (!id || !score) return res.status(400).end();

  Competitors.updateOne({
    _id: id
  }, {
    $set: {
      'scores.block': score
    }
  }, (err, updated) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.scoreMentalMath = (req, res) => {
  var id = req.body.id;
  var score = req.body.score;

  if (!id || !score) return res.status(400).end();

  Competitors.updateOne({
    _id: id
  }, {
    $set: {
      'scores.mental': score
    }
  }, (err, updated) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.scoreTeam = (req, res) => {
  var id = req.body.id;
  var type = req.body.type;
  var score = req.body.score;

  if (!id || !type || !score || (type != 'algebra' && type != 'geometry' && type != 'probability')) {
    return res.status(400).end();
  }

  var id = req.body.id;
  var score = req.body.score;

  if (!id || !score) return res.status(400).end();

  var fieldString = 'scores.' + type;

  Teams.updateOne({
    _id: id
  }, {
    $set: {
      [fieldString]: score
    }
  }, (err, updated) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}