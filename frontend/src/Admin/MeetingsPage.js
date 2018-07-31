import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Textbox
} from '../Components'
import { Table } from '../Components'
import Modal from 'react-modal'
import moment from 'moment'
import Autosuggest from 'react-autosuggest'
import { fetchMembers } from '../nmc-api'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '40em',
		minHeight: '40em',
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

const renderSuggestion = suggestion => <div>{suggestion.name}</div>

export default class MeetingsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			newMeetingDialogIsOpen: false,
			members: [],
			memberSuggestions: [],
			suggestionValue: '',
			addedMembers: []
		}
	}

	async componentDidMount() {
		const response = await fetchMembers()
		if (response.status == 200) {
			const data = await response.json()

			this.setState({ members: data })
		}
	}

	openNewMeetingModal = () => {
		this.setState({
			newMeetingDialogIsOpen: true
		})
	}

	closeNewMeetingModal = () => {
		this.setState({
			newMeetingDialogIsOpen: false
		})
	}

	saveMeeting = () => {
		// TODO:
		this.closeNewMeetingModal()
	}

	getMemberSuggestions = value => {
		const input = value.trim().toLowerCase()

		return input.length === 0
			? []
			: this.state.members
					.slice()
					.filter(
						member =>
							member.name.toLowerCase().includes(input) &&
							!this.state.addedMembers.includes(member)
					)
	}

	onSuggestionsFetchRequested = value => {
		this.setState({
			memberSuggestions: this.getMemberSuggestions(value.value)
		})
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({ memberSuggestions: [] })
	}

	onSuggestionInputChange = (event, { newValue }) => {
		this.setState({ suggestionValue: newValue })
	}

	onSuggestionSelected = (_, item) => {
		const suggestion = item.suggestion
		this.setState({
			addedMembers: this.state.addedMembers.slice().concat(suggestion)
		})
		this.setState({ suggestionValue: '' })
	}

	render() {
		const date = moment()
		var dateString = date.format('MM/DD/YYYY')

		const inputProps = {
			placeholder: 'add member',
			value: this.state.suggestionValue,
			onChange: this.onSuggestionInputChange,
			style: {
				width: '70%',
				display: 'inline-block'
			}
		}

		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newMeetingDialogIsOpen}
					style={customStyles}
					contentLabel="New Meeting">
					<h2>New Meeting</h2>
					<h3>Date: {dateString}</h3>
					<div>
						<h3 style={{ display: 'inline' }}>Pi Points:</h3>
						<Textbox
							style={{ display: 'inline-block', marginLeft: '1em' }}
							placeholder="pi points e.g. 1"
						/>
					</div>
					<div>
						<h3 style={{ paddingTop: '1em' }}>Members:</h3>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignContent: 'top'
							}}>
							<div
								style={{
									width: '50%'
								}}>
								<h5>select members</h5>
								<Autosuggest
									suggestions={this.state.memberSuggestions}
									onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
									onSuggestionsClearRequested={this.onSuggestionsClearRequested}
									getSuggestionValue={suggestion => suggestion.name}
									onSuggestionSelected={this.onSuggestionSelected}
									renderSuggestion={renderSuggestion}
									inputProps={inputProps}
								/>
							</div>

							<div
								style={{
									width: '50%',
									paddingLeft: '1em'
								}}>
								<h5>selected members</h5>
								<div
									style={{
										paddingTop: '1em'
									}}>
									{this.state.addedMembers.map(member => {
										return <h3>{member.name}</h3>
									})}
								</div>
							</div>
						</div>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewMeetingModal} text="close" />
						<Button text="save" />
					</div>
				</Modal>
				<Nav admin={true} items={getAdminNavItems(0)} />
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
					<h2>Meetings</h2>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new meeting" onClick={this.openNewMeetingModal} />
					</div>
					<Table
						headers={['Date', 'Description', 'Attendance']}
						filter={this.state.filter}
						data={[]}
					/>
				</div>
			</div>
		)
	}
}
