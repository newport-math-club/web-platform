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

export default class MeetingsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			newMeetingDialogIsOpen: false
		}
	}

	openNewMeetingModal = () => {
		this.setState({ newMeetingDialogIsOpen: true })
	}

	closeNewMeetingModal = () => {
		this.setState({ newMeetingDialogIsOpen: false })
	}

	onNewMeetingDialogClose = () => {}

	render() {
		const date = moment()
		var dateString = date.format('MM/DD/YYYY')
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
						<h3 style={{ marginTop: '1em', display: 'inline' }}>Members:</h3>
						<Textbox
							style={{ display: 'inline-block', marginLeft: '1em' }}
							placeholder="add member"
						/>
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
