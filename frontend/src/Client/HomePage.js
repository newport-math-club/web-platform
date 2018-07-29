import React, { Component } from 'react'
import { Nav, getNavItems, LeftPane } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<LeftPane header="Officers" />
			</div>
		)
	}
}
