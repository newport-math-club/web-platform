import React, { Component } from 'react'
import { Nav, getNavItems } from '../../Components'

export default class ArticlesPage extends Component {
	render() {
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
					<p>Not much to see here (yet). Come back later :)</p>
				</div>
			</div>
		)
	}
}
