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
import { fetchMembers, newMeeting, fetchMeetings } from '../nmc-api'
import SocketEventHandlers from '../Sockets'

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

export default class MeetingsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			newMeetingDialogIsOpen: false,
			members: [],
			meetings: [],
			memberSuggestions: [],
			suggestionValue: '',
			addedMembers: []
		}

		this.piPointTextbox = React.createRef()
		this.descriptionTextbox = React.createRef()
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeToMeetingsChange()
	}

	async componentDidMount() {
		SocketEventHandlers.subscribeToMeetingsChange(data => {
			console.log('received meeting change data')
			console.log(data)
			switch (data.type) {
				case 'add':
					this.setState({
						meetings: this.state.meetings.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						meetings: this.state.meetings
							.slice()
							.filter(m => m._id.toString() !== data.payload.toString())
					})
					break
				case 'edit':
					var newMeetings = this.state.meetings.slice()

					for (var i = 0; i < newMeetings.length; i++) {
						if (newMeetings[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								newMeeting[i][change.field] = change.value
							})

							break
						}
					}
					this.setState({ meetings: newMeeting })
					break
			}
		})

		const membersResponse = await fetchMembers()
		if (membersResponse.status == 200) {
			const data = await membersResponse.json()

			this.setState({ members: data })
		}

		const meetingsResponse = await fetchMeetings()

		if (meetingsResponse.status == 200) {
			const data = await meetingsResponse.json()

			this.setState({ meetings: data })
		}
	}

	openNewMeetingModal = () => {
		this.setState({
			newMeetingDialogIsOpen: true
		})
	}

	closeNewMeetingModal = () => {
		this.setState({
			newMeetingDialogIsOpen: false,
			addedMembers: [],
			suggestionValue: ''
		})
	}

	saveMeeting = async () => {
		var piPoints = this.piPointTextbox.current.getText()
		var description = this.descriptionTextbox.current.getText()

		if (!piPoints || piPoints.isOnlyWhitespace() || isNaN(piPoints)) {
			// TODO:
		}

		if (
			!this.state.addedMembers ||
			!this.state.addedMembers.length ||
			this.state.addedMembers.length < 1
		) {
			// TODO:
		}

		const response = await newMeeting(
			piPoints,
			this.state.addedMembers.slice().map(m => m._id),
			description
		)

		if (response.status == 200) {
			this.closeNewMeetingModal()
		}
	}

	removeMember = index => {
		var copy = this.state.addedMembers.slice()
		copy.splice(index, 1)
		this.setState({ addedMembers: copy })
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
							ref={this.piPointTextbox}
							style={{ display: 'inline-block', marginLeft: '1em' }}
							placeholder="e.g. 1"
						/>
					</div>
					<div>
						<h3 style={{ display: 'inline' }}>Description:</h3>
						<Textbox
							ref={this.descriptionTextbox}
							style={{ display: 'inline-block', marginLeft: '1em' }}
							placeholder="activities, events, etc."
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
								<h5>selected member; click to remove</h5>
								<div
									style={{
										marginTop: '1em',
										overflowY: 'auto',
										height: '14em'
									}}>
									{this.state.addedMembers.map((member, index) => {
										return (
											<h3
												onClick={() => {
													this.removeMember(index)
												}}
												className="removableListItem"
												style={{ fontSize: '1.25em' }}>
												{member.name}
											</h3>
										)
									})}
								</div>
							</div>
						</div>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewMeetingModal} text="close" />
						<Button onClick={this.saveMeeting} text="save" />
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
						data={this.state.meetings.slice().map(meeting => {
							return {
								_id: meeting._id,
								fields: [
									moment(meeting.date).format('MM/DD/YYYY'),
									meeting.description,
									meeting.members.length
								]
							}
						})}
					/>
				</div>
			</div>
		)
	}
}
