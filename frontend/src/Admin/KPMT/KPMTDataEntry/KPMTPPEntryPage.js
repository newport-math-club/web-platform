import React, { Component } from 'react'
import {
	Nav,
	Textbox,
	Link,
	getAdminNavItems,
	Button,
	ToggleButton
} from '../../../Components'
import {
	fetchKPMTCompetitors,
	scoreIndiv,
	scoreBlock,
	scoreMental,
	fetchKPMTTeams,
	scoreTeam
} from '../../../nmc-api'
import Autosuggest from 'react-autosuggest'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import SocketEventHandlers from '../../../Sockets'

const renderSuggestion = suggestion => (
	<div style={{ display: 'inline', cursor: 'pointer' }}>
		{suggestion.number.toString()}
	</div>
)

export default class KPMTPPEntryPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			teams: [],
			selectedTeam: null,

			suggestionValue: '',
			suggestions: [],
			highlightedSuggestion: null
		}

		this.scoreTextbox = React.createRef()
		this.teamAutosuggest = React.createRef()
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeToCompetitorsChange()

		SocketEventHandlers.unsubscribeToTeamsChange()
	}

	async componentDidMount() {
		SocketEventHandlers.subscribeToTeamsChange(data => {
			console.log('team edit received: ')
			console.log(data)
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
						this.state.selectedTeam._id.toString() == data.payload.toString()
					) {
						NotificationManager.error(
							'Your selected team has been deleted',
							'Team removed'
						)
						this.setState({
							selectedTeam: null,
							suggestionValue: '',
							suggestions: [],
							highlightedSuggestion: null
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
									selectedTeam: newSelectedTeam,
									suggestionValue: newSelectedTeam.number.toString()
								})
							}
							break
						}
					}
					this.setState({ teams: newTeams })
					break
			}
		})

		const response = await fetchKPMTTeams()

		if (response.status == 200) {
			const data = await response.json()

			this.setState({ teams: data })
		}
	}

	onSuggestionsFetchRequested = value => {
		this.setState({
			suggestions: this.state.teams
				.slice()
				.filter(i => i.number.toString().includes(value.value.toLowerCase()))
				.sort((a, b) => a.number - b.number)
				.slice(0, 5)
		})
	}

	onSuggestionsClearRequested = () => {
		this.setState({ suggestions: [] })
	}

	onSuggestionInputChange = (event, { newValue }) => {
		this.setState({ suggestionValue: newValue, selectedTeam: null })
	}

	onSuggestionSelected = (_, item) => {
		const suggestion = item.suggestion
		this.handleSuggestionSelected(suggestion)
	}

	handleSuggestionSelected = object => {
		this.setState({
			selectedTeam: object
		})
	}

	onSuggestionHighlighted = ({ suggestion }) => {
		this.setState({ highlightedSuggestion: suggestion })
	}

	submitScore = async () => {
		if (!this.state.selectedTeam || !this.state.selectedTeam._id) {
			NotificationManager.error('Please select a team', 'Error')
			return
		}

		var score = this.scoreTextbox.current.getText().toString()

		if (score.isOnlyWhitespace() || isNaN(score)) {
			NotificationManager.error('Invalid score inputs', 'Error')
			return
		}

		score = parseInt(score)

		if (score > 40 || score < 0) {
			NotificationManager.error('Invalid score inputs', 'Error')
			return
		}

		const response = await scoreTeam(
			this.state.selectedTeam._id.toString(),
			score,
			'probability'
		)

		if (response.status == 200) {
			NotificationManager.success(
				'Score entered: ' +
					score +
					' for team ' +
					this.state.selectedTeam.number,
				'Success'
			)
			this.setState({
				selectedTeam: null,
				suggestionValue: '',
				suggestions: [],
				highlightedSuggestion: null
			})

			this.scoreTextbox.current.clear()
			this.teamAutosuggest.current.input.focus()
		} else {
			NotificationManager.error('Response code ' + response.status, 'Error')
		}
	}

	render() {
		const inputProps = {
			placeholder: 'select team',
			value: this.state.suggestionValue,
			onChange: this.onSuggestionInputChange,
			onBlur: () => {
				const selected =
					this.state.highlightedSuggestion || this.state.suggestions.slice()[0]
				if (!selected) return
				this.handleSuggestionSelected(selected)
				this.setState({ suggestionValue: selected.number.toString() })
			},
			style: {
				width: '70%',
				display: 'inline-block'
			}
		}

		const selectedTeam = this.state.selectedTeam || { school: {}, members: {} }
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
							width: '49%',
							float: 'left',
							borderRight: '2px solid #cccccc',
							height: '100%'
						}}>
						<div>
							<Link
								href={'/admin/kpmt/entry'}
								name={'Back to Data Entry Portal'}
							/>
						</div>
						<h2>KPMT P&P Team Test Data Entry</h2>
						<p>
							Select a team by first typing in its team number, use tab to
							select first suggestion.
							<br />
							You can view the selected team on the right panel.
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
								getSuggestionValue={suggestion => suggestion.number}
								onSuggestionSelected={this.onSuggestionSelected}
								highlightFirstSuggestion={true}
								renderSuggestion={renderSuggestion}
								inputProps={inputProps}
								ref={this.teamAutosuggest}
							/>
						</div>
						<div style={{ marginTop: '1em' }}>
							<Textbox
								placeholder={'score'}
								style={{ display: 'inline-block' }}
								onEnter={this.submitScore}
								ref={this.scoreTextbox}
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
						<h2>Inspect Selected Team</h2>
						{this.state.selectedTeam && (
							<div style={{ marginTop: '4em' }}>
								<h2>{selectedTeam.number}</h2>
								<h3>{selectedTeam.school.name}</h3>
								{selectedTeam.members.map(m => <h5>{m.name}</h5>)}
								<br />
								<h2>Scores</h2>
								<h3>Algebra: {selectedTeam.scores.algebra}</h3>
								<h3>Geometry: {selectedTeam.scores.geometry}</h3>
								<h3>Probability: {selectedTeam.scores.probability}</h3>
								<h3 style={{ color: '#527aff' }}>
									Weighted: {selectedTeam.scores.weighted}
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
