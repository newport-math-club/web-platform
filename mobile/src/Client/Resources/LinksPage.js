import React, { Component } from 'react'
import { Nav, getNavItems, Link } from '../../Components'

export default class LinksPage extends Component {
	render() {
		var linksData = [
			{
				href: 'http://www.wastudentmath.org/',
				name: 'WSMA',
				subtext:
					'Washington Student Math Association (WSMA), a student-led non-profit organization designed to expand and support math club programs in Washington. Their website has lots of great resources, including information about competitions, past tests, and summer programs.'
			},
			{
				href: 'http://www.mathace.net/',
				name: 'Mathace',
				subtext: 'General math articles written by Newport Math Club members'
			},
			{
				href: 'http://www.bsd405.org/',
				name: 'Bellevue School District',
				subtext: 'Bellevue School District webpage'
			},
			{
				href: 'http://www.bsd405.org/nhs',
				name: 'Newport High School',
				subtext: 'Newport High School webpage'
			},
			{
				href: 'http://www.artofproblemsolving.com',
				name: 'Art of Problem Solving',
				subtext:
					'Problem-solving mathematics for strong math students, with forums and lots of excellent resources.'
			},
			{
				href: 'http://www.wamath.net/hs/contests/index.html',
				name: 'High School Math Contests',
				subtext:
					'List of Washington math competitions with some past tests and results (not always current).'
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
				<Nav admin={false} items={getNavItems(2, 3)} />
				<div
					style={{
						paddingTop: '2em',
						paddingLeft: '2em',
						paddingRight: '2em',
						overflowY: 'auto'
					}}>
					<h2>Links</h2>
					{links}
				</div>
			</div>
		)
	}
}
