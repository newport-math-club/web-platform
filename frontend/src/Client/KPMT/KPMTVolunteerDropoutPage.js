import React, { Component } from 'react'
import { Nav, getNavItems, Textbox, Button } from '../../Components'
import { dropoutVolunteerKPMT } from '../../nmc-api'

export default class VolunteerDropout extends Component {
	constructor(props) {
		super(props)

		this.state = {
			status: 0
		}

		this.dropoutCodeBox = React.createRef()
	}

	handlePassResetRequest = async () => {
		const code = this.dropoutCodeBox.current.getText()

		if (code === '') {
			this.setState({ status: -1 })
			return
		}

        const response = await dropoutVolunteerKPMT(code)
        console.log(response);

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
		console.log(this.props.match)
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
{/* 					<h1>we're sad to see you leave! :( </h1>
                    <h5>enter the dropout code which was sent to you in your volunteer email</h5>
					<Textbox ref={this.dropoutCodeBox} type="text" placeholder="dropout code" text = {this.props.match.params.dropout} />
					<Button onClick={this.handlePassResetRequest} text="dropout" />
					{this.state.status === 1 && (
						<h5 style={{ color: '#31CE73' }}>
							you have been successfully unregistered!
						</h5>
					)}
					{this.state.status === -2 && (
						<h5>this is an invalid dropout code!</h5>
					)}
					{this.state.status === -3 && (
						<h5>something happened... please try again later!</h5>
					)} */}
					<h2>How did you get here?</h2>
				</div>
			</div>
		)
	}
}
