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
import { newMember } from '../nmc-api'

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

		this.nameTextbox = React.createRef()
		this.emailTextbox = React.createRef()
		this.yearTextbox = React.createRef()
	}

	openNewMemberModal = () => {
		this.setState({ newMemberDialogIsOpen: true })
	}

	closeNewMemberModal = () => {
		this.setState({ newMemberDialogIsOpen: false })
	}

	saveMember = async () => {
		const name = this.nameTextbox.current.getText()
		const email = this.emailTextbox.current.getText()
		const year = this.yearTextbox.current.getText()

		var error = false
		if (!name || name.isOnlyWhitespace()) {
			this.nameTextbox.current.error()
			error = true
		} else {
			this.nameTextbox.current.unError()
		}

		if (!email || !email.isValidEmail()) {
			this.emailTextbox.current.error()
			error = true
		} else {
			this.emailTextbox.current.unError()
		}

		if (!year || isNaN(year)) {
			this.yearTextbox.current.error()
			error = true
		} else {
			this.yearTextbox.current.unError()
		}

		if (error) return

		const response = await newMember(name, email, year)

		console.log(response)
		if (response.status == 200) {
			this.closeNewMemberModal()
		}
	}

	render() {
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newMemberDialogIsOpen}
					style={customStyles}
					contentLabel="New Member">
					<h2>New Member</h2>
					<Textbox ref={this.nameTextbox} placeholder="name" type="text" />
					<Textbox ref={this.emailTextbox} placeholder="email" type="text" />
					<Textbox
						ref={this.yearTextbox}
						placeholder="year of graduation"
						type="text"
					/>

					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewMemberModal} text="close" />
						<Button onClick={this.saveMember} text="save" />
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
