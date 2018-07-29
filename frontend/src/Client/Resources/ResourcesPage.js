import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane, Bio } from '../../Components'

export default class ResourcesPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(2, 0)} />
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

					<h2 style={{ paddingTop: '1em' }}>Practice</h2>
					<p>
						Practice is the best way to improve your performance at math
						contests and even in math class. Dedication and consistent practice
						are necessary for maximum growth. Incorporate math practice into
						your daily or weekly schedule and you'll be more prepared and
						confident at competitions. Click <a href="/practice">here</a> to
						access practice problems.
					</p>

					<h2 style={{ paddingTop: '1em' }}>Links</h2>
					<p>
						Here you'll find resources provided by other parties that are
						associated with this club. Click <a href="/links">here</a> to access
						other resources.
					</p>
				</div>
			</div>
		)
	}
}
