import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane, Bio } from '../Components'

export default class EventsPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(1)} />
				<div
					style={{
						float: 'left',
						width: 'calc(100% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>P1</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</p>

					<h2 style={{ paddingTop: '1em' }}>P2</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</div>
		)
	}
}
