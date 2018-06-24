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
    app.route('/api/members/logout/').get(nmcMiddleware.verifySession).post(nmcController.logout);
    app.route('/api/members/profile/').get(nmcMiddleware.verifySession).get(nmcController.fetchProfile);
    app.route('/api/member/change-password/').get(nmcMiddleware.verifySession).post(nmcMiddleware.authenticateMember).post(nmcController.changePassword);

    // admin math club routes
    app.route('/api/meetings/add/').get(nmcMiddleware.verifyAdminSession).post(nmcController.newMeeting);
    app.route('/api/meetings/').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchMeetings);
    app.route('/api/members/').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchMembers);
    app.route('/api/members/add/').get(nmcMiddleware.verifyAdminSession).post(nmcController.newMember);
    app.route('/api/members/remove/').get(nmcMiddleware.verifyAdminSession).post(nmcController.removeMember);
    app.route('/api/members/update/').get(nmcMiddleware.verifyAdminSession).post(nmcController.editMember);
    app.route('/api/members/promote/').get(nmcMiddleware.verifyAdminSession).post(nmcController.promoteMember);
    app.route('/api/members/demote/').get(nmcMiddleware.verifyAdminSession).post(nmcController.demoteMember);

    // kpmt school/coach routes
    app.route('/api/kpmt/login/').post(nmcMiddleware.authenticateCoach).post(nmcController.login);
    app.route('/api/kpmt/logout/').get(nmcMiddleware.verifySession).post(nmcController.logout);
    app.route('/api/kpmt/profile/').get(nmcMiddleware.verifySession).get(nmcController.fetchSchoolProfile);

    app.route('/api/kpmt/team/add/').get(nmcMiddleware.verifySession).post(nmcController.addTeam);
    app.route('/api/kpmt/team/update/').get(nmcMiddleware.verifySession).post(nmcController.editTeam);
    app.route('/api/kpmt/team/remove/').get(nmcMiddleware.verifySession).post(nmcController.removeTeam);

    app.route('/api/kpmt/indiv/add/').get(nmcMiddleware.verifySession).post(nmcController.addIndiv);
    app.route('/api/kpmt/indiv/update/').get(nmcMiddleware.verifySession).post(nmcController.editIndiv);
    app.route('/api/kpmt/indiv/remove/').get(nmcMiddleware.verifySession).post(nmcController.removeIndiv);

    // kpmt admin management routes
    app.route('/api/kpmt/export/').get(nmcMiddleware.verifyAdminSession).get(nmcController.exportKPMT);
    app.route('/api/kpmt/clear/').get(nmcMiddleware.verifyAdminSession).post(nmcController.clearKPMT);
    app.route('/api/kpmt/import/').get(nmcMiddleware.verifyAdminSession).post(nmcController.importKPMT);
    app.route('/api/kpmt/validate/').get(nmcMiddleware.verifyAdminSession).get(nmcController.validateKPMT);

    app.route('/api/kpmt/competitors/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchCompetitors);
    app.route('/api/kpmt/teams/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchTeams);
    app.route('/api/kpmt/schools/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchSchools);

    // kpmt admin scoring routes
    app.route('/api/kpmt/score/indiv/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreIndividual);
    app.route('/api/kpmt/score/block/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreBlock);
    app.route('/api/kpmt/score/mental/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreMentalMath);
    app.route('/api/kpmt/score/team/:type').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreTeam);
}