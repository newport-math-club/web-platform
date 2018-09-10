import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class EventsPage extends Component {
	render() {
		// var linksData = [
		//   {
		//     href: 'https://artofproblemsolving.com/community/c13_contests',
		//     name: 'American Mathematics Competition'
		//   },
		//   {
		//     href: 'https://artofproblemsolving.com/community/c13_contests',
		//     name: 'United States of America Mathematical Olympiad'
		//   },
		//   {
		//     href: 'http://www.wamath.net/contests/MathisCool/samples/high.html',
		//     name: 'Math is Cool'
		//   },
		//   {
		//     href: 'http://wamath.net/hs/contests/fallclassic/samples.html',
		//     name: 'Mu Alpha Theta Fall Classic'
		//   },
		//   {
		//     href: 'http://wamath.net/hs/contests/wastate/state08/index.html',
		//     name: 'Mu Alpha Theta State'
		//   },
		//   {
		//     href: 'http://www.wsmc.net/contests/',
		//     name: 'Washington State Mathematics Council Mathematics Contest'
		//   },
		//   {
		//     href: 'http://wamath.net/hs/contests/sigma/samples.html',
		//     name: 'Skyview Math Contest'
		//   }
		// ]

		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(1)} />
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
					<h2>Events & Competitions</h2>
					<p>Not much to see here (yet). Come back later :)</p>
					{/* {events} */}
				</div>
			</div>
		)
	}
}
