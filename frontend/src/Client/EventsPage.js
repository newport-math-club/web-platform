import React, { Component } from 'react'
import { Nav, getNavItems, Link } from '../Components'

export default class EventsPage extends Component {
	render() {
		var linksData = [
			{
				href: 'https://www.maa.org/math-competitions/amc-1012',
				name: 'American Mathematics Competition (AMC) 10/12',
				subtext:
					'We host the AMC 10/12 tests at Newport High Schools on February 7 (A) and February 13 (B).'
			},
			{
				href: 'https://www.maa.org/math-competitions/invitational-competitions',
				name: 'American Invitational Math Examination',
				subtext:
					'Those who score exceptionally on the AMC will be invited to take the AIME on '
			},
			{
				href: 'http://www.academicsarecool.com/#/competitions',
				name: 'Math is Cool',
				subtext:
					'MIC is a math contest for grade levels 4-12. Competitors compete at a local level for a chance to go to state.'
			},
			{
				href: 'http://wamath.net/hs/contests/fallclassic/samples.html',
				name: 'Mu Alpha Theta Fall Classic'
			},
			{
				href: 'http://wamath.net/hs/contests/wastate/state08/index.html',
				name: 'Mu Alpha Theta State'
			}
		]

		var links = linksData.map(linkData => {
			return (
				<div>
					<Link href={linkData.href} name={linkData.name} />
					<p style={{ marginTop: 0 }}>{linkData.subtext}</p>
				</div>
			)
		})

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
					<p>
						We participate in many events and competitions in our region. We
						also host KPMT; more details in the KPMT tab.
					</p>
					{links}
				</div>
			</div>
		)
	}
}
