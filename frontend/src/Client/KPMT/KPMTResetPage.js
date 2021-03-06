import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../../Components'
import { resetKPMTForgotPass } from '../../nmc-api'

export default class KPMTResetPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: 0
		}

		this.passwordTextBox = React.createRef()
		this.repeatTextBox = React.createRef()
	}

	handleChangePassword = async () => {
		const password = this.passwordTextBox.current.getText()
		const repeat = this.repeatTextBox.current.getText()

		const token = this.props.location.search.split('=')[1]

		if (repeat === '' || password === '') {
			this.setState({ status: -1 })
			return
		}

		if (repeat !== password) {
			this.setState({ status: -1 })
			return
		}

		const response = await resetKPMTForgotPass(password, token)

		if (response.status === 404) {
			this.setState({ status: -2 })
			return
		} else if (response.status === 403) {
			this.setState({ status: -3 })
			return
		} else if (response.status !== 200) {
			this.setState({ status: -4 })
			return
		}
		this.setState({ status: 1 })
	}

	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 5)} />

				<div
					style={{
						float: 'left',
						marginLeft: '20%',
						width: 'calc(60% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto',
						textAlign: 'center'
					}}>
					<h1 style={{ paddingTop: '1em' }}>reset your kpmt password</h1>

					<Textbox
						ref={this.passwordTextBox}
						type="password"
						placeholder="new password"
					/>
					<Textbox
						ref={this.repeatTextBox}
						type="password"
						placeholder="new password again"
					/>
					<Button onClick={this.handleChangePassword} text="change password" />
					{this.state.status === 1 && (
						<h5 style={{ color: '#31CE73' }}>your password has been changed</h5>
					)}
					{this.state.status === -2 && <h5>invalid token</h5>}
					{this.state.status === -3 && <h5>your password reset has expired</h5>}
					{this.state.status === -4 && (
						<h5>something happened... try again later!</h5>
					)}
				</div>
			</div>
		)
	}
}
