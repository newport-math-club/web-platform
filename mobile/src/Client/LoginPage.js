import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../Components'
import { login } from '../nmc-api'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			error: false
		}

		this.emailTextBox = React.createRef()
		this.passwordTextBox = React.createRef()
	}

	handleLogin = async () => {
		const email = this.emailTextBox.current.getText()
		const password = this.passwordTextBox.current.getText()

		if (email === '' || password === '') {
			this.setState({ error: true })
			return
		}

		const response = await login(email, password)

		if (response.status !== 200) {
			this.setState({ error: true })
			return
		}

		window.location.href = '/profile'
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
					<h1>member login</h1>
					<Textbox
						onEnter={this.handleLogin}
						ref={this.emailTextBox}
						type="text"
						placeholder="student email"
					/>
					<Textbox
						onEnter={this.handleLogin}
						ref={this.passwordTextBox}
						type="password"
						placeholder="password"
					/>
					{this.state.error && (
						<h5 style={{ marginTop: '8px' }}>login failed, please try again</h5>
					)}
					<Button onClick={this.handleLogin} text="login" />
				</div>
			</div>
		)
	}
}
