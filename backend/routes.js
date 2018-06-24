'use strict';

module.exports = (app) => {
    var nmcController = require('./controllers');
    var nmcMiddleware = require('./middleware');

    // health check route
    app.get('/api/ping/', (req, res) => {
        res.json('pong');
    });

    // member routes
    app.route('/api/members/login/').post(nmcMiddleware.authenticateMember).post(nmcController.login);
    app.route('/api/members/logout/').post(nmcMiddleware.verifySession).post(nmcController.logout);
    app.route('/api/members/profile/').get(nmcMiddleware.verifySession).get(nmcController.fetchProfile);
    app.route('/api/members/change-password/').post(nmcMiddleware.verifySession).post(nmcMiddleware.authenticateMember).post(nmcController.changePassword);

    // admin math club routes
    app.route('/api/meetings/add/').post(nmcMiddleware.verifyAdminSession).post(nmcController.newMeeting);
    app.route('/api/meetings/').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchMeetings);
    app.route('/api/members/').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchMembers);
    app.route('/api/members/add/').post(nmcMiddleware.verifyAdminSession).post(nmcController.newMember);
    app.route('/api/members/remove/').post(nmcMiddleware.verifyAdminSession).post(nmcController.removeMember);
    app.route('/api/members/update/').post(nmcMiddleware.verifyAdminSession).post(nmcController.editMember);
    app.route('/api/members/promote/').post(nmcMiddleware.verifyAdminSession).post(nmcController.promoteMember);
    app.route('/api/members/demote/').post(nmcMiddleware.verifyAdminSession).post(nmcController.demoteMember);
    app.route('/api/export/').post(nmcMiddleware.verifyAdminSession).post(nmcController.exportMathClub);
    app.route('/api/clear/').post(nmcMiddleware.verifyAdminSession).post(nmcController.clearMathClub);

    // kpmt school/coach routes
    app.route('/api/kpmt/login/').post(nmcMiddleware.authenticateCoach).post(nmcController.login);
    app.route('/api/kpmt/logout/').post(nmcMiddleware.verifySession).post(nmcController.logout);
    app.route('/api/kpmt/profile/').get(nmcMiddleware.verifySession).get(nmcController.fetchSchoolProfile);

    app.route('/api/kpmt/team/add/').post(nmcMiddleware.verifySession).post(nmcController.addTeam);
    app.route('/api/kpmt/team/update/').post(nmcMiddleware.verifySession).post(nmcController.editTeam);
    app.route('/api/kpmt/team/remove/').post(nmcMiddleware.verifySession).post(nmcController.removeTeam);

    app.route('/api/kpmt/indiv/add/').post(nmcMiddleware.verifySession).post(nmcController.addIndiv);
    app.route('/api/kpmt/indiv/update/').post(nmcMiddleware.verifySession).post(nmcController.editIndiv);
    app.route('/api/kpmt/indiv/remove/').post(nmcMiddleware.verifySession).post(nmcController.removeIndiv);

    // kpmt admin management routes
    app.route('/api/kpmt/export/').get(nmcMiddleware.verifyAdminSession).get(nmcController.exportKPMT);
    app.route('/api/kpmt/clear/').post(nmcMiddleware.verifyAdminSession).post(nmcController.clearKPMT);
    app.route('/api/kpmt/import/').post(nmcMiddleware.verifyAdminSession).post(nmcController.importKPMT);
    app.route('/api/kpmt/validate/').get(nmcMiddleware.verifyAdminSession).get(nmcController.validateKPMT);

    app.route('/api/kpmt/competitors/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchCompetitors);
    app.route('/api/kpmt/teams/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchTeams);
    app.route('/api/kpmt/schools/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchSchools);

    // kpmt admin scoring routes
    app.route('/api/kpmt/score/indiv/').post(nmcMiddleware.verifyAdminSession).post(nmcController.scoreIndividual);
    app.route('/api/kpmt/score/block/').post(nmcMiddleware.verifyAdminSession).post(nmcController.scoreBlock);
    app.route('/api/kpmt/score/mental/').post(nmcMiddleware.verifyAdminSession).post(nmcController.scoreMentalMath);
    app.route('/api/kpmt/score/team/:type').post(nmcMiddleware.verifyAdminSession).post(nmcController.scoreTeam);
}