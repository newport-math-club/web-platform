import React from 'react'

import HomePage from './Client/HomePage'
import AboutPage from './Client/AboutPage'
import EventsPage from './Client/EventsPage'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import ResourcesPage from './Client/Resources/ResourcesPage'
import ArticlesPage from './Client/Resources/ArticlesPage'

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<div style={{ height: '100%' }}>
					<Route exact path="/" component={HomePage} />
					<Route exact path="/about" component={AboutPage} />
					<Route exact path="/events" component={EventsPage} />
					<Route exact path="/resources" component={ResourcesPage} />
					<Route exact path="/articles" component={ArticlesPage} />
				</div>
			</Router>
		)
	}
}
