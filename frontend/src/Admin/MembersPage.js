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

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '30em',
		right: 'auto',
		bottom: 'auto',
		paddingBottom: '6em',
		paddingLeft: '2em',
		paddingTop: '2em',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: '1px 2px 8px #c4c4c4',
		borderRadius: '32px',
		border: 'none'
	}
}

export default class MembersPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			newMemberDialogIsOpen: false
		}
	}

	openNewMemberModal = () => {
		this.setState({ newMemberDialogIsOpen: true })
	}

	closeNewMemberModal = () => {
		this.setState({ newMemberDialogIsOpen: false })
	}

	saveMember = () => {
		// TODO:
		this.closeNewMemberModal()
	}

	render() {
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newMemberDialogIsOpen}
					style={customStyles}
					contentLabel="New Member">
					<h2>New Member</h2>
					<Textbox placeholder="name" type="text" />
					<Textbox placeholder="email" type="text" />
					<Textbox placeholder="year of graduation" type="text" />

					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewMemberModal} text="close" />
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
					<h2>Members</h2>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new member" onClick={this.openNewMemberModal} />
					</div>
					<Table
						headers={['Year', 'Name', 'Email', 'Attendance']}
						filter={this.state.filter}
						data={[]}
					/>
				</div>
			</div>
		)
	}
}
