import React, { Component } from 'react'
import { Nav, getNavItems, Link, Textbox, Button } from '../../Components'
import { registerKPMT } from '../../nmc-api'

export default class KPMTRegistrationPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			error: null, // 1: empty/whitespace inputs, 2: passwords dont match
			understood: false,
			success: false
		}

		this.schoolTextbox = React.createRef()
		this.nameTextbox = React.createRef()
		this.emailTextBox = React.createRef()
		this.passwordTextBox = React.createRef()
		this.passwordRepeatTextBox = React.createRef()
	}

	handleRegister = async () => {
		// handle login logic, if error, put http status code into this.state.error

		const name = this.nameTextbox.current.getText()
		const school = this.schoolTextbox.current.getText()
		const email = this.emailTextBox.current.getText()
		const password = this.passwordTextBox.current.getText()
		const passwordRepeat = this.passwordRepeatTextBox.current.getText()

		if (passwordRepeat !== password) {
			this.setState({ error: 2 })
			return
		}

		if (
			name.isOnlyWhitespace() ||
			password.isOnlyWhitespace() ||
			school.isOnlyWhitespace() ||
			email.isOnlyWhitespace() ||
			!email.isValidEmail()
		) {
			this.setState({ error: 1 })
			return
		}

		const response = await registerKPMT(school, name, email, password)

		if (response.status == 200) {
			this.setState({ error: -1 })
			this.nameTextbox.current.clear()
			this.schoolTextbox.current.clear()
			this.emailTextBox.current.clear()
			this.passwordTextBox.current.clear()
			this.passwordRepeatTextBox.current.clear()
		} else {
			this.setState({ error: response.status })
		}
	}

	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 2)} />

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
					<h2 style={{ paddingTop: '1em' }}>School Registration</h2>
					<div style={{ textAlign: 'center', marginTop: '5em' }}>
						<h3 style={{ color: '#eb5757' }}>
							IMPORTANT: Please read the following!
						</h3>
						<p>
							Please note that only ONE coach can sign up for your entire
							school! After submission, your registration will be pending
							activation by our team. Duplicate schools will NOT be allowed. We
							will reject all submissions for schools that are already
							registered. Please coordinate among your school's coaches if you
							have multiple coaches, as only ONE can represent your school in
							registration.
						</p>

						<p>
							Once you register, a KPMT coach account will be made for your
							school with the credentials that you provide. You will only be
							able to login after we activate your account. Once your account is
							activated, you can login <a href="/kpmt/login">here</a>. To avoid
							confusion, you cannot change your name, school name, or email
							after registering! You will be able to change your password. Once
							you login, you can add teams and individuals to represent your
							school. It will also display the cost of registering the given
							number of students and teams, but you cannot pay online.
							{/* TODO: something about how to pay here */}
						</p>
					</div>

					{this.state.understood ? (
						<div>
							<Textbox
								ref={this.schoolTextbox}
								type="text"
								placeholder="school name"
							/>
							<Textbox
								ref={this.nameTextbox}
								type="text"
								placeholder="coach name"
							/>
							<Textbox
								ref={this.emailTextBox}
								type="text"
								placeholder="coach email"
							/>
							<Textbox
								ref={this.passwordTextBox}
								type="password"
								placeholder="password"
							/>
							<Textbox
								ref={this.passwordRepeatTextBox}
								type="password"
								placeholder="password again"
							/>
							<div style={{ textAlign: 'center' }}>
								{(this.state.error == 1 || this.state.error == 400) && (
									<h5 style={{ marginTop: '8px' }}>
										invalid inputs, please fill out the form
									</h5>
								)}
								{this.state.error == 2 && (
									<h5 style={{ marginTop: '8px' }}>
										invalid inputs, passwords dont match
									</h5>
								)}
								{this.state.error == 403 && (
									<h5 style={{ marginTop: '8px' }}>
										sorry, registration is closed at this time :(
									</h5>
								)}
								{this.state.error == 500 && (
									<h5 style={{ marginTop: '8px' }}>
										something happened, please try again later :(
									</h5>
								)}
								{this.state.error == -1 && (
									<h5 style={{ marginTop: '8px', color: '#31CE73' }}>
										registration successful, please wait for your account to be
										activated :)
									</h5>
								)}
							</div>
							<div style={{ textAlign: 'center' }}>
								<Button onClick={this.handleRegister} text="register" />
							</div>
						</div>
					) : (
						<div style={{ textAlign: 'center' }}>
							<Button
								onClick={() => {
									this.setState({ understood: true })
								}}
								text="understood"
							/>
						</div>
					)}
				</div>
			</div>
		)
	}
}
