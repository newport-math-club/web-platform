import React, { Component } from 'react'
import { Nav, getNavItems, Link } from '../../Components'

export default class KPMTPastPage extends Component {
	render() {
		let pastTestsData = [
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2017-18.zip',
				name: 'KPMT 2017-18'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2016-17.zip',
				name: 'KPMT 2016-17'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2015-16.zip',
				name: 'KPMT 2015-16'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2014-15.zip',
				name: 'KPMT 2014-15'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2013-14.zip',
				name: 'KPMT 2013-14'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2012-13.zip',
				name: 'KPMT 2012-13'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2011-12.zip',
				name: 'KPMT 2011-12'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2010-11.zip',
				name: 'KPMT 2010-11'
			},
			{
				href:
					'https://newport-math-club.nyc3.digitaloceanspaces.com/past-kpmt/kpmt2009-10.zip',
				name: 'KPMT 2009-10'
			}
		]
		let pastTests = pastTestsData.map(pastTest => {
			return (
				<div>
					<a href={pastTest.href}>
						<h3>{pastTest.name}</h3>
					</a>
				</div>
			)
		})

		const nothingMsg = (
			<div>
				<p>Nothing to see here yet; coming soon!</p>
			</div>
		)

		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 3)} />

				<div
					style={{
						paddingTop: '2em',
						paddingLeft: '2em',
						paddingRight: '2em',
						overflowY: 'auto'
					}}>
					<h2>Past Papers</h2>
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
