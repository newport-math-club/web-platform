'use strict';

// dependencies
const request = require('request-promise');
const schemas = require('./schemas');
const auth = require('./auth');
const defaultPassword = 'newportmathclub';

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

  Members.remove({
    _id: id
  }, (err) => {
    if (err) res.status(500).end();
    else res.status(200).end();
  });
}

exports.editMember = (req, res) => {
  var id = req.body.id;
  var type = req.body.type;
  var payload = req.body.payload;

  if (!id || !type || !payload) return res.status(400).end();

  switch (type) {
    case 'name':
      Members.updateOne({
        _id: id
      }, {
        $set: {
          name: payload
        }
      }, (err) => {
        if (err) res.status(500).end();
        else res.status(200).end();
      });
      break;
    case 'yearOfGraduation':
      Members.updateOne({
        _id: id
      }, {
        $set: {
          yearOfGraduation: payload
        }
      }, (err) => {
        if (err) res.status(500).end();
        else res.status(200).end();
      });
      break;
    case 'piPoints':
      Members.updateOne({
        _id: id
      }, {
        $set: {
          piPoints: payload
        }
      }, (err) => {
        if (err) res.status(500).end();
        else res.status(200).end();
      });
      break;
    case 'email':
      Members.updateOne({
        _id: id
      }, {
        $set: {
          email: payload
        }
      }, (err) => {
        if (err) res.status(500).end();
        else res.status(200).end();
      });
      break;
    default:
      res.status(400).end();
  }
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
  Members.remove({name: {$ne: 'rootAdmin'}}, (err) => {
    if (err) return res.status(500).end();

    Meetings.remove({}, (err) => {
      if (err) return res.status(500).end();

      res.status(200).end();
    });
  });
}

exports.fetchSchoolProfile = (req, res) => {
  res.status(200).json(res.locals.user);
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