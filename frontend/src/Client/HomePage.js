import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div
					className="fill-nav-remainder homepage"
					style={{ width: 'calc(100% - 8em)' }}>
					<div style = {{width: "50%"}}>
						<h1>Mondays 4:00-5:00</h1>
						<h5>Online at Teams</h5>
						<h5>contact@newportmathclub.org</h5>
						<br />
						<br />
						<a href="/kpmt">
							<h4>Knight of Pi Math Tournament is on December 12th this year!</h4>
							{/* <h5 style = {{color: "#527aff"}}>This is likely our final decision. 
							However, if we decide to reschedule KPMT to a later date, registered coaches will be notified through email. 
							Please email if you have questions.</h5> */}
						</a>
						<br />
						<h4>Here is the{' '}
							<a href="https://bit.ly/3oJW06r">
								detailed schedule
							</a>
							, the{' '}
							<a href="https://bit.ly/3a40X60">
								room assignment sheet
							</a>
							, and the{' '}
							<a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSBol3HKDYzmJp9bTzcnd3XdVmGoDtmG1DOzkqS7227czxMY4jp6NK2kfRvbL57-QvfZlZDZcFSSJyb/pubhtml">
								sheet of answer forms
							</a>
							{' '}for KPMT.
						</h4>
						<br />
						<h4>
							Here is the{' '}
							<a href="https://youtu.be/tuAkEruJJF8">
								KPMT YouTube LiveStream
							</a>, prepare your popcorn and be ready! (The link does not work with school computers)
						</h4>
					</div>
				</div>
			</div>
		)
	}
}
