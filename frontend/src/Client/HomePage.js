import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div
					className="fill-nav-remainder homepage"
					style={{ width: 'calc(100% - 8em)' }}>
					<div style = {{width: "50%"}}>
						<h1>Fridays 3:35-4:30</h1>
						<h5>Room 1106</h5>
						<h5>contact@newportmathclub.org</h5>
						<br />
						<br />
						<a href="/kpmt">
							<h4>Knight of Pi Math Tournament is on December 12th this year!</h4>
							{/* <h5 style = {{color: "#527aff"}}>This is likely our final decision. 
							However, if we decide to reschedule KPMT to a later date, registered coaches will be notified through email. 
							Please email if you have questions.</h5> */}
						</a>
					</div>
				</div>
			</div>
		)
	}
}
