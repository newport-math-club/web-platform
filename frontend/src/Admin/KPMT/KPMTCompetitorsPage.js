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
	fetchKPMTCompetitors,
	fetchKPMTSchools,
	deleteKPMTIndiv,
	addKPMTIndiv,
	editKPMTIndiv
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

export default class KPMTCompetitorsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			competitorDialogIsOpen: false,
			newIndivDialogIsOpen: false,
			competitors: [],
			schools: [],
			selectedSchool: null,
			schoolSuggestions: [],
			suggestionValue: '',
			selectedCompetitor: null
		}

		this.newGradeRef = React.createRef()
		this.newNameRef = React.createRef()
		this.editGradeRef = React.createRef()
		this.editNameRef = React.createRef()
	}

	openNewIndivModal = () => {
		this.setState({ newIndivDialogIsOpen: true })
	}

	closeNewIndivModal = () => {
		this.setState({
			newIndivDialogIsOpen: false,
			selectedSchool: null,
			suggestionValue: ''
		})
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeCompetitorsChange()
		SocketEventHandlers.unsubscribeSchoolsChange()
	}

	async componentDidMount() {
		const competitorsResponse = await fetchKPMTCompetitors()

		if (competitorsResponse.status === 200) {
			const data = await competitorsResponse.json()
			this.setState({ competitors: data })
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
					var newSchools = this.state.schools.slice()

					for (var i = 0; i < newSchools.length; i++) {
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

		SocketEventHandlers.subscribeToCompetitorsChange(data => {
			switch (data.type) {
				case 'add':
					this.setState({
						competitors: this.state.competitors.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						competitors: this.state.competitors
							.slice()
							.filter(c => c._id.toString() !== data.payload.toString())
					})
					// if the removed competitor is currently selected, oh whale :P
					if (
						this.state.selectedCompetitor &&
						this.state.selectedCompetitor._id.toString() ===
							data.payload.toString()
					) {
						NotificationManager.error(
							'Your selected competitor has been deleted',
							'Competitor removed'
						)
						this.setState({
							selectedCompetitor: null,
							competitorDialogIsOpen: false
						})
					}
					break
				case 'edit':
					var newCompetitors = this.state.competitors.slice()

					for (var i = 0; i < newCompetitors.length; i++) {
						if (
							newCompetitors[i]._id.toString() === data.payload._id.toString()
						) {
							data.payload.data.forEach(change => {
								newCompetitors[i][change.field] = change.value
							})

							if (
								this.state.selectedCompetitor &&
								newCompetitors[i]._id.toString() ===
									this.state.selectedCompetitor._id.toString()
							) {
								var newSelectedCompetitor = { ...this.state.selectedCompetitor }
								data.payload.data.forEach(change => {
									newSelectedCompetitor[change.field] = change.value
								})
								this.setState({
									selectedCompetitor: newSelectedCompetitor
								})
							}
							break
						}
					}
					this.setState({ competitors: newCompetitors })
					break
			}
		})
	}

	openCompetitorModal = competitorId => {
		const selected = this.state.competitors
			.slice()
			.filter(t => t._id.toString() === competitorId.toString())[0]
		this.setState({
			competitorDialogIsOpen: true,
			selectedCompetitor: selected
		})
	}

	closeCompetitorModal = () => {
		this.setState({
			competitorDialogIsOpen: false,
			selectedCompetitor: null
		})
	}

	deleteIndividual = async () => {
		const response = await deleteKPMTIndiv(
			this.state.selectedCompetitor._id.toString(),
			this.state.selectedCompetitor.school._id.toString()
		)
		if (response.status === 200) {
			this.closeCompetitorModal()
		}
	}

	saveIndiv = async () => {
		const name = this.newNameRef.current.getText()
		const grade = this.newGradeRef.current.getText()

		if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace()) {
			this.setState({ error: 1 })
			return
		}

		const response = await addKPMTIndiv(
			name,
			grade,
			this.state.selectedSchool._id.toString()
		)

		if (response.status === 200) {
			this.closeNewIndivModal()
		} else {
			this.setState({ error: response.status })
		}
	}

	saveEditIndiv = async () => {
		const name = this.editNameRef.current.getText()
		const grade = this.editGradeRef.current.getText().toString()

		if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace()) {
			this.setState({ error: 1 })
			return
		}

		const response = await editKPMTIndiv(
			this.state.selectedCompetitor._id.toString(),
			name,
			grade,
			this.state.selectedCompetitor.school._id.toString()
		)

		if (response.status === 200) {
			this.closeCompetitorModal()
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
		const selectedCompetitor = this.state.selectedCompetitor || {
			school: {},
			team: {},
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

		const newMemberTextboxes = (
			<div>
				<Textbox
					style={{ display: 'inline', width: '16em' }}
					ref={this.newNameRef}
					placeholder="full name"
				/>
				<Textbox
					style={{ display: 'inline', width: '4em', marginLeft: '1em' }}
					ref={this.newGradeRef}
					placeholder="grade"
				/>
			</div>
		)

		const memberTextboxes = (
			<div>
				<Textbox
					text={selectedCompetitor.name}
					style={{ display: 'inline', width: '16em' }}
					ref={this.editNameRef}
					placeholder="full name"
				/>
				<Textbox
					text={selectedCompetitor.grade}
					style={{ display: 'inline', width: '4em', marginLeft: '1em' }}
					ref={this.editGradeRef}
					placeholder="grade"
				/>
			</div>
		)

		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newIndivDialogIsOpen}
					style={customStyles}
					contentLabel="New Individual">
					<h2>New Individual</h2>

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
						<Button onClick={this.closeNewIndivModal} text="close" />
						<Button onClick={this.saveIndiv} text="save" />
					</div>
				</Modal>
				<Modal
					isOpen={this.state.competitorDialogIsOpen}
					style={customStyles}
					contentLabel="View Competitor">
					<h2>View Competitor</h2>
					{/* <h3>Name: {selectedCompetitor.name}</h3>
					<h3>Grade: {selectedCompetitor.grade}</h3> */}
					<h4>School: {selectedCompetitor.school.name}</h4>
					{selectedCompetitor.team && (
						<h4>Team: {selectedCompetitor.team.number}</h4>
					)}
					<h4>
						Scores (I/IL/B/M/W): {selectedCompetitor.scores.individual}/
						{selectedCompetitor.scores.individualLast}/
						{selectedCompetitor.scores.block}/{selectedCompetitor.scores.mental}
						/{selectedCompetitor.scores.weighted}
					</h4>

					<div style={{ marginTop: '2em' }}>{memberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
					</div>

					{!selectedCompetitor.team && (
						<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
							<Button onClick={this.deleteIndividual} text="delete" />
						</div>
					)}
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeCompetitorModal} text="close" />
						{!selectedCompetitor.team && (
							<Button onClick={this.saveEditIndiv} text="save" />
						)}
					</div>
				</Modal>

				<Nav admin={true} items={getAdminNavItems(2, 3)} />
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
					<h2>KPMT Competitors</h2>
					<h4>{this.state.competitors.length} competitor(s)</h4>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new individual" onClick={this.openNewIndivModal} />
					</div>
					<Table
						headers={['Grade', 'Name', 'School', 'Score']}
						filter={this.state.filter}
						onItemClick={this.openCompetitorModal}
						data={this.state.competitors.slice().map(competitor => {
							return {
								_id: competitor._id,
								fields: [
									competitor.grade,
									competitor.name,
									competitor.school.name,
									competitor.scores.weighted
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
