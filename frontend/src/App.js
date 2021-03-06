import React from 'react'

import HomePage from './Client/HomePage'
import AboutPage from './Client/AboutPage'
import EventsPage from './Client/EventsPage'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ResourcesPage from './Client/Resources/ResourcesPage'
import ArticlesPage from './Client/Resources/ArticlesPage'
import PracticePage from './Client/Resources/PracticePage'
import LinksPage from './Client/Resources/LinksPage'
import KPMTAboutPage from './Client/KPMT/KPMTAboutPage'
import KPMTPastPage from './Client/KPMT/KPMTPastPage'
import LostPage from './Client/LostPage'
import KPMTContactPage from './Client/KPMT/KPMTContactPage'
import LoginPage from './Client/LoginPage'
import ProfilePage from './Client/ProfilePage'
import LogoutPage from './Client/LogoutPage'
import MeetingsPage from './Admin/MeetingsPage'
import MembersPage from './Admin/MembersPage'
import KPMTPage from './Admin/KPMT/KPMTPage'
import KPMTSchoolsPage from './Admin/KPMT/KPMTSchoolsPage'
import KPMTTeamsPage from './Admin/KPMT/KPMTTeamsPage'
import KPMTCompetitorsPage from './Admin/KPMT/KPMTCompetitorsPage'
import KPMTVolunteersPage from './Admin/KPMT/KPMTVolunteersPage'
import KPMTLoginPage from './Client/KPMT/KPMTLoginPage'
import KPMTRegistrationPage from './Client/KPMT/KPMTRegistrationPage'
import KPMTVolunteerRegistrationPage from './Client/KPMT/KPMTVolunteerRegistrationPage'
import KPMTVolunteerDropoutPage from './Client/KPMT/KPMTVolunteerDropoutPage'
import KPMTDashboardPage from './Client/KPMT/KPMTCoach/KPMTDashboardPage'
import KPMTLogoutPage from './Client/KPMT/KPMTCoach/KPMTLogoutPage'
import KPMTManageTeamsPage from './Client/KPMT/KPMTCoach/KPMTManageTeamsPage'
import KPMTManageIndividualsPage from './Client/KPMT/KPMTCoach/KPMTManageIndividualsPage'
import KPMTDataEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTDataEntryPage'
import KPMTIndividualEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTIndividualEntryPage'
import KPMTBlockEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTBlockEntryPage'
import KPMTMentalEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTMentalEntryPage'
import KPMTAlgebraEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTAlgebraEntryPage'
import KPMTGeometryEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTGeometryEntryPage'
import KPMTPPEntryPage from './Admin/KPMT/KPMTDataEntry/KPMTPPEntryPage'
import ForgotPage from './Client/ForgotPage'
import KPMTForgotPage from './Client/KPMT/KPMTForgotPage'
import ResetPage from './Client/ResetPage'
import KPMTResetPage from './Client/KPMT/KPMTResetPage'


// eslint-disable-next-line
String.prototype.isValidEmail = function() {
	let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(this.toLowerCase())
}
// eslint-disable-next-line
String.prototype.isOnlyWhitespace = function() {
	if (this === '') return true
	return this.replace(/\s/g, '').length === 0
}

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route exact path="/about" component={AboutPage} />
					<Route exact path="/events" component={EventsPage} />
					<Route exact path="/resources" component={ResourcesPage} />
					<Route exact path="/articles" component={ArticlesPage} />
					<Route exact path="/practice" component={PracticePage} />
					<Route exact path="/links" component={LinksPage} />
					<Route exact path="/kpmt" component={KPMTAboutPage} />
					<Route exact path="/kpmt/past" component={KPMTPastPage} />
					<Route exact path="/kpmt/contact" component={KPMTContactPage} />
					<Route
						exact
						path="/kpmt/registration"
						component={KPMTRegistrationPage}
					/>
					<Route
						exact
						path="/kpmt/volunteer"
						component={KPMTVolunteerRegistrationPage}
					/>
					<Route
						path="/kpmt/volunteer/dropout/:dropout"
						component={KPMTVolunteerDropoutPage}
					/>
					<Route
						path="/kpmt/volunteer/dropout"
						component={KPMTVolunteerDropoutPage}
					/>
					<Route exact path="/kpmt/login" component={KPMTLoginPage} />
					<Route exact path="/kpmt/forgot" component={KPMTForgotPage} />
					<Route exact path="/kpmt/reset" component={KPMTResetPage} />
					<Route
						exact
						path="/kpmt/coach/dashboard"
						component={KPMTDashboardPage}
					/>
					<Route
						exact
						path="/kpmt/coach/teams"
						component={KPMTManageTeamsPage}
					/>
					<Route
						exact
						path="/kpmt/coach/individuals"
						component={KPMTManageIndividualsPage}
					/>
					<Route exact path="/coachLogout" component={KPMTLogoutPage} />

					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/forgot" component={ForgotPage} />
					<Route exact path="/reset" component={ResetPage} />
					<Route exact path="/profile" component={ProfilePage} />
					<Route exact path="/logout" component={LogoutPage} />

					<Route exact path="/admin/meetings" component={MeetingsPage} />
					<Route exact path="/admin/members" component={MembersPage} />

					<Route exact path="/admin/kpmt" component={KPMTPage} />
					<Route exact path="/admin/kpmt/schools" component={KPMTSchoolsPage} />
					<Route exact path="/admin/kpmt/teams" component={KPMTTeamsPage} />
					<Route exact path="/admin/kpmt/volunteers" component={KPMTVolunteersPage} />
					<Route
						exact
						path="/admin/kpmt/competitors"
						component={KPMTCompetitorsPage}
					/>
					<Route exact path="/admin/kpmt/entry" component={KPMTDataEntryPage} />
					<Route
						exact
						path="/admin/kpmt/entry/individual"
						component={KPMTIndividualEntryPage}
					/>
					<Route
						exact
						path="/admin/kpmt/entry/block"
						component={KPMTBlockEntryPage}
					/>
					<Route
						exact
						path="/admin/kpmt/entry/mental"
						component={KPMTMentalEntryPage}
					/>
					<Route
						exact
						path="/admin/kpmt/entry/algebra"
						component={KPMTAlgebraEntryPage}
					/>
					<Route
						exact
						path="/admin/kpmt/entry/geometry"
						component={KPMTGeometryEntryPage}
					/>
					<Route
						exact
						path="/admin/kpmt/entry/pp"
						component={KPMTPPEntryPage}
					/>
					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
