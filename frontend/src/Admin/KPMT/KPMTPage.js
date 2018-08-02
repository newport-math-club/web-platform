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
				<Nav admin={false} items={getAdminNavItems(2, 0)} />
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
					</div>
					<div>
						<Link danger={true} name={'Wipe KPMT Database'} />
					</div>
				</div>
			</div>
		)
	}
}
