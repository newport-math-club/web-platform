import React, { Component } from 'react'
import { Nav, getNavItems } from '../../Components'

export default class KPMTContactPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 4)} />

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
					<h2 style={{ paddingTop: '1em' }}>Contact Us</h2>
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
						Website Support: webmaster@newportmathclub.org
					</p>
				</div>
			</div>
		)
	}
}
