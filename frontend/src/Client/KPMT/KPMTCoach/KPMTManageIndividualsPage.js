import React, { Component } from 'react'
import Modal from 'react-modal'
import {
	fetchSchoolProfile,
	addIndiv,
	editIndiv,
	removeIndiv
} from '../../../nmc-api'
import {
	FilterBar,
	Button,
	Textbox,
	Table,
	getCoachNavItems,
	CoachNav
} from '../../../Components'

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

export default class KPMTManageIndividualsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			indivDialogIsOpen: false,
			newIndivDialogIsOpen: false,
			indivs: [],
			selectedIndiv: null
		}

		this.newGradeRef = React.createRef()
		this.newNameRef = React.createRef()
		this.editGradeRef = React.createRef()
		this.editNameRef = React.createRef()
		this.newCompeteGradeRef = React.createRef()
		this.editCompeteGradeRef = React.createRef()
	}

	openNewIndivModal = () => {
		this.setState({
			newIndivDialogIsOpen: true
		})
	}

	closeNewIndivModal = () => {
		this.setState({
			newIndivDialogIsOpen: false,
			error: undefined
		})
	}

	async componentDidMount() {
		const profileResponse = await fetchSchoolProfile()
		if (profileResponse.status === 200) {
			const data = await profileResponse.json()

			let competitors = data.competitors

			// get rid of all the competitors that are in teams
			data.teams.forEach(team => {
				team.members.forEach(teamMember => {
					competitors = competitors.filter(
						c => c._id.toString() !== teamMember._id.toString()
					)
				})
			})

			this.setState({ indivs: competitors })
		} else {
			window.location.href = '/kpmt/login'
		}
	}

	openIndivModal = indivId => {
		const selected = this.state.indivs
			.slice()
			.filter(i => i._id.toString() === indivId.toString())[0]
		this.setState({
			indivDialogIsOpen: true,
			selectedIndiv: selected
		})
	}

	closeIndivModal = () => {
		this.setState({
			indivDialogIsOpen: false,
			selectedIndiv: null,
			error: undefined
		})
	}

	saveIndiv = async () => {
		const name = this.newNameRef.current.getText()
		const grade = this.newGradeRef.current.getText()
		const competeGrade = this.newCompeteGradeRef.current.getText()

		if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace()) {
			this.setState({ error: 1 })
			return
		}

		const response = await addIndiv(name, grade, competeGrade)

		if (response.status === 200) {
			// too lazy to use sockets to insert the new team
			// just refresh the page lmao hacky but works
			window.location.href = '/kpmt/coach/individuals'
		} else {
			this.setState({ error: response.status })
		}
	}

	saveEditIndiv = async () => {
		const name = this.editNameRef.current.getText()
		const grade = this.editGradeRef.current.getText().toString()
		const competeGrade = this.editCompeteGradeRef.current.getText().toString()

		if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace()) {
			this.setState({ error: 1 })
			return
		}

		const response = await editIndiv(
			this.state.selectedIndiv._id.toString(),
			name,
			grade,
			competeGrade 
		)

		if (response.status === 200) {
			// too lazy to use sockets to insert the new team
			// just refresh the page lmao hacky but works
			window.location.href = '/kpmt/coach/individuals'
		} else {
			this.setState({ error: response.status })
		}
	}

	deleteIndiv = async () => {
		const response = await removeIndiv(this.state.selectedIndiv._id.toString())

		if (response.status === 200) {
			window.location.href = '/kpmt/coach/individuals'
		} else {
			this.setState({ error: response.status })
		}
	}

	render() {
		const selectedIndiv = this.state.selectedIndiv || {
			scores: {}
		}

		const memberTextboxes = (
			<div>
				<Textbox
					text={selectedIndiv.name}
					style={{ display: 'inline', width: '16em' }}
					ref={this.editNameRef}
					placeholder="full name"
				/>
				<Textbox
					text={selectedIndiv.grade}
					style={{ display: 'inline', width: '4em', marginLeft: '1em' }}
					ref={this.editGradeRef}
					placeholder="grade"
				/>
				<Textbox
					style={{ display: 'inline', width: '20em'}}
					ref={this.editCompeteGradeRef}
					text={selectedIndiv.competeGrade}
					placeholder="compete grade"
				/>
			</div>
		)

		const newMemberTextboxes = (
			<div>
				<Textbox
					style={{ display: 'inline', width: '16em' }}
					ref={this.newNameRef}
					placeholder="full name"
				/>
				<Textbox
					style={{ display: 'inline', width: '4em', marginLeft: '1em' }}
					ref={this.newGradeRef}
					placeholder="grade"
				/>
				<Textbox
					style={{ display: 'inline', width: '20em'}}
					ref={this.newCompeteGradeRef}
					placeholder="compete grade"
				/>
			</div>
		)

		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newIndivDialogIsOpen}
					style={customStyles}
					contentLabel="New Individual">
					<h2>New Individual</h2>
					<h5>
						Individuals are competitors without teams. You do not need to
						register team members here! Competitors with teams are registered in
						the <a href="/kpmt/coach/teams">teams page</a>.
					</h5>
					<h5 style = {{fontWeight: "300", marginTop: "10px"}}>
					The "compete grade" field is the grade you would like your students to actually participate in. For example, 5th graders wanting to take the 6th grade test.
					</h5>
					<div style={{ marginTop: '2em' }}>{newMemberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
						{this.state.error === 403 && (
							<h5 style={{ marginTop: '8px' }}>
								changes to teams and individuals are not allowed at this time!
							</h5>
						)}
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewIndivModal} text="close" />
						<Button onClick={this.saveIndiv} text="save" />
					</div>
				</Modal>
				<Modal
					isOpen={this.state.indivDialogIsOpen}
					style={customStyles}
					contentLabel="Edit Individual">
					<h2>Edit Individual</h2>
					<div style={{ marginTop: '2em' }}>{memberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error === 1 || this.state.error === 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
						{this.state.error === 403 && (
							<h5 style={{ marginTop: '8px' }}>
								changes to teams and individuals are not allowed at this time!
							</h5>
						)}
					</div>
					<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
						<Button
							onClick={this.deleteIndiv}
							text="delete"
							style={{ background: '#eb5757' }}
						/>
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeIndivModal} text="close" />
						<Button onClick={this.saveEditIndiv} text="save" />
					</div>
				</Modal>

				<CoachNav items={getCoachNavItems(2)} />
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
					<h2>Your Individuals</h2>
					<p>
						Individuals are student competitors that are NOT associated with a
						team. They will participate with the others in the individual tests,
						but they will not take the team tests.
					</p>
					<p>
						Please inform your student competitors that during the test, they
						must write their full name on the answer sheet{' '}
						<b>as it appears when inputted</b>! Failure to do so (e.g. the use
						of a nickname) may result in us not being able to score the test,
						resulting in the score being dropped.
					</p>
					<p>
						The "compete grade" field indicates which grade your student would actually like to participate in. Please make sure this is the correct grade, as it will decide what test they recieve!
					</p>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new individual" onClick={this.openNewIndivModal} />
					</div>
					<Table
						headers={['Grade', 'Compete Grade', 'Name', '']}
						filter={this.state.filter}
						onItemClick={this.openIndivModal}
						data={this.state.indivs.slice().map(indiv => {
							return {
								_id: indiv._id,
								fields: [indiv.grade, indiv.competeGrade, indiv.name, '']
							}
						})}
					/>
				</div>
			</div>
		)
	}
}
