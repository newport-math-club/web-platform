import React, { Component } from 'react'
import Modal from 'react-modal'
import { fetchSchoolProfile, schoolChangePassword } from '../../../nmc-api'
import {
	CoachNav,
	getCoachNavItems,
	Textbox,
	Button
} from '../../../Components'
import moment from 'moment'

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

export default class KPMTDashboardPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			profile: {
				teams: [],
				competitors: [],

				changePasswordModalOpen: false,
				password: '',
				newPassword: ''
			}
		}
		this.oldPasswordTextbox = React.createRef()
		this.newPasswordTextbox = React.createRef()
		this.newPasswordRepeatTextbox = React.createRef()
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
			newPassword: ''
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
			// TODO:
			return
		}

		if (newPassword !== newPasswordRepeat) {
			// TODO:
			return
		}

		const response = await schoolChangePassword(
			this.state.profile.coachEmail,
			oldPassword,
			newPassword
		)

		if (response.status == 200) {
			this.closeChangePasswordModal()
		} else {
			// TODO:
		}
	}

	// fetch profile data here
	async componentDidMount() {
		const response = await fetchSchoolProfile()

		if (response.status != 200) {
			window.location.href = '/login'
			return
		}

		const data = await response.json()

		this.setState({
			profile: data
		})
	}

	render() {
		console.log(this.state.profile.teams)
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
				</Modal>
				<CoachNav items={getCoachNavItems(0)} />
				<div
					style={{
						float: 'left',
						marginLeft: '20%',
						width: 'calc(60% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>{this.state.profile.name}</h2>
					<h5>
						Registered:{' '}
						{moment(this.state.profile.registrationDate).format('MM/DD/YYYY')}
					</h5>
					<h3>
						Coach:{' '}
						{this.state.profile.coachName +
							', ' +
							this.state.profile.coachEmail}
					</h3>
					<h3>
						{this.state.profile.teams.length +
							' team(s), ' +
							(this.state.profile.competitors.length -
								this.state.profile.teams
									.slice()
									.map(t => t.members)
									.reduce((a, b) => a + b.length, 0)) +
							' individual(s)'}
					</h3>
					<h3>
						{this.state.profile.competitors.length} total student competitors
					</h3>
					{/* TODO: add cost calculation here */}

					<a onClick={this.openChangePasswordModal}>
						<h3>Change your password</h3>
					</a>
				</div>
			</div>
		)
	}
}
