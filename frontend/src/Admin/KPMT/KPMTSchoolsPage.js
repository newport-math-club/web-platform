import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Textbox,
	Table,
	ToggleButton
} from '../../Components'
import Modal from 'react-modal'
import SocketEventHandlers from '../../Sockets'
import {
	fetchKPMTSchools,
	deleteKPMTSchool,
	activateSchool,
	deactivateSchool
} from '../../nmc-api'
import moment from 'moment'

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
	}

	componentWillUnmount() {
		// TODO: handle kpmt school change socket unsub
	}

	async componentDidMount() {
		// TODO: handle kpmt school change socket sub

		const schoolsResponse = await fetchKPMTSchools()
		if (schoolsResponse.status == 200) {
			const data = await schoolsResponse.json()

			this.setState({ schools: data })
		}
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
		if (response.status == 200) {
			this.closeSchoolModal()
		}
	}

	handleSchoolActiveToggle = async () => {
		// handle school activate deactivate, use ref to set enabled/disabled by response code
		const active = !this.selectedSchoolActiveToggleButton.current.isEnabled()

		var response
		if (active)
			response = await activateSchool(this.state.selectedSchool._id.toString())
		else
			response = await deactivateSchool(
				this.state.selectedSchool._id.toString()
			)

		if (response.status == 200) {
			this.selectedSchoolActiveToggleButton.current.setEnabled(active)
		}
	}

	render() {
		const selectedSchool = this.state.selectedSchool || {
			teams: [],
			competitors: []
		}
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
							selectedSchool.teams.reduce(
								(a, b) => a.members.length + b.members.length,
								0
							)}
					</h3>
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
						<Button onClick={this.deleteSchool} text="delete" />
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
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
			</div>
		)
	}
}
