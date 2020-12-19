import React, { Component } from 'react'
import { Nav, Textbox, Link, getAdminNavItems } from '../../../Components'
import { fetchKPMTCompetitors, scoreIndiv } from '../../../nmc-api'
import Autosuggest from 'react-autosuggest'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import SocketEventHandlers from '../../../Sockets'

const renderSuggestion = suggestion => (
	<div style={{ display: 'inline', cursor: 'pointer' }}>{suggestion.name}</div>
)

export default class KPMTIndividualEntryPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			individuals: [],
			selectedIndividual: null,

			suggestionValue: '',
			suggestions: [],
			highlightedSuggestion: null
		}

		this.scoreTextbox = React.createRef()
		this.lastTextbox = React.createRef()
		this.indivAutosuggest = React.createRef()
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeCompetitorsChange()
	}

	async componentDidMount() {
		const response = await fetchKPMTCompetitors()

		if (response.status === 200) {
			const data = await response.json()

			this.setState({ individuals: data })
		} else {
			window.location.href = '/login'
			return
		}

		SocketEventHandlers.subscribeToCompetitorsChange(data => {
			switch (data.type) {
				case 'add':
					this.setState({
						individuals: this.state.individuals.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						individuals: this.state.individuals
							.slice()
							.filter(i => i._id.toString() !== data.payload.toString())
					})

					if (
						this.state.selectedIndividual &&
						this.state.selectedIndividual._id.toString() ===
							data.payload.toString()
					) {
						NotificationManager.error(
							'Your selected competitor has been deleted',
							'Individual removed'
						)
						this.setState({
							selectedIndividual: null,
							suggestionValue: '',
							suggestions: [],
							highlightedSuggestion: null
						})
					}
					break
				case 'edit':
					let newIndividuals = this.state.individuals.slice()

					for (let i = 0; i < newIndividuals.length; i++) {
						if (
							newIndividuals[i]._id.toString() === data.payload._id.toString()
						) {
							data.payload.data.forEach(change => {
								newIndividuals[i][change.field] = change.value
							})

							if (
								this.state.selectedIndividual &&
								newIndividuals[i]._id.toString() ===
									this.state.selectedIndividual._id.toString()
							) {
								let newSelectedIndividual = { ...this.state.selectedIndividual }
								data.payload.data.forEach(change => {
									newSelectedIndividual[change.field] = change.value
								})
								this.setState({
									selectedIndividual: newSelectedIndividual,
									suggestionValue: newSelectedIndividual.name
								})
							}
							break
						}
					}
					this.setState({ individuals: newIndividuals })
					break
				default:
			}
		})
	}

	onSuggestionsFetchRequested = value => {
		this.setState({
			suggestions: this.state.individuals
				.slice()
				.filter(i => i.name.toLowerCase().includes(value.value.toLowerCase()))
				.sort((a, b) => a.name.localeCompare(b.name))
				.slice(0, 5)
		})
	}

	onSuggestionsClearRequested = () => {
		this.setState({ suggestions: [] })
	}

	onSuggestionInputChange = (event, { newValue }) => {
		this.setState({ suggestionValue: newValue, selectedIndividual: null })
	}

	onSuggestionSelected = (_, item) => {
		const suggestion = item.suggestion
		this.handleSuggestionSelected(suggestion)
	}

	handleSuggestionSelected = object => {
		this.setState({
			selectedIndividual: object
		})
	}

	onSuggestionHighlighted = ({ suggestion }) => {
		this.setState({ highlightedSuggestion: suggestion })
	}

	submitScore = async () => {
		if (!this.state.selectedIndividual || !this.state.selectedIndividual._id) {
			NotificationManager.error('Please select an individual', 'Error')
			return
		}

		let score = this.scoreTextbox.current.getText().toString()
		let last = this.lastTextbox.current.getText().toString()

		if (
			score.isOnlyWhitespace() ||
			last.isOnlyWhitespace() ||
			isNaN(score) ||
			isNaN(last)
		) {
			NotificationManager.error('Invalid score inputs', 'Error')
			return
		}

		score = parseInt(score)
		last = parseInt(last)

		if (score > 40 || score < 0 || last > 40 || last < 0 || last < score) {
			NotificationManager.error('Invalid score inputs', 'Error')
			return
		}

		const response = await scoreIndiv(
			this.state.selectedIndividual._id.toString(),
			score,
			last
		)

		if (response.status === 200) {
			NotificationManager.success(
				'Score entered: ' +
					score +
					'/' +
					last +
					' for ' +
					this.state.selectedIndividual.name,
				'Success'
			)
			this.setState({
				selectedIndividual: null,
				suggestionValue: '',
				suggestions: [],
				highlightedSuggestion: null
			})

			this.scoreTextbox.current.clear()
			this.lastTextbox.current.clear()
			this.indivAutosuggest.current.input.focus()
		} else {
			NotificationManager.error('Response code ' + response.status, 'Error')
		}
	}

	render() {
		const inputProps = {
			placeholder: 'select individual',
			value: this.state.suggestionValue,
			onChange: this.onSuggestionInputChange,
			onBlur: () => {
				const selected =
					this.state.highlightedSuggestion || this.state.suggestions.slice()[0]
				if (!selected) return
				this.handleSuggestionSelected(selected)
				this.setState({ suggestionValue: selected.name })
			},
			style: {
				width: 'calc(100% - 2em - 4px)',
				maxWidth: '20em',
				display: 'inline-block'
			}
		}

		const selectedIndividual = this.state.selectedIndividual || { school: {} }
		return (
			<div className="fullheight">
				<Nav admin={true} items={getAdminNavItems(2, 4)} />

				<div
					style={{
						float: 'left',
						width: 'calc(100% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<div
						style={{
							width: 'calc(49% - 2em)',
							float: 'left',
							borderRight: '2px solid #cccccc',
							height: '100%',
							paddingRight: '2em'
						}}>
						<div>
							<Link
								href={'/admin/kpmt/entry'}
								name={'Back to Data Entry Portal'}
							/>
						</div>
						<h2>KPMT Individual Test Data Entry</h2>
						<p>
							Select a competitor by first typing a couple characters, use tab
							to select first suggestion.
							<br />
							You can view the selected individual on the right panel.
							<br />
							Use tab to cycle through the fields and press enter to submit the
							score.
						</p>

						<div style={{ marginTop: '2em' }}>
							<Autosuggest
								suggestions={this.state.suggestions}
								onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
								onSuggestionsClearRequested={this.onSuggestionsClearRequested}
								onSuggestionHighlighted={this.onSuggestionHighlighted}
								getSuggestionValue={suggestion => suggestion.name}
								onSuggestionSelected={this.onSuggestionSelected}
								highlightFirstSuggestion={true}
								renderSuggestion={renderSuggestion}
								inputProps={inputProps}
								ref={this.indivAutosuggest}
							/>
						</div>
						<div style={{ marginTop: '1em' }}>
							<Textbox
								placeholder={'individual score'}
								style={{
									display: 'inline-block',
									width: 'calc(50% - 2.5em - 5px)',
									maxWidth: 'calc(8.5em - 2px)'
								}}
								onEnter={this.submitScore}
								ref={this.scoreTextbox}
							/>
							<Textbox
								placeholder={'last solved'}
								style={{
									display: 'inline-block',
									width: 'calc(50% - 2.5em - 5px)',
									marginLeft: '1em',
									maxWidth: 'calc(8.5em - 2px)'
								}}
								onEnter={this.submitScore}
								ref={this.lastTextbox}
							/>
						</div>
					</div>
					<div
						style={{
							width: 'calc(49% - 4em)',
							float: 'left',
							paddingLeft: '4em',
							height: '100%',
							paddingTop: '4em'
						}}>
						<h2>Inspect Selected Individual</h2>
						{this.state.selectedIndividual && (
							<div style={{ marginTop: '4em' }}>
								<h2>{selectedIndividual.name}</h2>
								<h3>Grade {selectedIndividual.grade}</h3>
								<h3>Compete grade: {selectedIndividual.competeGrade}</h3>
								<h3>{selectedIndividual.school.name}</h3>
								{selectedIndividual.team && (
									<h3>Team {selectedIndividual.team.number}</h3>
								)}
								<br />
								<h2>Scores</h2>
								<h3>
									Individual: {selectedIndividual.scores.individual}/
									{selectedIndividual.scores.individualLast}
								</h3>
								<h3>Block: {selectedIndividual.scores.block}</h3>
								{/* <h3>Mental: {selectedIndividual.scores.mental}</h3> */}
								<h3 style={{ color: '#527aff' }}>
									Weighted: {selectedIndividual.scores.weighted}
								</h3>
							</div>
						)}
					</div>
				</div>
				<NotificationContainer />
			</div>
		)
	}
}
