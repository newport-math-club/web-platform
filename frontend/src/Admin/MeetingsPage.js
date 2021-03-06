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
import {
	fetchMembers,
	newMeeting,
	fetchMeetings,
	editMeeting,
	deleteMeeting
} from '../nmc-api'
import SocketEventHandlers from '../Sockets'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '40em',
		height: '42em',
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
		const membersResponse = await fetchMembers()
		if (membersResponse.status === 200) {
			const data = await membersResponse.json()

			this.setState({ members: data })
		} else {
			window.location.href = '/login'
			return
		}

		const meetingsResponse = await fetchMeetings()

		if (meetingsResponse.status === 200) {
			const data = await meetingsResponse.json()

			this.setState({ meetings: data })
		} else {
			window.location.href = '/login'
			return
		}

		SocketEventHandlers.subscribeToMeetingsChange(data => {
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
					let newMeetings = this.state.meetings.slice()

					for (let i = 0; i < newMeetings.length; i++) {
						if (newMeetings[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								newMeetings[i][change.field] = change.value
							})

							break
						}
					}
					this.setState({ meetings: newMeetings })
					break
				default:
			}
		})
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
			suggestionValue: '',
			error: 0
		})
	}

	openEditMeetingModal = meetingId => {
		const editMeeting = this.state.meetings
			.slice()
			.filter(m => m._id.toString() === meetingId.toString())[0]

		this.setState({
			editMeetingDialogIsOpen: true,
			editId: meetingId,
			editDate: moment(editMeeting.date).format('MM/DD/YYYY'),
			editDescription: editMeeting.description,
			editPiPoints: editMeeting.piPoints,
			addedMembers: this.state.members.filter(m =>
				editMeeting.members.map(m => m.toString()).includes(m._id.toString())
			)
		})
	}

	saveMeeting = async () => {
		let piPoints = this.piPointTextbox.current.getText()
		let description = this.descriptionTextbox.current.getText()

		if (!piPoints || piPoints.isOnlyWhitespace() || isNaN(piPoints)) {
			this.setState({ error: 1 })
			return
		}

		if (
			!this.state.addedMembers ||
			!this.state.addedMembers.length ||
			this.state.addedMembers.length < 1
		) {
			this.setState({ error: 2 })
			return
		}

		const response = await newMeeting(
			piPoints,
			this.state.addedMembers.slice().map(m => m._id),
			description,
			new Date()
		)

		if (response.status === 200) {
			this.closeNewMeetingModal()
			this.setState({ error: 0 })
		} else {
			if (response.status === 401) window.location.href = '/login'
			else this.setState({ error: response.status })
		}
	}

	saveEditMeeting = async () => {
		let piPoints = this.piPointTextbox.current.getText()
		let description = this.descriptionTextbox.current.getText()

		if (!piPoints || isNaN(piPoints)) {
			this.setState({ error: 1 })
		}

		if (
			!this.state.addedMembers ||
			!this.state.addedMembers.length ||
			this.state.addedMembers.length < 1
		) {
			this.setState({ error: 2 })
		}

		const response = await editMeeting(
			this.state.editId.toString(),
			piPoints,
			this.state.addedMembers.slice().map(m => m._id),
			description,
			this.state.editDate
		)

		if (response.status === 200) {
			this.closeEditMeetingModal()
			this.setState({ error: 0 })
		} else {
			if (response.status === 401) window.location.href = '/login'
			else this.setState({ error: response.status })
		}
	}

	closeEditMeetingModal = () => {
		this.setState({
			editMeetingDialogIsOpen: false,
			addedMembers: [],
			suggestionValue: '',
			editId: null,
			editDate: null,
			editDescription: null,
			editPiPoints: null,
			error: 0
		})
	}

	removeMember = index => {
		let copy = this.state.addedMembers.slice()
		copy.splice(index, 1)
		this.setState({ addedMembers: copy })
	}

	deleteMeeting = async () => {
		const response = await deleteMeeting(this.state.editId.toString())

		if (response.status === 200) {
			this.closeEditMeetingModal()
		}
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
		let dateString = date.format('MM/DD/YYYY')

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
					isOpen={this.state.editMeetingDialogIsOpen}
					style={customStyles}
					contentLabel="Edit Meeting">
					<h2>Edit Meeting</h2>
					<h3>Date: {this.state.editDate}</h3>
					<div>
						<h3 style={{ display: 'inline' }}>Pi Points:</h3>
						<Textbox
							ref={this.piPointTextbox}
							text={this.state.editPiPoints}
							style={{ display: 'inline-block', marginLeft: '1em' }}
							placeholder="e.g. 1"
						/>
					</div>
					<div>
						<h3 style={{ display: 'inline' }}>Description:</h3>
						<Textbox
							ref={this.descriptionTextbox}
							text={this.state.editDescription}
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
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 ||
							this.state.error === 2 ||
							this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
					</div>
					<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
						<Button
							onClick={this.deleteMeeting}
							text="delete"
							style={{ background: '#eb5757' }}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeEditMeetingModal} text="close" />
						<Button onClick={this.saveEditMeeting} text="save" />
					</div>
				</Modal>
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
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 ||
							this.state.error === 2 ||
							this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
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
					<h4>{this.state.meetings.length} meetings(s)</h4>
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
						onItemClick={this.openEditMeetingModal}
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
