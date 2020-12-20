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
							<h4>Thank you all for joining our annual math competition KPMT! You can check out the scores and rankings now under KPMT</h4>
							{/* <h5 style = {{color: "#527aff"}}>This is likely our final decision. 
							However, if we decide to reschedule KPMT to a later date, registered coaches will be notified through email. 
							Please email if you have questions.</h5> */}
						</a>
						<br />

						<h4>Here is the{' '}
							<a href="https://drive.google.com/drive/folders/1YL6AEdBAuWUt8PSVg3XGOchTjhE9dixE?usp=sharing">
								Answer Keys
							</a>
							{' '}and the{' '}
							<a href="https://forms.gle/MVV6rwLrjRYvkp6i7">
								Coach/Parent Feedback Form
							</a>
							{' '}for KPMT.
						</h4>
						<br />
						<h4>
							Here is the{' '}
							<a href="https://youtu.be/tuAkEruJJF8">
								KPMT YouTube LiveStream Playback
							</a>! (The link does not work with school computers)
						</h4>
					</div>
				</div>
			</div>
		)
	}
}
