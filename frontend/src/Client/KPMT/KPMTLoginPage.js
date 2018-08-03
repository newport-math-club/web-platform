import React, { Component } from 'react'
import { Nav, getNavItems, Link, Textbox, Button } from '../../Components'

export default class KPMTLoginPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			error: null
		}

		this.emailTextBox = React.createRef()
		this.passwordTextBox = React.createRef()
	}

	handleLogin = () => {
		const email = this.emailTextBox.current.getText()
		const password = this.passwordTextBox.current.getText()

		// TODO: handle login logic, if error, put http status code into this.state.error
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
					{this.state.error && (
						<h5 style={{ marginTop: '8px' }}>login failed, please try again</h5>
					)}
					<div style={{ textAlign: 'center' }}>
						<Button onClick={this.handleLogin} text="login" />
					</div>
				</div>
			</div>
		)
	}
}
