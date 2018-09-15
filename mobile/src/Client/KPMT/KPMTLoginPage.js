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
						paddingTop: '2em',
						paddingLeft: '2em',
						paddingRight: '2em',
						overflowY: 'auto'
					}}>
					<h2>Coach Login</h2>
					<p>
						Registered coaches of active schools may login here to register and
						manage their teams/individuals competing in KPMT. Remember, your
						school must be activated by our team prior to logging in!
					</p>

					<p>
						The functions of the coach dashboard are complex and powerful. It
						would be difficult to use with a mobile device.
					</p>

					<h3>Please use our desktop site to login :)</h3>
				</div>
			</div>
		)
	}
}
