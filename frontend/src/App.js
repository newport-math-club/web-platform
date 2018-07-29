import React from 'react'

import HomePage from './Client/HomePage'
import AboutPage from './Client/AboutPage'

import { BrowserRouter as Router, Route } from 'react-router-dom'

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<div style={{ height: '100%' }}>
					<Route exact path="/" component={HomePage} />
					<Route exact path="/about" component={AboutPage} />
				</div>
			</Router>
		)
	}
}
