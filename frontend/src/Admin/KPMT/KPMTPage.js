import React, { Component } from 'react'
import { Nav, getNavItems, Link, getAdminNavItems } from '../../Components'

export default class KPMTPage extends Component {
	render() {
		var linksData = [
			{ href: '/admin/kpmt/schools', name: 'Schools' },
			{
				href: '/admin/kpmt/teams',
				name: 'Teams'
			},
			{
				href: '/admin/kpmt/competitors',
				name: 'Individuals'
			},
			{
				href: '/admin/kpmt/entry',
				name: 'Data Entry'
			}
		]

		var links = linksData.map(linkData => {
			return (
				<div>
					<Link href={linkData.href} name={linkData.name} />
				</div>
			)
		})

		return (
			<div className="fullheight">
				<Nav admin={true} items={getAdminNavItems(2, 0)} />
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
					<h2>KPMT Admin Portal</h2>
					<h3>View KPMT Data</h3>
					{links}
					<h3 style={{ marginTop: '1em' }}>KPMT Master Controls</h3>

					{/* TODO: handle master controls */}
					<div>
						<Link name={'Export Data'} />
						<p>
							After every KPMT, following scoring and awards, the database
							should be exported and purged. This copies and exports all the
							data. It is good to perform regular backups.{' '}
							<b>
								This action is non-destructive, but exported data should be kept
								confidential until the competition is finished.
							</b>
						</p>
					</div>
					<div>
						<Link danger={true} name={'Modify KPMT Lock'} />
						<p>
							The lock controls whether or not coaches can add, remove, or make
							changes to their teams. Once the competition starts, the service
							must be locked to disallow further changes.
						</p>
					</div>
					<div>
						<Link danger={true} name={'Modify KPMT Registration Lock'} />
						<p>
							The lock controls whether or not new coaches can still register.
							Once registration closes, this needs to be locked to prevent late
							coaches from registering.
						</p>
					</div>
					<div>
						<Link danger={true} name={'Wipe KPMT Database'} />
						<p>
							After every KPMT, following scoring and awards, the database
							should be exported and purged. This wipes the database! Don't
							touch this button if you don't know what you're doing!
						</p>
					</div>
				</div>
			</div>
		)
	}
}
