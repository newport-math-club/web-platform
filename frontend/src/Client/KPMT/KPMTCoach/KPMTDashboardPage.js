import React, { Component } from 'react'
import Modal from 'react-modal'
import { fetchSchoolProfile } from '../../../nmc-api'
import { CoachNav, getCoachNavItems } from '../../../Components'
import moment from 'moment'

Modal.setAppElement('#root')

export default class KPMTDashboardPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			profile: {
				teams: [],
				competitors: []
			}
		}
	}

	// fetch profile data here
	async componentDidMount() {
		const response = await fetchSchoolProfile()

		if (response.status != 200) {
			window.location.href = '/login'
			return
		}

		const data = await response.json()

		this.setState({
			profile: data
		})
	}

	render() {
		console.log(this.state.profile.teams)
		return (
			<div className="fullheight">
				<CoachNav items={getCoachNavItems(0)} />
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
					<h2>{this.state.profile.name}</h2>
					<h5>
						Registered:{' '}
						{moment(this.state.profile.registrationDate).format('MM/DD/YYYY')}
					</h5>
					<h3>
						Coach:{' '}
						{this.state.profile.coachName +
							', ' +
							this.state.profile.coachEmail}
					</h3>
					<h3>
						{this.state.profile.teams.length +
							' team(s), ' +
							(this.state.profile.competitors.length -
								this.state.profile.teams
									.slice()
									.map(t => t.members)
									.reduce((a, b) => a + b.length, 0)) +
							' individual(s)'}
					</h3>
					<h3>
						{this.state.profile.competitors.length} total student competitors
					</h3>
					{/* TODO: add cost calculation here */}
				</div>
			</div>
		)
	}
}
