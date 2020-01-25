import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Table,
	Textbox
} from '../../Components'
import Modal from 'react-modal'
import SocketEventHandlers from '../../Sockets'
import Autosuggest from 'react-autosuggest'
import {
	fetchKPMTVolunteers,
	addKPMTIndiv,
	deleteVolunteerKPMT,
	editVolunteerKPMT
} from '../../nmc-api'
import { NotificationContainer, NotificationManager } from 'react-notifications'

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

const renderSuggestion = suggestion => (
	<div style={{ display: 'inline', cursor: 'pointer' }}>{suggestion.name}</div>
)

export default class KPMTVolunteersPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			volunteerDialogIsOpen: false,
			newIndivDialogIsOpen: false,
			volunteers: [],
			schools: [],
			selectedSchool: null,
			schoolSuggestions: [],
			suggestionValue: '',
			selectedVolunteer: null
		}

		this.newGradeRef = React.createRef()
		this.newNameRef = React.createRef()
		this.editGradeRef = React.createRef()
		this.editNameRef = React.createRef()
		this.newCompeteGradeRef = React.createRef()
		this.editSchoolRef = React.createRef()
		this.editEmailRef = React.createRef()
		this.editRoleRef = React.createRef()
		this.editPartnerRef = React.createRef()
	}

	openNewIndivModal = () => {
		this.setState({ newIndivDialogIsOpen: true })
	}

	closeNewIndivModal = () => {
		this.setState({
			newIndivDialogIsOpen: false,
			selectedSchool: null,
			suggestionValue: '',
			error: undefined
		})
	}

	componentWillUnmount() {
		//SocketEventHandlers.unsubscribeVolunteersChange()
		//SocketEventHandlers.unsubscribeSchoolsChange()
	}

	async componentDidMount() {
		const volunteersResponse = await fetchKPMTVolunteers()

		if (volunteersResponse.status === 200) {
			const data = await volunteersResponse.json()
			console.log(data);
			this.setState({ volunteers: data })
		} else {
			window.location.href = '/login'
			return
		}

	}

	openVolunteerModal = volunteerId => {
		const selected = this.state.volunteers
			.slice()
			.filter(t => t._id.toString() === volunteerId.toString())[0]
		this.setState({
			volunteerDialogIsOpen: true,
			selectedVolunteer: selected
		})
	}

	closeVolunteerModal = () => {
		this.setState({
			volunteerDialogIsOpen: false,
			error: undefined
		})
	}
	

	deleteVol = async () => {
		const response = await deleteVolunteerKPMT(
			this.state.selectedVolunteer._id.toString()
		)
		console.log(response);
		if (response.status === 200) {
			this.closeVolunteerModal()
			window.location.href = '/admin/kpmt/volunteers'

		}
	}

	saveIndiv = async () => {
		const name = this.newNameRef.current.getText()
		const grade = this.newGradeRef.current.getText()
		const competeGrade = this.newCompeteGradeRef.current.getText()

		if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace() || isNaN(competeGrade) || competeGrade.isOnlyWhitespace()) {
			this.setState({ error: 1 })
			return
		}

		const response = await addKPMTIndiv(
			name,
			grade,
			competeGrade,
			this.state.selectedSchool._id.toString()
		)

		if (response.status === 200) {
			this.closeNewIndivModal()
		} else {
			this.setState({ error: response.status })
		}
	}

	saveEditIndiv = async () => {
		console.log("Saving")
		
		const name = this.editNameRef.current.getText()
		const grade = this.editGradeRef.current.getText().toString()
		const email = this.editEmailRef.current.getText()
		const school = this.editSchoolRef.current.getText()
		const role = this.editRoleRef.current.getText()
		const partner = this.editPartnerRef.current.getText()
		
		if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace() || isNaN(grade) || grade.isOnlyWhitespace() || grade > 12 || grade < 9 || (role.toLowerCase() !== "proctor" && role.toLowerCase() !== "grader" && role.toLowerCase() !== "runner")) {
			this.setState({ error: 1 })
			return
		}

		const response = await editVolunteerKPMT(
			this.state.selectedVolunteer._id.toString(),
			name,
			grade,
			school,
			email,
			role,
			partner
		)
		console.log("thello");
		console.log(response.status);

		if (response.status === 200) {
			this.closeVolunteerModal()
		} else {
			this.setState({ error: response.status })
		}
	}


	render() {
		const selectedVolunteer = this.state.selectedVolunteer || {
			school: {},
			team: {},
			scores: {}
		}

		const inputProps = {
			placeholder: 'select school',
			value: this.state.suggestionValue,
			onChange: this.onSuggestionInputChange,
			style: {
				width: '70%',
				display: 'inline-block'
			}
		}

		

		const memberTextboxes = (
			<div>
				<Textbox
					text={selectedVolunteer.name}
					style={{ display: 'inline', width: '14em' }}
					ref={this.editNameRef}
					placeholder="full name"
				/>
				<Textbox
					text={selectedVolunteer.grade}
					style={{ display: 'inline', width: '3em', marginLeft: '1em' }}
					ref={this.editGradeRef}
					placeholder="grade"
				/>
				
				<Textbox
				style={{ display: 'inline', width: '20em'}}
				text = {selectedVolunteer.school}
				ref={this.editSchoolRef}
				placeholder="school"/>
				<Textbox
				style={{ display: 'inline', width: '20em'}}
				text = {selectedVolunteer.email}
				ref={this.editEmailRef}
				placeholder="email"/>	
				<Textbox
				style={{ display: 'inline', width: '12em'}}
				text = {selectedVolunteer.preferredRole}
				ref={this.editRoleRef}
				placeholder="role"/>	
				<Textbox
				style={{ display: 'inline', width: '12em'}}
				text = {selectedVolunteer.partner}
				ref={this.editPartnerRef}
				placeholder="partner"/>	
				
			</div>
		)

		return (
			<div className="fullheight">
				
				<Modal
					isOpen={this.state.volunteerDialogIsOpen}
					style={customStyles}
					contentLabel="View Volunteer">
					<h2>View Volunteer</h2>
					<h3>Name: {selectedVolunteer.name}</h3>
					<h3>Grade: {selectedVolunteer.grade}</h3> 
					<h4>School: {selectedVolunteer.school}</h4>

					<div style={{ marginTop: '2em' }}>{memberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
					</div>

					
						<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
							<Button
								text="delete"
								style={{ background: '#eb5757' }}
								onClick = {this.deleteVol}
							/>
						</div>
					
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeVolunteerModal} text="close" />
							<Button onClick={this.saveEditIndiv} text="save _" />
						
					</div>
				</Modal>

				<Nav admin={true} items={getAdminNavItems(2, 3)} />
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
					<h2>KPMT Volunteers</h2>
					<h4>{this.state.volunteers.length} volunteer(s)</h4>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
					</div>
					<Table
						headers={['Name', 'Grade', 'School', 'Role', 'Email', 'Partner']}
						filter={this.state.filter}
						onItemClick={this.openVolunteerModal}
						data={this.state.volunteers.slice().map(volunteer => {
							return {
								_id: volunteer._id,
								fields: [
									volunteer.name,
									volunteer.grade,
									volunteer.school,
									volunteer.preferredRole,
									volunteer.email,
									volunteer.partner ? volunteer.partner : "N/A"
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
