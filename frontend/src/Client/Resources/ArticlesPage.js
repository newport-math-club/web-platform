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
						marginLeft: '20%',
						width: 'calc(60% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					{/* <h2>Articles</h2> */}
					<p>Not much to see here. Sorry!</p>
				</div>
			</div>
		)
	}
}
