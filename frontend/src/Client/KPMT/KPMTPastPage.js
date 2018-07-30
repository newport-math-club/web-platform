import React, { Component } from 'react'
import { Nav, getNavItems, Link } from '../../Components'

export default class KPMTPastPage extends Component {
	render() {
		var pastTestsData = []
		var pastTests = pastTestsData.map(pastTest => {
			return (
				<div>
					<Link href={pastTest.href} name={pastTest.name} />
					<p style={{ marginTop: 0 }}>{pastTest.date}</p>
				</div>
			)
		})

		const nothingMsg = (
			<div>
				{/* TODO: populate this page */}
				<p>Nothing to see here yet; coming soon!</p>
			</div>
		)

		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 1)} />

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
					<h2 style={{ paddingTop: '1em' }}>Past Papers</h2>
					<p>
						You can find archives of previous tests here. Every year has a
						downloadable compressed .zip folder containing every test from that
						year.
					</p>

					{pastTests.length > 0 ? pastTests : nothingMsg}
				</div>
			</div>
		)
	}
}
