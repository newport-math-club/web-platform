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
	exportData,
	getLockStatus,
	coachLock,
	regLock,
	wipeKPMT,
	fetchKPMTCompetitors
} from '../../../nmc-api'
import Autosuggest from 'react-autosuggest'

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
			suggestions: []
		}
	}

	async componentDidMount() {
		const response = await fetchKPMTCompetitors()

		if (response.status == 200) {
			const data = await response.json()

			this.setState({ individuals: data })
		}
	}

	onSuggestionsFetchRequested = value => {
		console.log(value)
		this.setState({
			suggestions: this.state.individuals
				.slice()
				.filter(i => i.name.toLowerCase().includes(value.value.toLowerCase()))
				.sort((a, b) => a.name.localeCompare(b.name))
		})
	}

	onSuggestionsClearRequested = () => {
		this.setState({ suggestions: [] })
	}

	onSuggestionInputChange = (event, { newValue }) => {
		this.setState({ suggestionValue: newValue })
	}

	onSuggestionSelected = (_, item) => {
		const suggestion = item.suggestion
		this.setState({
			selectedIndividual: suggestion
		})
	}

	render() {
		const inputProps = {
			placeholder: 'select individual',
			value: this.state.suggestionValue,
			onChange: this.onSuggestionInputChange,
			style: {
				width: '70%',
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
						<h2>KPMT Individual Test Data Entry</h2>

						<div style={{ marginTop: '4em' }}>
							<Autosuggest
								suggestions={this.state.suggestions}
								onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
								onSuggestionsClearRequested={this.onSuggestionsClearRequested}
								getSuggestionValue={suggestion => suggestion.name}
								onSuggestionSelected={this.onSuggestionSelected}
								renderSuggestion={renderSuggestion}
								inputProps={inputProps}
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
								<h3>{selectedIndividual.school.name}</h3>
								<h3>Team {selectedIndividual.team.number}</h3>
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}
