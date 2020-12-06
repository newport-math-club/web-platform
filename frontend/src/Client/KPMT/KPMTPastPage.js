import React, { Component } from 'react'
import { Nav, getNavItems } from '../../Components'

export default class KPMTPastPage extends Component {
	render() {
		let pastTestsData = [
			{
				href:
					'https://drive.google.com/drive/folders/1RFYUPB3WEQa5AxLhpm11EXbcfvUXYSXq?usp=sharing',
				name: 'KPMT 2018-19 Tests'
			},{
				href:
					'https://drive.google.com/drive/folders/1Lsg15wrUnfPlDqjs-E8jED8k6hFRTk4P?usp=sharing',
				name: 'KPMT 2018-19 Keys'
			},
			{
				href:
					'https://drive.google.com/drive/folders/0Bzu8EHUvJs0xZjdXNDZ2eHJRcVE?usp=sharing',
				name: 'KPMT 2016-17 Tests'
			},
			{
				href:
					'https://drive.google.com/drive/folders/0Bzu8EHUvJs0xanhHQXhJTncyalU?usp=sharing',
				name: 'KPMT 2016-17 Keys'
			},
			{
				href:
					'https://drive.google.com/drive/folders/0B0X3o4AqKeRPOWdvMkZiR1cyWVk?usp=sharing',
				name: 'KPMT 2015-16 Tests'
			},
			{
				href:
					'https://drive.google.com/drive/folders/0B0X3o4AqKeRPU09pVkg3V0dRZUE?usp=sharing',
				name: 'KPMT 2015-16 Keys'
			},
			{
				href:
					'https://drive.google.com/drive/folders/0Bzu8EHUvJs0xbjdlTkh6R25HX0E?usp=sharing',
				name: 'KPMT 2014-15'
			},
			{
				href:
					'https://drive.google.com/drive/folders/0Bzu8EHUvJs0xMGp2VE9WbjhlR0E?usp=sharing',
				name: 'KPMT 2013-14'
			}
			/* ,
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
			} */
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
						src="https://drive.google.com/thumbnail?id=14Jqm11IYPGynrpenz9KfVolkPmjqoeNx"
					/>
					<h2 style={{ paddingTop: '1em' }}>Past Papers</h2>
					<p>
						You can find archives of previous tests here. Every year has a
						shared google drive folder containing every test from that
						year. We are still in the process of recovering our tests.
					</p>

					{pastTests.length > 0 ? pastTests : nothingMsg}
				</div>
			</div>
		)
	}
}
