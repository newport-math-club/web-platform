import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane, Bio } from '../Components'

export default class HomePage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(0)} />
				<OfficerPane header="Officers">
					<Bio
						name="Terrance Li"
						title="President"
						image="https://newport-math-club.nyc3.digitaloceanspaces.com/terrance.png"
						row={1}
						column={1}
					/>
					<Bio
						name="Terrance Li"
						title="President"
						image="https://newport-math-club.nyc3.digitaloceanspaces.com/terrance.png"
						row={2}
						column={1}
					/>
					<Bio
						name="Terrance Li"
						title="President"
						image="https://newport-math-club.nyc3.digitaloceanspaces.com/terrance.png"
						row={3}
						column={1}
					/>
					{/* TODO: put everyone here, get photos and such */}
				</OfficerPane>

				<div
					style={{ float: 'left', width: '66%', height: 'calc(100% - 12em)' }}
				/>
			</div>
		)
	}
}
