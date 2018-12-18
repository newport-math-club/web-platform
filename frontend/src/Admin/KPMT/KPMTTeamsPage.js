import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Table,
	Textbox
} from '../../Components'
import Modal from 'react-modal'
import SocketEventHandlers from '../../Sockets'
import Autosuggest from 'react-autosuggest'
import {
	fetchKPMTTeams,
	fetchKPMTSchools,
	deleteKPMTTeam,
	addKPMTTeam,
	editKPMTTeam
} from '../../nmc-api'
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

const renderSuggestion = suggestion => (
	<div style={{ display: 'inline', cursor: 'pointer' }}>{suggestion.name}</div>
)

export default class KPMTTeamsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			teamDialogIsOpen: false,
			newTeamDialogIsOpen: false,
			teams: [],
			schools: [],
			selectedSchool: null,
			schoolSuggestions: [],
			suggestionValue: '',
			selectedTeam: null
		}

		this.newGradeRefs = []
		this.newNameRefs = []
		this.editGradeRefs = []
		this.editNameRefs = []
		;[0, 1, 2, 3].forEach(() => {
			this.newGradeRefs.push(React.createRef())
			this.newNameRefs.push(React.createRef())
			this.editGradeRefs.push(React.createRef())
			this.editNameRefs.push(React.createRef())
		})
	}

	openNewTeamModal = () => {
		this.setState({ newTeamDialogIsOpen: true })
	}

	closeNewTeamModal = () => {
		this.setState({
			newTeamDialogIsOpen: false,
			selectedSchool: null,
			suggestionValue: ''
		})
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeTeamsChange()
		SocketEventHandlers.unsubscribeSchoolsChange()
	}

	async componentDidMount() {
		const teamsResponse = await fetchKPMTTeams()
		if (teamsResponse.status === 200) {
			const data = await teamsResponse.json()

			this.setState({ teams: data })
		} else {
			window.location.href = '/login'
			return
		}

		const schoolsResponse = await fetchKPMTSchools()
		if (schoolsResponse.status === 200) {
			const data = await schoolsResponse.json()

			this.setState({ schools: data })
		} else {
			window.location.href = '/login'
			return
		}

		SocketEventHandlers.subscribeToSchoolsChange(data => {
			switch (data.type) {
				case 'add':
					this.setState({
						schools: this.state.schools.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						schools: this.state.schools
							.slice()
							.filter(s => s._id.toString() !== data.payload.toString())
					})

					break
				case 'edit':
					let newSchools = this.state.schools.slice()

					for (let i = 0; i < newSchools.length; i++) {
						if (newSchools[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								newSchools[i][change.field] = change.value
							})

							break
						}
					}
					this.setState({
						schools: newSchools
					})
					break
			}
		})

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
					let newTeams = this.state.teams.slice()

					for (let i = 0; i < newTeams.length; i++) {
						if (newTeams[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								newTeams[i][change.field] = change.value
							})

							if (
								this.state.selectedTeam &&
								newTeams[i]._id.toString() ===
									this.state.selectedTeam._id.toString()
							) {
								let newSelectedTeam = { ...this.state.selectedTeam }
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

	deleteTeam = async () => {
		const response = await deleteKPMTTeam(
			this.state.selectedTeam._id.toString(),
			this.state.selectedTeam.school._id.toString()
		)
		if (response.status === 200) {
			this.closeTeamModal()
		}
	}

	saveEditTeam = async () => {
		let team = []
		;[0, 1, 2, 3].forEach(index => {
			const name = this.editNameRefs[index].current.getText()
			const grade = this.editGradeRefs[index].current.getText().toString()

			if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace())
				return

			team.push({
				name: name,
				grade: parseInt(grade, 10)
			})
		})

		if (team.length < 3) {
			this.setState({ error: 1 })
			return
		}

		const response = await editKPMTTeam(
			this.state.selectedTeam._id.toString(),
			team,
			this.state.selectedTeam.school._id.toString()
		)

		if (response.status === 200) {
			this.closeTeamModal()
		} else {
			this.setState({ error: response.status })
		}
	}

	saveTeam = async () => {
		let team = []
		;[0, 1, 2, 3].forEach(index => {
			const name = this.newNameRefs[index].current.getText()
			const grade = this.newGradeRefs[index].current.getText()

			if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace())
				return

			team.push({
				name: name,
				grade: parseInt(grade, 10)
			})
		})

		if (team.length < 3) {
			this.setState({ error: 1 })
			return
		}

		if (!this.state.selectedSchool) {
			this.setState({ error: 1 })
			return
		}

		const response = await addKPMTTeam(
			team,
			this.state.selectedSchool._id.toString()
		)

		if (response.status === 200) {
			this.closeNewTeamModal()
		} else {
			this.setState({ error: response.status })
		}
	}

	getSchoolSuggestions = value => {
		const input = value.trim().toLowerCase()

		return input.length === 0
			? []
			: this.state.schools
					.slice()
					.filter(s => s.name.toLowerCase().includes(input))
	}

	onSuggestionsFetchRequested = value => {
		this.setState({
			schoolSuggestions: this.getSchoolSuggestions(value.value)
		})
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({ schoolSuggestions: [] })
	}

	onSuggestionInputChange = (event, { newValue }) => {
		this.setState({ suggestionValue: newValue })
	}

	onSuggestionSelected = (_, item) => {
		const suggestion = item.suggestion
		this.setState({
			suggestionValue: suggestion.name,
			selectedSchool: suggestion
		})
	}

	render() {
		const selectedTeam = this.state.selectedTeam || {
			members: [],
			school: {},
			scores: {}
		}

		const inputProps = {
			placeholder: 'select school',
			value: this.state.suggestionValue,
			onChange: this.onSuggestionInputChange,
			style: {
				width: '70%',
				display: 'inline-block'
			}
		}

		const memberTextboxes = [0, 1, 2, 3].map(index => {
			if (selectedTeam.members.length > index) {
				const member = selectedTeam.members[index]
				return (
					<div>
						<Textbox
							ref={this.editNameRefs[index]}
							style={{
								display: 'inline',
								width: '16em'
							}}
							text={member.name}
							placeholder="name"
						/>
						<Textbox
							style={{
								display: 'inline',
								width: '4em',
								marginLeft: '1em'
							}}
							ref={this.editGradeRefs[index]}
							text={member.grade}
							placeholder="grade"
						/>
					</div>
				)
			}
			return (
				<div>
					<Textbox
						style={{
							display: 'inline',
							width: '16em'
						}}
						ref={this.editNameRefs[index]}
						placeholder="full name"
					/>
					<Textbox
						style={{
							display: 'inline',
							width: '4em',
							marginLeft: '1em'
						}}
						ref={this.editGradeRefs[index]}
						placeholder="grade"
					/>
				</div>
			)
		})

		const newMemberTextboxes = [0, 1, 2, 3].map(index => {
			return (
				<div>
					<Textbox
						style={{
							display: 'inline',
							width: '16em'
						}}
						ref={this.newNameRefs[index]}
						placeholder="full name"
					/>
					<Textbox
						style={{
							display: 'inline',
							width: '4em',
							marginLeft: '1em'
						}}
						ref={this.newGradeRefs[index]}
						placeholder="grade"
					/>
				</div>
			)
		})
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newTeamDialogIsOpen}
					style={customStyles}
					contentLabel="New Team">
					<h2>New Team</h2>
					<h5>
						Every team must have 3-4 members; leave the last line completely
						blank to have 3 members
					</h5>
					<div style={{ marginTop: '2em' }}>{newMemberTextboxes}</div>
					<Autosuggest
						suggestions={this.state.schoolSuggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={suggestion => suggestion.name}
						onSuggestionSelected={this.onSuggestionSelected}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
					/>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewTeamModal} text="close" />
						<Button onClick={this.saveTeam} text="save" />
					</div>
				</Modal>
				<Modal
					isOpen={this.state.teamDialogIsOpen}
					style={customStyles}
					contentLabel="View Team">
					<h2>Team {selectedTeam.number}</h2>
					<h4>{selectedTeam.school.name}</h4>
					<h4>
						Scores (A/G/P/W): {selectedTeam.scores.algebra}/
						{selectedTeam.scores.geometry}/{selectedTeam.scores.probability}/
						{selectedTeam.scores.weighted}
					</h4>
					<div style={{ marginTop: '2em' }}>{memberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
					</div>

					<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
						<Button onClick={this.deleteTeam} text="delete" />
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeTeamModal} text="close" />
						<Button onClick={this.saveEditTeam} text="save" />
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
					<h4>{this.state.teams.length} team(s)</h4>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new team" onClick={this.openNewTeamModal} />
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
