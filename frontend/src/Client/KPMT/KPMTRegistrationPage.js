import React, { Component } from 'react'
import { Nav, getNavItems, Link, Textbox, Button } from '../../Components'

export default class KPMTRegistrationPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			error: null,
			understood: false
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
							activated, you can login <a href="/kpmt/login">here</a>. Once you
							login, you can add teams and individuals to represent your school.
							It will also display the cost of registering the given number of
							students and teams, but you cannot pay online.
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
								ref={this.passwordTextBox}
								type="password"
								placeholder="password again"
							/>
							{this.state.error && (
								<h5 style={{ marginTop: '8px' }}>
									login failed, please try again
								</h5>
							)}
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
