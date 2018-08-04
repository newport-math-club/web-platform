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
import KPMTLoginPage from './Client/KPMT/KPMTLoginPage'
import KPMTRegistrationPage from './Client/KPMT/KPMTRegistrationPage'
import KPMTDashboardPage from './Client/KPMT/KPMTCoach/KPMTDashboardPage'
import KPMTLogoutPage from './Client/KPMT/KPMTCoach/KPMTLogoutPage'
import KPMTManageTeamsPage from './Client/KPMT/KPMTCoach/KPMTManageTeamsPage'
import KPMTManageIndividualsPage from './Client/KPMT/KPMTCoach/KPMTManageIndividualsPage'

String.prototype.isValidEmail = function() {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(this.toLowerCase())
}

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
					<Route exact path="/kpmt/login" component={KPMTLoginPage} />
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
					<Route exact path="/profile" component={ProfilePage} />
					<Route exact path="/logout" component={LogoutPage} />

					<Route exact path="/admin/meetings" component={MeetingsPage} />
					<Route exact path="/admin/members" component={MembersPage} />

					<Route exact path="/admin/kpmt" component={KPMTPage} />
					<Route exact path="/admin/kpmt/schools" component={KPMTSchoolsPage} />
					<Route exact path="/admin/kpmt/teams" component={KPMTTeamsPage} />
					<Route
						exact
						path="/admin/kpmt/competitors"
						component={KPMTCompetitorsPage}
					/>
					{/* <Route exact path="/admin/kpmt/entry" component={KPMTDataEntryPage} />
					<Route exact path="/admin/kpmt/entry/individual" component={KPMTDataEntryPage} />
					<Route exact path="/admin/kpmt/entry/block" component={KPMTDataEntryPage} />
					<Route exact path="/admin/kpmt/entry/mental" component={KPMTDataEntryPage} />
					<Route exact path="/admin/kpmt/entry/algebra" component={KPMTDataEntryPage} />
					<Route exact path="/admin/kpmt/entry/geometry" component={KPMTDataEntryPage} />
					<Route exact path="/admin/kpmt/entry/pp" component={KPMTDataEntryPage} /> */}
					<Route component={LostPage} />
				</Switch>
			</Router>
		)
	}
}
