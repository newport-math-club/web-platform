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
						<a href="https://goo.gl/forms/MWA7WKePoe5Adsze2">
							<h3>KPMT Volunteers Here!</h3>
						</a>
						<br />
						<a href="https://goo.gl/forms/rm7AfAYkt7Z8FxqF2">
							<h3>AMC Registration Here!</h3>
						</a>
					</div>
				</div>
			</div>
		)
	}
}
