import React, { Component } from 'react'
import { Nav, getNavItems, Link } from '../../Components'

export default class ArticlesPage extends Component {
	render() {
		let linksData = [
			{
				href: 'https://usamo.wordpress.com/2016/04/17/against-perfect-scores/',
				name: 'USAMO: Against Perfect Scores',
				subtext: 'Evan Chen April 17th, 2016'
			},
			{
				href: 'https://usamo.wordpress.com/2015/03/14/writing/',
				name: 'USAMO: Writing',
				subtext: 'Evan Chen March 14th, 2015'
			},
			{
				href: 'https://artofproblemsolving.com/articles',
				name: 'AOPS Articles',
				subtext: 'Link to Art of Problem Solving articles'
			}
		]

		let links = linksData.map(linkData => {
			return (
				<div>
					<Link href={linkData.href} name={linkData.name} />
					<p style={{ marginTop: 0 }}>{linkData.subtext}</p>
				</div>
			)
		})

		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(2, 1)} />
				<div
					style={{
						float: 'left',
						paddingTop: '2em',
						paddingLeft: '2em',
						paddingRight: '2em',
						overflowY: 'auto'
					}}>
					<h2>Articles</h2>
					{links}
				</div>
			</div>
		)
	}
}
