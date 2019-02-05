import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div className="fill-nav-remainder homepage">
					<div>
						<h1>Fridays</h1>
						<h1>3:40-4:30</h1>
						<h5>Room 1106</h5>
						<h5>contact@newportmathclub.org</h5>
						<br />
						<br />
					</div>
				</div>
			</div>
		)
	}
}
