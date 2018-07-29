import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div
					className="fill-nav-remainder homepage"
					style={{ width: 'calc(100% - 8em)' }}>
					<div>
						<h1>Fridays 3:35-4:30</h1>
						<h5>Room 1106</h5>
					</div>
				</div>
			</div>
		)
	}
}
