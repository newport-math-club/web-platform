import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Textbox,
	Table,
	ToggleButton
} from '../../Components'
import Modal from 'react-modal'
import SocketEventHandlers from '../../Sockets'
import { fetchKPMTSchools, fetchKPMTTeams } from '../../nmc-api'
import { NotificationContainer, NotificationManager } from 'react-notifications'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '40em',
		height: '40em',
		right: 'auto',
		bottom: 'auto',
		paddingLeft: '2em',
		paddingTop: '2em',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: '1px 2px 8px #c4c4c4',
		borderRadius: '32px',
		border: 'none'
	}
}

export default class KPMTTeamsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			teamDialogIsOpen: false,
			teams: [],
			selectedTeam: null
		}
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeTeamsChange()
	}

	async componentDidMount() {
		SocketEventHandlers.subscribeToTeamsChange(data => {
			switch (data.type) {
				case 'add':
					this.setState({
						teams: this.state.teams.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						teams: this.state.teams
							.slice()
							.filter(t => t._id.toString() !== data.payload.toString())
					})
					// if the removed team is currently selected, oh whale :P
					if (
						this.state.selectedTeam &&
						this.state.selectedTeam._id.toString() === data.payload.toString()
					) {
						NotificationManager.error(
							'Your selected team has been deleted',
							'Team removed'
						)
						this.setState({
							selectedTeam: null,
							teamDialogIsOpen: false
						})
					}
					break
				case 'edit':
					var newTeams = this.state.teams.slice()

					for (var i = 0; i < newTeams.length; i++) {
						if (newTeams[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								newTeams[i][change.field] = change.value
							})

							if (
								this.state.selectedTeam &&
								newTeams[i]._id.toString() ===
									this.state.selectedTeam._id.toString()
							) {
								var newSelectedTeam = { ...this.state.selectedTeam }
								data.payload.data.forEach(change => {
									newSelectedTeam[change.field] = change.value
								})
								this.setState({
									selectedTeam: newSelectedTeam
								})
							}
							break
						}
					}
					this.setState({ teams: newTeams })
					break
			}
		})

		const teamsResponse = await fetchKPMTTeams()
		if (teamsResponse.status == 200) {
			const data = await teamsResponse.json()

			this.setState({ teams: data })
		}
	}

	openTeamModal = teamId => {
		const selected = this.state.teams
			.slice()
			.filter(t => t._id.toString() === teamId.toString())[0]
		this.setState({
			teamDialogIsOpen: true,
			selectedTeam: selected
		})
	}

	closeTeamModal = () => {
		this.setState({
			teamDialogIsOpen: false,
			selectedTeam: null
		})
	}

	render() {
		const selectedTeam = this.state.selectedTeam || {
			members: [],
			school: {},
			scores: {}
		}
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.teamDialogIsOpen}
					style={customStyles}
					contentLabel="View Team">
					<h2>View Team</h2>
					<h3>Team #: {selectedTeam.number}</h3>
					<h3>
						Members:{' '}
						{selectedTeam.members
							.reduce((a, b) => a + ', ' + b.name, '')
							.substring(2)}
					</h3>
					<h3>School: {selectedTeam.school.name}</h3>
					<h3>Algebra: {selectedTeam.scores.algebra}</h3>
					<h3>Geometry: {selectedTeam.scores.geometry}</h3>
					<h3>P&P: {selectedTeam.scores.probability}</h3>
					<h3>Weighted: {selectedTeam.scores.weighted}</h3>

					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeTeamModal} text="close" />
					</div>
				</Modal>

				<Nav admin={true} items={getAdminNavItems(2, 2)} />
				<div
					style={{
						float: 'left',
						marginLeft: '10%',
						width: 'calc(80% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>KPMT Teams</h2>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
					</div>
					<Table
						headers={['Number', 'School', 'Members', 'Score']}
						filter={this.state.filter}
						onItemClick={this.openTeamModal}
						data={this.state.teams.slice().map(team => {
							return {
								_id: team._id,
								fields: [
									team.number,
									team.school.name,
									team.members
										.reduce((a, b) => a + ', ' + b.name, '')
										.substring(2),
									team.scores.weighted
								]
							}
						})}
					/>
				</div>
				<NotificationContainer />
			</div>
		)
	}
}
