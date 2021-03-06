import React, { Component } from 'react'
import {
	Nav,
	Textbox,
	Link,
	getAdminNavItems,
	Button,
	ToggleButton
} from '../../Components'
import {
	exportData,
	getLockStatus,
	coachLock,
	regLock,
	wipeKPMT
} from '../../nmc-api'
import moment from 'moment'
import Modal from 'react-modal'
import {
	generateScoreReport,
	generateScoreReportFull,
	generateAssignments,
	generateSalesReport
} from './KPMTGenerate'
const pdfMake = require('pdfmake/build/pdfmake')
pdfMake.vfs = require('pdfmake/build/vfs_fonts').pdfMake.vfs

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
export default class KPMTPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			wipeActivated: false,
			wipeText: '',
			locks: {}
		}

		this.coachLockToggleButton = React.createRef()
		this.regLockToggleButton = React.createRef()
		this.wipeButton = React.createRef()
		this.wipeInput = React.createRef()
		this.teamsPerRoomInput = React.createRef()
		this.indivsPerRoomInput = React.createRef()
	}

	exportData = async () => {
		const response = await exportData()

		if (response.status === 200) {
			const data = await response.json()

			fileDownload(JSON.stringify(data), 'export-' + Date.now() + '.json')
		} else {
			window.location.href = '/login'
			return
		}
	}

	openGenerateAssignments = () => {
		this.setState({ assignmentsDialogOpen: true })
	}

	closeGenerateAssignments = () => {
		this.setState({ assignmentsDialogOpen: false })
	}

	openModifyKPMTLock = () => {
		this.setState({ kpmtLockDialogOpen: true })
	}

	closeModifyKPMTLock = () => {
		this.setState({ kpmtLockDialogOpen: false })
	}

	openModifyKPMTRegLock = () => {
		this.setState({
			kpmtRegLockDialogOpen: true
		})
	}

	closeModifyKPMTRegLock = () => {
		this.setState({
			kpmtRegLockDialogOpen: false
		})
	}

	openKPMTWipe = () => {
		this.setState({ kpmtWipeDialogOpen: true })
	}

	closeKPMTWipe = () => {
		this.setState({ kpmtWipeDialogOpen: false, wipeActivated: false })
	}

	async componentDidMount() {
		const response = await getLockStatus()

		if (response.status === 200) {
			const data = await response.json()

			this.setState({ locks: data })
		}
	}

	handleWipeInputTextChange = text => {
		let activated = moment(new Date()).format('MM/DD/YYYY') === text
		this.setState({
			wipeText: text,
			wipeActivated: activated
		})
	}

	coachLockKPMT = async () => {
		const response = await coachLock(!this.state.locks.coachLock)

		if (response.status === 200) {
			let newLocks = { ...this.state.locks }
			newLocks.coachLock = !newLocks.coachLock
			this.setState({ locks: newLocks })
			this.coachLockToggleButton.current.setEnabled(newLocks.coachLock)
		}
	}

	regLockKPMT = async () => {
		const response = await regLock(!this.state.locks.regLock)

		if (response.status === 200) {
			let newLocks = { ...this.state.locks }
			newLocks.regLock = !newLocks.regLock
			this.setState({ locks: newLocks })
			this.regLockToggleButton.current.setEnabled(newLocks.regLock)
		}
	}

	wipeKPMT = async () => {
		if (!this.state.wipeActivated) return

		const response = await wipeKPMT()

		if (response.status === 200) {
			this.setState({ kpmtWipeDialogOpen: false })
		}
	}

	generateAssignments = async () => {
		let TPR = this.teamsPerRoomInput.current.getText()
		let IPR = this.indivsPerRoomInput.current.getText()

		let timestamp = moment().format('YYYY-MM-DD')

		let assignments
		if (!TPR || !IPR || isNaN(TPR) || isNaN(IPR) || TPR < 1 || IPR < 1)
			assignments = await generateAssignments()
		else {
			assignments = await generateAssignments(IPR, TPR)
		}

		fileDownload(
			assignments.roomAssignments,
			`room-assignments-${timestamp}.csv`
		)
		pdfMake
			.createPdf(assignments.roomSigns)
			.download(`room-signs-${timestamp}.pdf`)
		pdfMake
			.createPdf(assignments.schoolAssignments)
			.download(`school-assignments-${timestamp}.pdf`)
	}

	generateScoreReport = async () => {
		let timestamp = moment().format('YYYY-MM-DD')
		let dd = await generateScoreReport()

		pdfMake.createPdf(dd).download(`score-report-${timestamp}.pdf`)
	}
	generateScoreReportFull = async () => {
		let timestamp = moment().format('YYYY-MM-DD')
		let dd = await generateScoreReportFull()

		pdfMake.createPdf(dd).download(`score-full-report-${timestamp}.pdf`)
	}

	generateSalesReport = async () => {
		let timestamp = moment().format('YYYY-MM-DD')
		let dd = await generateSalesReport()

		pdfMake.createPdf(dd).download(`sales-report-${timestamp}.pdf`)
	}

	render() {
		let linksData = [
			{ href: '/admin/kpmt/schools', name: 'Schools' },
			{ href: '/admin/kpmt/teams', name: 'Teams' },
			{ href: '/admin/kpmt/competitors', name: 'Individuals' },
			{ href: '/admin/kpmt/entry', name: 'Data Entry' }
		]

		let links = linksData.map(linkData => {
			return (
				<div key={linkData.name}>
					<Link href={linkData.href} name={linkData.name} />
				</div>
			)
		})

		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.kpmtLockDialogOpen}
					style={customStyles}
					contentLabel="KPMT Coach Activity Lock">
					<h2 style={{ color: '#eb5757' }}>KPMT Coach Activity Lock</h2>
					<h5>
						This is a dangerous action. The KPMT Coach Activity Lock controls
						whether or not coaches can make changes to their teams and
						individuals competing. This should be kept open until the day of the
						competition, where it is closed to disallow further changes during
						the competition.
					</h5>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'start',
							alignContent: 'center',
							marginTop: '0.5em'
						}}>
						<h3 style={{ display: 'inline' }}>Lock</h3>
						<ToggleButton
							onClick={() => {
								this.coachLockKPMT()
								return false
							}}
							checked={this.state.locks.coachLock}
							ref={this.coachLockToggleButton}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeModifyKPMTLock} text="close" />
					</div>
				</Modal>
				<Modal
					isOpen={this.state.kpmtRegLockDialogOpen}
					style={customStyles}
					contentLabel="KPMT Registration Lock">
					<h2 style={{ color: '#eb5757' }}>KPMT Registration Lock</h2>
					<h5>
						This is a dangerous action. The KPMT Registration Lock controls
						whether or not new coaches/schools can register. This should be kept
						open until registration is officially closed, where it is closed to
						disallow further changes during the competition.
					</h5>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'start',
							alignContent: 'center',
							marginTop: '0.5em'
						}}>
						<h3 style={{ display: 'inline' }}>Lock</h3>
						<ToggleButton
							onClick={() => {
								this.regLockKPMT()
								return false
							}}
							checked={this.state.locks.regLock}
							ref={this.regLockToggleButton}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeModifyKPMTRegLock} text="close" />
					</div>
				</Modal>
				<Modal
					isOpen={this.state.kpmtWipeDialogOpen}
					style={customStyles}
					contentLabel="KPMT Wipe Data">
					<h2 style={{ color: '#eb5757' }}>KPMT Wipe Data</h2>
					<h5>
						This is a dangerous and destructive action. This wipes all KPMT data
						irreversibly. This should only be used after the competition, after
						awards have been handed out, and after an export has been performed.
					</h5>
					<h5>
						The wipe button is disabled until the current date is typed into the
						box in MM/DD/YYYY format.
					</h5>
					<div>
						<Textbox
							ref={this.wipeInput}
							placeholder="today's date"
							onTextChange={this.handleWipeInputTextChange}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeKPMTWipe} text="close" />
						<Button
							style={
								this.state.wipeActivated
									? { background: '#eb5757' }
									: { background: '#aaaaaa' }
							}
							onClick={this.wipeKPMT}
							text="wipe"
						/>
					</div>
				</Modal>
				<Modal
					isOpen={this.state.assignmentsDialogOpen}
					style={customStyles}
					contentLabel="Room Assignments">
					<h2 style={{ color: '#eb5757' }}>Room Assignments</h2>
					<h5>
						This generates room assignments and downloads 3 files: a CSV of the
						assignments, all room signs, and all school assignments for the
						registration table.
					</h5>
					<div>
						<Textbox
							ref={this.teamsPerRoomInput}
							placeholder="max teams/rm (4)"
						/>
					</div>
					<div>
						<Textbox
							ref={this.indivsPerRoomInput}
							placeholder="max indivs/rm (16)"
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeGenerateAssignments} text="close" />
						<Button onClick={this.generateAssignments} text="generate" />
					</div>
				</Modal>
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

					<div>
						<Link
							onClick={this.openGenerateAssignments}
							name={'Generate All Assignments'}
						/>
						<p>
							Generates room assignments, room signs, and school assignments
						</p>
					</div>
					<div>
						<Link
							onClick={this.generateScoreReport}
							name={'Generate Score Report'}
						/>
						<p>Generates a PDF for top score report</p>
					</div>
					<div>
						<Link
							onClick={this.generateScoreReportFull}
							name={'Generate Full Score Report'}
						/>
						<p>Generates a PDF for full score report</p>
					</div>
					<div>
						<Link
							onClick={this.generateSalesReport}
							name={'Generate Sales Report'}
						/>
						<p>Generates a PDF sales report</p>
					</div>
					<div>
						<Link onClick={this.exportData} name={'Export Data'} />
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
						<Link
							onClick={this.openModifyKPMTLock}
							danger={true}
							name={'Modify KPMT Lock'}
						/>
						<p>
							The lock controls whether or not coaches can add, remove, or make
							changes to their teams. Once the competition starts, the service
							must be locked to disallow further changes.
						</p>
					</div>
					<div>
						<Link
							onClick={this.openModifyKPMTRegLock}
							danger={true}
							name={'Modify KPMT Registration Lock'}
						/>
						<p>
							The lock controls whether or not new coaches can still register.
							Once registration closes, this needs to be locked to prevent late
							coaches from registering.
						</p>
					</div>
					<div>
						<Link
							onClick={this.openKPMTWipe}
							danger={true}
							name={'Wipe KPMT Database'}
						/>
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
