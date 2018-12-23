import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Textbox,
	ToggleButton
} from '../Components'
import { Table } from '../Components'
import Modal from 'react-modal'
import { newMember, fetchMembers, editMember, deleteMember } from '../nmc-api'
import SocketEventHandlers from '../Sockets'

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
			newMemberDialogIsOpen: false,
			members: []
		}

		this.nameTextbox = React.createRef()
		this.emailTextbox = React.createRef()
		this.yearTextbox = React.createRef()
		this.adminTogglebutton = React.createRef()
	}

	async componentDidMount() {
		const response = await fetchMembers()
		if (response.status === 200) {
			const data = await response.json()

			this.setState({ members: data })
		} else {
			window.location.href = '/login'
			return
		}

		SocketEventHandlers.subscribeToMembersChange(data => {
			switch (data.type) {
				case 'add':
					this.setState({
						members: this.state.members.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						members: this.state.members
							.slice()
							.filter(m => m._id.toString() !== data.payload.toString())
					})
					break
				case 'edit':
					let newMembers = this.state.members.slice()

					for (let i = 0; i < newMembers.length; i++) {
						if (newMembers[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								if (change.field === 'piPoints')
									newMembers[i].piPoints += parseInt(change.value)
								else newMembers[i][change.field] = change.value
							})

							break
						}
					}
					this.setState({ members: newMembers })
					break
				default:
			}
		})
	}

	openNewMemberModal = () => {
		this.setState({ newMemberDialogIsOpen: true })
	}

	closeNewMemberModal = () => {
		this.setState({ newMemberDialogIsOpen: false })
	}

	openEditMemberModal = memberId => {
		const editMember = this.state.members
			.slice()
			.filter(m => m._id.toString() === memberId.toString())[0]

		this.setState({
			editMemberDialogIsOpen: true,
			editId: memberId,
			editName: editMember.name,
			editEmail: editMember.email,
			editYear: editMember.yearOfGraduation,
			editAdmin: editMember.admin
		})
	}

	closeEditMemberModal = () => {
		this.setState({
			editMemberDialogIsOpen: false,
			editId: null,
			editName: null,
			editEmail: null,
			editYear: null,
			editAdmin: null
		})
	}

	saveMember = async () => {
		const name = this.nameTextbox.current.getText()
		const email = this.emailTextbox.current.getText()
		const year = this.yearTextbox.current.getText()
		const admin = this.adminTogglebutton.current.isEnabled()

		let error = false
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

		const response = await newMember(name, email, year, admin)

		if (response.status === 200) {
			this.closeNewMemberModal()
		} else {
			if (response.status === 401) window.location.href = '/login'
		}
	}

	saveEditMember = async () => {
		const name = this.nameTextbox.current.getText()
		const email = this.emailTextbox.current.getText()
		const year = this.yearTextbox.current.getText()
		const admin = this.adminTogglebutton.current.isEnabled()

		let error = false
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

		const response = await editMember(
			this.state.editId.toString(),
			name,
			email,
			year,
			admin
		)

		if (response.status === 200) {
			this.closeEditMemberModal()
		} else {
			if (response.status === 401) window.location.href = '/login'
		}
	}

	deleteMember = async () => {
		const response = await deleteMember(this.state.editId.toString())

		if (response.status === 200) {
			this.closeEditMemberModal()
		}
	}

	render() {
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.editMemberDialogIsOpen}
					style={customStyles}
					contentLabel="Edit Member">
					<h2>Edit Member</h2>
					<Textbox
						text={this.state.editName}
						ref={this.nameTextbox}
						placeholder="name"
						type="text"
					/>
					<Textbox
						text={this.state.editEmail}
						ref={this.emailTextbox}
						placeholder="email"
						type="text"
					/>
					<Textbox
						text={this.state.editYear}
						ref={this.yearTextbox}
						placeholder="year of graduation"
						type="text"
					/>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignContent: 'center',
							marginTop: '0.5em'
						}}>
						<h3 style={{ display: 'inline' }}>Admin?</h3>
						<ToggleButton
							checked={this.state.editAdmin}
							ref={this.adminTogglebutton}
						/>
					</div>

					<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
						<Button
							onClick={this.deleteMember}
							text="delete"
							style={{ background: '#eb5757' }}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeEditMemberModal} text="close" />
						<Button onClick={this.saveEditMember} text="save" />
					</div>
				</Modal>
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

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignContent: 'center',
							marginTop: '0.5em'
						}}>
						<h3 style={{ display: 'inline' }}>Admin?</h3>
						<ToggleButton ref={this.adminTogglebutton} />
					</div>

					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewMemberModal} text="close" />
						<Button onClick={this.saveMember} text="save" />
					</div>
				</Modal>
				<Nav admin={true} items={getAdminNavItems(1)} />
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
					<h4>{this.state.members.length} members(s)</h4>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new member" onClick={this.openNewMemberModal} />
					</div>
					<Table
						headers={['Year', 'Name', 'Email', 'Pi Points']}
						filter={this.state.filter}
						onItemClick={this.openEditMemberModal}
						data={this.state.members.slice().map(member => {
							return {
								_id: member._id,
								fields: [
									member.yearOfGraduation,
									member.name,
									member.email,
									member.piPoints || 0
								]
							}
						})}
					/>
				</div>
			</div>
		)
	}
}
