'use strict';

module.exports = (app) => {
    var nmcController = require('./controllers');
    var nmcMiddleware = require('./middleware');

    // health check route
    app.get('/api/ping/', (req, res) => {
        res.json('pong');
    });

    // member routes
    app.route('/members/login/').post(nmcMiddleware.authenticateMember).post(nmcController.login);
    app.route('/members/logout/').get(nmcMiddleware.verifySession).post(nmcController.logout);
    app.route('/members/profile/').get(nmcMiddleware.verifySession).get(nmcController.fetchProfile);

    // admin math club routes
    app.route('/meetings/add/').get(nmcMiddleware.verifyAdminSession).post(nmcController.newMeeting);
    app.route('/meetings/').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchMeetings);
    app.route('/members/').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchMembers);
    app.route('/members/add/').get(nmcMiddleware.verifyAdminSession).post(nmcController.newMember);
    app.route('/members/remove/').get(nmcMiddleware.verifyAdminSession).post(nmcController.removeMember);
    app.route('/members/update/').get(nmcMiddleware.verifyAdminSession).post(nmcController.editMember);
    app.route('/members/promote/').get(nmcMiddleware.verifyAdminSession).post(nmcController.promoteMember);
    app.route('/members/demote/').get(nmcMiddleware.verifyAdminSession).post(nmcController.demoteMember);

    // kpmt school/coach routes
    app.route('/kpmt/login/').post(nmcMiddleware.authenticateCoach).post(nmcController.login);
    app.route('/kpmt/logout/').get(nmcMiddleware.verifySession).post(nmcController.logout);
    app.route('/kpmt/profile/').get(nmcMiddleware.verifySession).get(nmcController.fetchSchoolProfile);

    app.route('/kpmt/team/add/').get(nmcMiddleware.verifySession).post(nmcController.addTeam);
    app.route('/kpmt/team/update/').get(nmcMiddleware.verifySession).post(nmcController.editTeam);
    app.route('/kpmt/team/remove/').get(nmcMiddleware.verifySession).post(nmcController.removeTeam);

    app.route('/kpmt/indiv/add/').get(nmcMiddleware.verifySession).post(nmcController.addIndiv);
    app.route('/kpmt/indiv/update/').get(nmcMiddleware.verifySession).post(nmcController.editIndiv);
    app.route('/kpmt/indiv/remove/').get(nmcMiddleware.verifySession).post(nmcController.removeIndiv);

    // kpmt admin management routes
    app.route('/kpmt/export/').get(nmcMiddleware.verifyAdminSession).get(nmcController.exportKPMT);
    app.route('/kpmt/clear/').get(nmcMiddleware.verifyAdminSession).post(nmcController.clearKPMT);
    app.route('/kpmt/import/').get(nmcMiddleware.verifyAdminSession).post(nmcController.importKPMT);
    app.route('/kpmt/validate/').get(nmcMiddleware.verifyAdminSession).get(nmcController.validateKPMT);

    app.route('/kpmt/competitors/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchCompetitors);
    app.route('/kpmt/teams/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchTeams);
    app.route('/kpmt/schools/:category').get(nmcMiddleware.verifyAdminSession).get(nmcController.fetchSchools);

    // kpmt admin scoring routes
    app.route('/kpmt/score/indiv/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreIndividual);
    app.route('/kpmt/score/block/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreBlock);
    app.route('/kpmt/score/mental/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreMentalMath);
    app.route('/kpmt/score/algebra/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreAlgebra);
    app.route('/kpmt/score/geometry/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreGeometry);
    app.route('/kpmt/score/probability/').get(nmcMiddleware.verifyAdminSession).post(nmcController.scoreProbability);
}