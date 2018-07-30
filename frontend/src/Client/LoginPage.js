import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../Components'
import { login } from '../nmc-api'

export default class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.emailTextBox = React.createRef()
		this.passwordTextBox = React.createRef()
	}

	handleLogin = async () => {
		const email = this.emailTextBox.current.getText()
		const password = this.passwordTextBox.current.getText()

		const response = await login(email, password)

		console.log(response)
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
						ref={this.emailTextBox}
						type="text"
						placeholder="student email"
					/>
					<Textbox
						ref={this.passwordTextBox}
						type="password"
						placeholder="password"
					/>
					<Button onClick={this.handleLogin} text="login" />
				</div>
			</div>
		)
	}
}
