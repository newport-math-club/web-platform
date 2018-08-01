import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane, Bio } from '../Components'
import { fetchProfile } from '../nmc-api'
import SocketEventHandlers, { Sockets } from '../Sockets'

export default class ProfilePage extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeToPiPointChange()
	}

	// fetch profile data here
	async componentDidMount() {
		SocketEventHandlers.subscribeToPiPointChange(data => {
			this.setState({ piPoints: this.state.piPoints + parseInt(data) })
		})

		const response = await fetchProfile()

		if (response.status != 200) {
			window.location.href = '/login'
			return
		}

		const data = await response.json()

		this.setState({
			name: data.name,
			email: data.email,
			piPoints: data.piPoints ? data.piPoints : 0,
			year: data.yearOfGraduation,
			admin: data.admin
		})
	}

	render() {
		const firstName = this.state.name ? this.state.name.split(' ')[0] : ''
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(4, 0, firstName)} />
				<div
					style={{
						float: 'left',
						marginLeft: '20%',
						width: 'calc(60% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>{this.state.name}</h2>
					<h5>email: {this.state.email}</h5>
					<h5>year of graduation: {this.state.year}</h5>
					{this.state.admin && (
						<h5>
							you are an admin; click <a href="/admin/meetings">here</a> to
							access the admin dashboard
						</h5>
					)}

					<br />
					<h2>you have {this.state.piPoints} pi points</h2>
				</div>
			</div>
		)
	}
}
