import React, { Component } from 'react'
import { Nav, getNavItems } from '../../../Components'
import { logout } from '../../../nmc-api'

export default class KPMTLogoutPage extends Component {
	async componentDidMount() {
		const response = await logout()
		window.location.href = '/kpmt/login'
	}

	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div
					style={{
						float: 'left',
						width: 'calc(100% - 8em)',
						paddingTop: '12em',
						paddingLeft: '4em',
						paddingRight: '4em',
						paddingBottom: '2em',
						overflowY: 'auto',
						textAlign: 'center'
					}}>
					<h1>please wait...</h1>
					<h2>we're logging you out :)</h2>
				</div>
			</div>
		)
	}
}
