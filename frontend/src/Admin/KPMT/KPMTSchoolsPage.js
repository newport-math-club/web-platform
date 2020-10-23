import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Table,
	ToggleButton,
	Textbox
} from '../../Components'
import Modal from 'react-modal'
import SocketEventHandlers from '../../Sockets'
import {
	fetchKPMTSchools,
	deleteKPMTSchool,
	activateSchool,
	deactivateSchool,
	kpmtSetAmountPaid
} from '../../nmc-api'

import { generateSchoolScoreReport } from './KPMTGenerate'
import moment from 'moment'
import { NotificationContainer, NotificationManager } from 'react-notifications'
const pdfMake = require('pdfmake/build/pdfmake')
pdfMake.vfs = require('pdfmake/build/vfs_fonts').pdfMake.vfs

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '40em',
		height: '40em',
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

export default class KPMTSchoolsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			schoolDialogIsOpen: false,
			schools: [],
			selectedSchool: null
		}

		this.selectedSchoolActiveToggleButton = React.createRef()
		this.amountPaidTextbox = React.createRef()
	}

	componentWillUnmount() {
		SocketEventHandlers.unsubscribeSchoolsChange()
	}

	async componentDidMount() {
		const schoolsResponse = await fetchKPMTSchools()
		if (schoolsResponse.status === 200) {
			const data = await schoolsResponse.json()

			this.setState({ schools: data })
		} else {
			window.location.href = '/login'
			return
		}

		SocketEventHandlers.subscribeToSchoolsChange(data => {
			switch (data.type) {
				case 'add':
					this.setState({
						schools: this.state.schools.slice().concat(data.payload)
					})
					break
				case 'remove':
					this.setState({
						schools: this.state.schools
							.slice()
							.filter(s => s._id.toString() !== data.payload.toString())
					})

					if (
						this.state.selectedSchool &&
						this.state.selectedSchool._id.toString() === data.payload.toString()
					) {
						NotificationManager.error(
							'Your selected school has been deleted',
							'School removed'
						)

						this.setState({
							selectedSchool: null,
							schoolDialogIsOpen: false
						})
					}
					break
				case 'edit':
					let newSchools = this.state.schools.slice()

					for (let i = 0; i < newSchools.length; i++) {
						if (newSchools[i]._id.toString() === data.payload._id.toString()) {
							data.payload.data.forEach(change => {
								newSchools[i][change.field] = change.value
							})

							if (
								this.state.selectedSchool &&
								newSchools[i]._id.toString() ===
									this.state.selectedSchool._id.toString()
							) {
								let newSelectedSchool = {
									...this.state.selectedSchool
								}
								data.payload.data.forEach(change => {
									newSelectedSchool[change.field] = change.value
								})

								this.setState({
									selectedSchool: newSelectedSchool
								})
							}
							break
						}
					}
					this.setState({
						schools: newSchools
					})
					break
				default:
			}
		})
	}

	generateSchoolScoreReport = async () => {
		let dd = await generateSchoolScoreReport(this.state.selectedSchool)
		pdfMake
			.createPdf(dd)
			.download(
				`score-report-${Date.now()}-${this.state.selectedSchool.name
					.toLowerCase()
					.replaceAll(' ', '-')}.pdf`
			)
	}

	openSchoolModal = schoolId => {
		const selected = this.state.schools
			.slice()
			.filter(s => s._id.toString() === schoolId.toString())[0]
		this.setState({
			schoolDialogIsOpen: true,
			selectedSchool: selected
		})
	}

	closeSchoolModal = () => {
		this.setState({
			schoolDialogIsOpen: false,
			selectedSchool: null
		})
	}

	deleteSchool = async () => {
		const response = await deleteKPMTSchool(
			this.state.selectedSchool._id.toString()
		)
		if (response.status === 200) {
			this.closeSchoolModal()
		}
	}

	setSchoolAmtPaid = async () => {
		await kpmtSetAmountPaid(
			this.state.selectedSchool._id.toString(),
			this.amountPaidTextbox.current.getText().toString()
		)
	}

	handleSchoolActiveToggle = async () => {
		// handle school activate deactivate, use ref to set enabled/disabled by response code
		const active = !this.selectedSchoolActiveToggleButton.current.isEnabled()

		let response
		if (active)
			response = await activateSchool(this.state.selectedSchool._id.toString())
		else
			response = await deactivateSchool(
				this.state.selectedSchool._id.toString()
			)

		if (response.status === 200) {
			this.selectedSchoolActiveToggleButton.current.setEnabled(active)
		}
	}

	render() {
		const selectedSchool = this.state.selectedSchool || {
			teams: [],
			competitors: []
		}

		const amtRemaining =
			selectedSchool.teams.length * 15 +
			5 *
				(selectedSchool.competitors.length -
					selectedSchool.teams.reduce((a, b) => a + b.members.length, 0)) -
			selectedSchool.amountPaid

		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.schoolDialogIsOpen}
					style={customStyles}
					contentLabel="Manage School">
					<h2>Manage School</h2>
					<h3>School: {selectedSchool.name}</h3>
					<h3>Coach: {selectedSchool.coachName}</h3>
					<h3>Coach Email: {selectedSchool.coachEmail}</h3>
					<h3>
						Registered:{' '}
						{moment(selectedSchool.registrationDate).format('MM/DD/YYYY')}
					</h3>
					<h3>Teams: {selectedSchool.teams.length}</h3>
					<h3>
						Teamless Individuals:{' '}
						{selectedSchool.competitors.length -
							selectedSchool.teams.reduce((a, b) => a + b.members.length, 0)}
					</h3>
					<h3>
						Amount Due/Amount Paid:
						{' $'}
						{selectedSchool.teams.length * 15 +
							5 *
								(selectedSchool.competitors.length -
									selectedSchool.teams.reduce(
										(a, b) => a + b.members.length,
										0
									))}
						{'/$'}
						{selectedSchool.amountPaid}
					</h3>
					<h3 style={{ color: amtRemaining > 0 ? '#eb5757' : '#12eb9d' }}>
						Amount Remaining:
						{' $'}
						{amtRemaining}
					</h3>
					<div>
						<Textbox
							ref={this.amountPaidTextbox}
							style={{ display: 'inline-block' }}
							placeholder="set amount paid"
							type="number"
						/>
						<Button onClick={this.setSchoolAmtPaid} text="set amt. paid" />
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'start',
							alignContent: 'center',
							marginTop: '0.5em'
						}}>
						<h3 style={{ display: 'inline' }}>Active?</h3>
						<ToggleButton
							onClick={() => {
								this.handleSchoolActiveToggle()
								return false
							}}
							checked={selectedSchool.active}
							ref={this.selectedSchoolActiveToggleButton}
						/>
					</div>

					<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
						<Button
							onClick={this.deleteSchool}
							text="delete"
							style={{ background: '#eb5757' }}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button
							onClick={this.generateSchoolScoreReport}
							text="score report"
						/>
						<Button onClick={this.closeSchoolModal} text="close" />
					</div>
				</Modal>

				<Nav admin={true} items={getAdminNavItems(2, 1)} />
				<div
					style={{
						float: 'left',
						marginLeft: '10%',
						width: 'calc(80% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>KPMT Schools</h2>
					<h4>{this.state.schools.length} school(s)</h4>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
					</div>
					<Table
						headers={['Date', 'School Name', 'Coach', 'Email', 'Active']}
						filter={this.state.filter}
						onItemClick={this.openSchoolModal}
						data={this.state.schools.slice().map(school => {
							return {
								_id: school._id,
								fields: [
									moment(school.registrationDate).format('MM/DD/YYYY'),
									school.name,
									school.coachName,
									school.coachEmail,
									school.active ? 'active' : 'inactive'
								]
							}
						})}
					/>
				</div>
				<NotificationContainer />
			</div>
		)
	}
}
