import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane, Bio } from '../../Components'

export default class KPMTPastPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 1)} />

				<div
					style={{
						float: 'left',
						width: 'calc(100% - 8em)',
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

					<h3 style={{ paddingTop: '1em' }}>10th KPMT March 17th, 2018</h3>
				</div>
			</div>
		)
	}
}
