import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div className="fill-nav-remainder homepage">
					<div>
						<h1>Fridays 3:35-4:30</h1>
						<h5>Room 1106</h5>
						<h5>contact@newportmathclub.org</h5>
						<br />
						<br />
						<h2>KPMT: March 2nd</h2>
						<h5>Registration and Volunteer Deadline: February 25th, 2019</h5>
						<a href="/kpmt/registration">
							<h4>KPMT Registration</h4>
						</a>
						<a href="https://goo.gl/forms/FecuWxzBtmZpMnt22">
							<h4>KPMT Volunteer Registration</h4>
						</a>
					</div>
				</div>
			</div>
		)
	}
}
