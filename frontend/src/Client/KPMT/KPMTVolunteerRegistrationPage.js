import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../../Components'
import { registerVolunteerKPMT } from '../../nmc-api'

export default class KPMTRegistrationPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			error: null, // 1: empty/whitespace inputs, 2: passwords dont match
			understood: false,
			success: false,
			currentRole: "",
		}

		this.schoolTextbox = React.createRef()
		this.nameTextbox = React.createRef()
        this.emailTextBox = React.createRef()
        this.pRoleTextBox = React.createRef()
		this.gradeTextBox = React.createRef()
		this.partnerTextBox = React.createRef()
	}

	handleRegister = async () => {
		// handle login logic, if error, put http status code into this.state.error

		const name = this.nameTextbox.current.getText()
		const school = this.schoolTextbox.current.getText()
        const email = this.emailTextBox.current.getText()
        const pRole = this.pRoleTextBox.current.getText()
		const grade = this.gradeTextBox.current.getText()
		const partner = this.partnerTextBox.current.getText()
		
		if (
			name.isOnlyWhitespace() ||
			school.isOnlyWhitespace() ||
			email.isOnlyWhitespace() ||
            !email.isValidEmail() || isNaN(grade)
		) {
			this.setState({ error: 1 })
			return
        }
        
        if (pRole.toLowerCase() != "proctor" && pRole.toLowerCase() != "grader" && pRole.toLowerCase() != "runner")         {
            this.setState({ error: 2 })
			return
		}
		
		if (pRole.toLowerCase() === "proctor" && (!partner || partner.split(" ").length < 2)){
			this.setState({error : 4})
			return
		}

		const response = await registerVolunteerKPMT(school, name, email, pRole, grade, partner ? partner : "");

		if (response.status === 200) {
			this.setState({ error: -1 })
			this.nameTextbox.current.clear()
			this.schoolTextbox.current.clear()
			this.emailTextBox.current.clear()
            this.pRoleTextBox.current.clear()
			this.gradeTextBox.current.clear()
			this.partnerTextBox.current.clear()
			
		} else if ((await response.json()).error === "email already exists") {
			this.setState({error : 3 })
		} else {
			this.setState({ error: response.status })
		}
	}

	roleChange = async (e) => {
		this.setState( {
			currentRole: e.target.value
		})
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
						alt="kpmt-banner"
						style={{
							width: '100%',
						}}
						src="https://drive.google.com/uc?id=14Jqm11IYPGynrpenz9KfVolkPmjqoeNx"
					/>

					<h2>Volunteer Registration</h2>	
					<div style={{ textAlign: 'center', marginTop: '5em' }}>
						<h3 style={{ color: '#eb5757' }}>
							IMPORTANT: Please read the following!
						</h3>
						<p>
							Thank you for volunteering! Due to the new format we are employing under the quarantine, we only offer volunteering opportinunity for "Proctors".
						</p>
						<p>
							Please follow the instruction here: <a href = "https://forms.office.com/Pages/ResponsePage.aspx?id=OUFKmQZ8HkmAmHkAbVdd4MAqt61CK-ZLgkSRQr3Zq89UOUFDVEZHSDlUQzJMNERGN0kySkhWS0FQRC4u">Microsoft Form</a>
						</p>
					</div>
					
						{/* 
					<img
						alt="kpmt-banner"
						src="https://drive.google.com/thumbnail?id=14Jqm11IYPGynrpenz9KfVolkPmjqoeNx"
					/>
					<h2 style={{ paddingTop: '1em' }}>Volunteer Registration/Dropout</h2>
					<div style={{ textAlign: 'center', marginTop: '5em' }}>
						<h3 style={{ color: '#eb5757' }}>
							IMPORTANT: Please read the following!
						</h3>
						
						<p>
							Thank you for volunteering! In the "preferred role" textbox, please type one of "Proctor", "Grader" or "Runner" (without the quotes), exactly as shown. If you are registering as a proctor, please enter a person you would like to partner with (first AND last name).
						</p>
						
						<p>
							If you no longer want to volunteer, or your incorrectly entered your information, you can drop out <a href = "/kpmt/volunteer/dropout">at this link</a>.
						</p>

						<p>
							Here is more information about the volunteer schedule: <a href = "https://newport-math-club.nyc3.digitaloceanspaces.com/kpmt-docs/volsched.pdf">Schedule</a>
						</p>

						<p>
							<b>The deadline for registration is December 5th, 2020.</b>
						</p>
					</div>

					{this.state.understood ? (
						<div>
							<Textbox
								ref={this.nameTextbox}
								type="text"
								placeholder="name"
							/>
                            <Textbox
								ref={this.schoolTextbox}
								type="text"
								placeholder="school name"
							/>
							<Textbox
								ref={this.gradeTextBox}
								type="number"
								placeholder="grade"
							/>
							<Textbox
								ref={this.emailTextBox}
								type="text"
								placeholder="email"
							/>
                            <Textbox
								ref={this.pRoleTextBox}
								type="text"
								placeholder="preferred role"
								onChange = {this.roleChange}
							/>
							<Textbox
								ref={this.partnerTextBox}
								type="text"
								placeholder="partner (first AND last name)"
								disabled = {this.state.currentRole.toLowerCase() !== "proctor"}
							/>
                            
							
                            
                            <div style={{ textAlign: 'center' }}>
								{(this.state.error === 1 || this.state.error === 400) && (
									<h5 style={{ marginTop: '8px' }}>
										invalid inputs, please fill out the form
									</h5>
								)}
								{this.state.error === 2 && (
									<h5 style={{ marginTop: '8px' }}>
                                        please type "Proctor", "Grader" or "Runner"
									</h5>
								)}
								{this.state.error === 3 && (
									<h5 style = {{marginTop: '8px'}}>
										you have already registered under this email!
									</h5>
								)}
								{this.state.error === 4 && (
									<h5 style = {{marginTop: '8px'}}>
										if you are a proctor please enter your partner's first AND last name.
									</h5>
								)}
								{this.state.error === 403 && (
									<h5 style={{ marginTop: '8px' }}>
										sorry, registration is closed at this time :(
									</h5>
								)}
								{this.state.error === 500 && (
									<h5 style={{ marginTop: '8px' }}>
										something happened, please try again later :(
									</h5>
								)}
								{this.state.error === -1 && (
									<h5 style={{ marginTop: '8px', color: '#31CE73' }}>
										registration successful, we've sent an email to confirm your information :)
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
					)} */}
					
				</div>
				
			</div>
		)
	}
}
