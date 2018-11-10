import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../Components'
import { login, forgotPass } from '../nmc-api'

export default class ForgotPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			status: 0
		}

		this.emailTextBox = React.createRef()
	}

	handlePassResetRequest = async () => {
		const email = this.emailTextBox.current.getText()

		if (email === '') {
			this.setState({ status: -1 })
			return
		}

		const response = await forgotPass(email)

		if (response.status === 404) {
			this.setState({ status: -2 })
			return
		} else if (response.status !== 200) {
			this.setState({ status: -3 })
			return
		}
		this.setState({ status: 1 })
	}

	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div
					style={{
						float: 'left',
						width: 'calc(100% - 8em)',
						paddingTop: '12em',
						paddingLeft: '4em',
						paddingRight: '4em',
						paddingBottom: '2em',
						overflowY: 'auto',
						textAlign: 'center'
					}}>
					<h1>recover password</h1>
					<Textbox ref={this.emailTextBox} type="text" placeholder="email" />
					<Button onClick={this.handlePassResetRequest} text="send link" />
					{this.state.status === 1 && (
						<h5 style={{ color: '#31CE73' }}>
							link has been sent to your email
						</h5>
					)}
					{this.state.status === -2 && (
						<h5>this email is not registered in our system</h5>
					)}
					{this.state.status === -3 && (
						<h5>something happened... please try again later!</h5>
					)}
				</div>
			</div>
		)
	}
}
