import React, { Component } from 'react'
import {
	Nav,
	Textbox,
	Link,
	getAdminNavItems,
	Button,
	ToggleButton
} from '../../../Components'
import {
	exportData,
	getLockStatus,
	coachLock,
	regLock,
	wipeKPMT
} from '../../../nmc-api'
import moment from 'moment'
import Modal from 'react-modal'

const fileDownload = require('js-file-download')

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '30em',
		height: '24em',
		right: 'auto',
		bottom: 'auto',
		paddingLeft: '2em',
		paddingTop: '2em',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: '1px 2px 8px #c4c4c4',
		borderRadius: '32px',
		border: 'none'
	}
}

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
