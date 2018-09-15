import React, { Component } from 'react'
import { Nav, getNavItems } from '../../Components'

export default class KPMTContactPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 4)} />

				<div
					style={{
						paddingTop: '2em',
						paddingLeft: '2em',
						paddingRight: '2em',
						overflowY: 'auto'
					}}>
					<h2>Contact Us</h2>
					<h3>Mailing Address</h3>
					<p>
						Newport Math Club <br />
						Newport High School <br />
						4333 Factoria Blvd. <br />
						SE Bellevue, WA 98006
					</p>

					<h3>Email Address</h3>
					<p>
						Competition Support: kpmt@newportmathclub.org <br />
						<br />
						Website Support: webmaster@newportmathclub.org
					</p>
				</div>
			</div>
		)
	}
}
