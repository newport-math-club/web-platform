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
						width: 'calc(100% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>Articles</h2>
					<p>
						We periodically update articles and lessons on various math topics,
						spanning a wide range of difficulty levels. Content will be added as
						we cover more material in our club meetings. Click{' '}
						<a href="/articles">here</a> to access articles.
					</p>
				</div>
			</div>
		)
	}
}
