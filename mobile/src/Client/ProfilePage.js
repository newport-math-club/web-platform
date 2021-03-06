import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../Components'
import { fetchProfile, changePassword } from '../nmc-api'
import SocketEventHandlers from '../Sockets'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '20em',
		right: 'auto',
		bottom: 'auto',
		paddingBottom: '6em',
		paddingLeft: '2em',
		paddingRight: '2em',
		paddingTop: '2em',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: '1px 2px 8px #c4c4c4',
		borderRadius: '32px',
		border: 'none'
	}
}

export default class ProfilePage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			changePasswordModalOpen: false,
			password: '',
			newPassword: ''
		}

		this.oldPasswordTextbox = React.createRef()
		this.newPasswordTextbox = React.createRef()
		this.newPasswordRepeatTextbox = React.createRef()
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeToPiPointChange()
	}

	// fetch profile data here
	async componentDidMount() {
		SocketEventHandlers.subscribeToPiPointChange(data => {
			this.setState({ piPoints: this.state.piPoints + parseInt(data) })
		})

		const response = await fetchProfile()

		if (response.status !== 200) {
			window.location.href = '/login'
			return
		}

		const data = await response.json()

		this.setState({
			name: data.name,
			email: data.email,
			piPoints: data.piPoints ? data.piPoints : 0,
			year: data.yearOfGraduation,
			admin: data.admin
		})
	}

	openChangePasswordModal = () => {
		this.setState({
			changePasswordModalOpen: true
		})
	}

	closeChangePasswordModal = () => {
		this.setState({
			changePasswordModalOpen: false,
			password: '',
			newPassword: '',
			error: 0
		})
	}

	changePassword = async () => {
		const oldPassword = this.oldPasswordTextbox.current.getText()
		const newPasswordRepeat = this.newPasswordRepeatTextbox.current.getText()
		const newPassword = this.newPasswordTextbox.current.getText()

		if (
			oldPassword.isOnlyWhitespace() ||
			newPasswordRepeat.isOnlyWhitespace() ||
			newPassword.isOnlyWhitespace()
		) {
			this.setState({ error: 1 })
			return
		}

		if (newPassword !== newPasswordRepeat) {
			this.setState({ error: 2 })
			return
		}

		const response = await changePassword(
			this.state.email,
			oldPassword,
			newPassword
		)

		if (response.status === 200) {
			this.closeChangePasswordModal()
			this.setState({ error: 0 })
		} else {
			if (response.status === 401) window.location.href = '/login'
			else this.setState({ error: response.status })
		}
	}

	render() {
		const firstName = this.state.name ? this.state.name.split(' ')[0] : ''
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.changePasswordModalOpen}
					style={customStyles}
					contentLabel="Change Password">
					<h2>Change Password</h2>
					<Textbox
						ref={this.oldPasswordTextbox}
						placeholder="old password"
						type="password"
					/>
					<Textbox
						ref={this.newPasswordTextbox}
						placeholder="new password"
						type="password"
					/>
					<Textbox
						ref={this.newPasswordRepeatTextbox}
						placeholder="new password again"
						type="password"
					/>

					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeChangePasswordModal} text="cancel" />
						<Button onClick={this.changePassword} text="save" />
					</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
						{this.state.error === 2 && (
							<h5 style={{ marginTop: '8px' }}>new passwords don't match</h5>
						)}
						{this.state.error === 500 && (
							<h5 style={{ marginTop: '8px' }}>
								something went wrong, please try again
							</h5>
						)}
					</div>
				</Modal>
				<Nav admin={false} items={getNavItems(4, 0, firstName)} />
				<div
					style={{
						paddingTop: '2em',
						paddingLeft: '2em',
						paddingRight: '2em',
						overflowY: 'auto'
					}}>
					<h2>{this.state.name}</h2>
					<h5>email: {this.state.email}</h5>
					<h5>year of graduation: {this.state.year}</h5>
					<br />
					<h5>
						<a onClick={this.openChangePasswordModal}>change password</a>
					</h5>
					<br />
					{this.state.admin && (
						<h5>use desktop site to access admin dashboard</h5>
					)}

					<br />
					<h3>you have {this.state.piPoints} pi points</h3>
				</div>
			</div>
		)
	}
}
