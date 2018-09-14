import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class LostPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(-1)} />
				<div
					style={{
						float: 'left',
						width: 'calc(100% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto',
						textAlign: 'center'
					}}>
					<h1 style={{ fontSize: '20em' }}>:(</h1>
					<h2>404 Not Found</h2>
					<p>The page you're looking for doesn't exist, sorry!</p>
				</div>
			</div>
		)
	}
}
