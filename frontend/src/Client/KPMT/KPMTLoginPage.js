import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../../Components'
import { loginKPMT } from '../../nmc-api'

export default class KPMTLoginPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			error: null
		}

		this.emailTextBox = React.createRef()
		this.passwordTextBox = React.createRef()
	}

	handleLogin = async () => {
		const email = this.emailTextBox.current.getText()
		const password = this.passwordTextBox.current.getText()

		if (
			email.isOnlyWhitespace() ||
			password.isOnlyWhitespace() ||
			!email.isValidEmail()
		) {
			this.setState({ error: 1 })
			return
		}

		const response = await loginKPMT(email, password)

		if (response.status === 200) {
			window.location.href = '/kpmt/coach/dashboard'
		} else {
			this.setState({ error: response.status })
		}
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
						overflowY: 'auto'
					}}>
					<img
						alt="kpmt-banner"
						style={{ width: '100%' }}
						src="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmtbanner.png"
					/>
					<h2 style={{ paddingTop: '1em' }}>Coach Login</h2>
					<p>
						Registered coaches of active schools may login here to register and
						manage their teams/individuals competing in KPMT. Remember, your
						school must be activated by our team prior to logging in!
					</p>

					<Textbox
						onEnter={this.handleLogin}
						ref={this.emailTextBox}
						type="text"
						placeholder="coach email"
					/>
					<Textbox
						onEnter={this.handleLogin}
						ref={this.passwordTextBox}
						type="password"
						placeholder="password"
					/>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
						{this.state.error === 403 && (
							<h5 style={{ marginTop: '8px' }}>
								your account has not been activated yet!
							</h5>
						)}
						{(this.state.error === 404 || this.state.error === 401) && (
							<h5 style={{ marginTop: '8px' }}>invalid credentials</h5>
						)}
					</div>
					<div style={{ textAlign: 'center' }}>
						<Button onClick={this.handleLogin} text="login" />
					</div>
				</div>
			</div>
		)
	}
}
