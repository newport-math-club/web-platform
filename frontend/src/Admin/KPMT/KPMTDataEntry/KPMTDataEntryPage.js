import React, { Component } from 'react'
import { Nav, Link, getAdminNavItems } from '../../../Components'
import { fetchKPMTCompetitors } from '../../../nmc-api'

const individualLinksData = [
	{ href: '/admin/kpmt/entry/individual', name: 'Individual Test' },
	{ href: '/admin/kpmt/entry/block', name: 'Block Test' },
	{ href: '/admin/kpmt/entry/mental', name: 'Mental Math Test' }
]

const teamLinksData = [
	{ href: '/admin/kpmt/entry/algebra', name: 'Algebra Team Test' },
	{ href: '/admin/kpmt/entry/geometry', name: 'Geometry Team Test' },
	{ href: '/admin/kpmt/entry/pp', name: 'Probability & Potpourri Team Test' }
]

const individualLinks = individualLinksData.map(linkData => {
	return (
		<div>
			<Link href={linkData.href} name={linkData.name} />
		</div>
	)
})

const teamLinks = teamLinksData.map(linkData => {
	return (
		<div>
			<Link href={linkData.href} name={linkData.name} />
		</div>
	)
})

export default class KPMTDataEntryPage extends Component {
	async componentDidMount() {
		const response = await fetchKPMTCompetitors()

		if (response.status !== 200) {
			window.location.href = '/login'
			return
		}
	}

	render() {
		return (
			<div className="fullheight">
				<Nav admin={true} items={getAdminNavItems(2, 4)} />
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
					<h2>KPMT Data Entry Portal</h2>
					<h3>Individual Tests</h3>
					{individualLinks}
					<h3 style={{ marginTop: '1em' }}>Team Tests</h3>

					{teamLinks}
				</div>
			</div>
		)
	}
}
