import React, { Component } from 'react'
import Modal from 'react-modal'
import {
	fetchSchoolProfile,
	addTeam,
	editTeam,
	removeTeam
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

export default class KPMTManageTeamsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			teamDialogIsOpen: false,
			newTeamDialogIsOpen: false,
			teams: [],
			selectedTeam: null
		}

		this.newGradeRefs = []
		this.newNameRefs = []
		this.editGradeRefs = []
		this.editNameRefs = []
		;[0, 1, 2, 3].forEach(() => {
			this.newGradeRefs.push(React.createRef())
			this.newNameRefs.push(React.createRef())
			this.editGradeRefs.push(React.createRef())
			this.editNameRefs.push(React.createRef())
		})
	}

	openNewTeamModal = () => {
		this.setState({ newTeamDialogIsOpen: true })
	}

	closeNewTeamModal = () => {
		this.setState({ newTeamDialogIsOpen: false })
	}

	async componentDidMount() {
		const profileResponse = await fetchSchoolProfile()
		if (profileResponse.status == 200) {
			const data = await profileResponse.json()

			this.setState({ teams: data.teams })
		}
	}

	openTeamModal = teamId => {
		const selected = this.state.teams
			.slice()
			.filter(t => t._id.toString() === teamId.toString())[0]
		this.setState({
			teamDialogIsOpen: true,
			selectedTeam: selected
		})
	}

	closeTeamModal = () => {
		this.setState({
			teamDialogIsOpen: false,
			selectedTeam: null
		})
	}

	saveTeam = async () => {
		var team = []
		;[0, 1, 2, 3].forEach(index => {
			const name = this.newNameRefs[index].current.getText()
			const grade = this.newGradeRefs[index].current.getText()

			if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace())
				return

			team.push({
				name: name,
				grade: parseInt(grade)
			})
		})

		if (team.length < 3) {
			this.setState({ error: 1 })
			return
		}

		const response = await addTeam(team)

		if (response.status == 200) {
			// too lazy to use sockets to insert the new team
			// just refresh the page lmao hacky but works
			window.location.href = '/kpmt/coach/teams'
		} else {
			this.setState({ error: response.status })
		}
	}

	saveEditTeam = async () => {
		var team = []
		;[0, 1, 2, 3].forEach(index => {
			const name = this.editNameRefs[index].current.getText()
			const grade = this.editGradeRefs[index].current.getText().toString()

			if (isNaN(grade) || grade.isOnlyWhitespace() || name.isOnlyWhitespace())
				return

			team.push({
				name: name,
				grade: parseInt(grade)
			})
		})

		console.log(team)
		if (team.length < 3) {
			this.setState({ error: 1 })
			return
		}

		const response = await editTeam(
			this.state.selectedTeam._id.toString(),
			team
		)

		console.log(response)
		if (response.status == 200) {
			// too lazy to use sockets to insert the new team
			// just refresh the page lmao hacky but works
			window.location.href = '/kpmt/coach/teams'
		} else {
			this.setState({ error: response.status })
		}
	}

	deleteTeam = async () => {
		const response = await removeTeam(this.state.selectedTeam._id.toString())
		console.log(response)
		if (response.status == 200) {
			window.location.href = '/kpmt/coach/teams'
		} else {
			this.setState({ error: response.status })
		}
	}

	render() {
		const selectedTeam = this.state.selectedTeam || { members: [], scores: {} }

		const memberTextboxes = [0, 1, 2, 3].map(index => {
			if (selectedTeam.members.length > index) {
				const member = selectedTeam.members[index]
				return (
					<div>
						<Textbox
							ref={this.editNameRefs[index]}
							style={{
								display: 'inline',
								width: '16em'
							}}
							text={member.name}
							placeholder="name"
						/>
						<Textbox
							style={{
								display: 'inline',
								width: '4em',
								marginLeft: '1em'
							}}
							ref={this.editGradeRefs[index]}
							text={member.grade}
							placeholder="grade"
						/>
					</div>
				)
			}
			return (
				<div>
					<Textbox
						style={{
							display: 'inline',
							width: '16em'
						}}
						ref={this.editNameRefs[index]}
						placeholder="full name"
					/>
					<Textbox
						style={{
							display: 'inline',
							width: '4em',
							marginLeft: '1em'
						}}
						ref={this.editGradeRefs[index]}
						placeholder="grade"
					/>
				</div>
			)
		})

		const newMemberTextboxes = [0, 1, 2, 3].map(index => {
			return (
				<div>
					<Textbox
						style={{
							display: 'inline',
							width: '16em'
						}}
						ref={this.newNameRefs[index]}
						placeholder="full name"
					/>
					<Textbox
						style={{
							display: 'inline',
							width: '4em',
							marginLeft: '1em'
						}}
						ref={this.newGradeRefs[index]}
						placeholder="grade"
					/>
				</div>
			)
		})

		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.newTeamDialogIsOpen}
					style={customStyles}
					contentLabel="New Team">
					<h2>New Team</h2>
					<h5>
						Every team must have 3-4 members; leave the last line completely
						blank to have 3 members
					</h5>
					<div style={{ marginTop: '2em' }}>{newMemberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error == 1 || this.state.error == 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
						{this.state.error == 403 && (
							<h5 style={{ marginTop: '8px' }}>
								changes to teams and individuals are not allowed at this time!
							</h5>
						)}
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeNewTeamModal} text="close" />
						<Button onClick={this.saveTeam} text="save" />
					</div>
				</Modal>
				<Modal
					isOpen={this.state.teamDialogIsOpen}
					style={customStyles}
					contentLabel="Edit Team">
					<h2>Edit Team</h2>
					<h3>Team #: {selectedTeam.number}</h3>
					<h5>
						Every team must have 3-4 members; leave the last line completely
						blank to have 3 members
					</h5>
					<div style={{ marginTop: '2em' }}>{memberTextboxes}</div>
					<div style={{ textAlign: 'center' }}>
						{(this.state.error == 1 || this.state.error == 400) && (
							<h5 style={{ marginTop: '8px' }}>
								invalid inputs, please try again
							</h5>
						)}
						{this.state.error == 403 && (
							<h5 style={{ marginTop: '8px' }}>
								changes to teams and individuals are not allowed at this time!
							</h5>
						)}
					</div>
					<div style={{ bottom: '1em', left: '1em', position: 'absolute' }}>
						<Button onClick={this.deleteTeam} text="delete" />
					</div>
					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeTeamModal} text="close" />
						<Button onClick={this.saveEditTeam} text="save" />
					</div>
				</Modal>

				<CoachNav items={getCoachNavItems(1)} />
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
					<h2>Your Teams</h2>
					<p>
						Please be aware that although team numbers are automatically
						assigned, they may be subject to change at any time before the day
						of the test!
					</p>
					<p>
						Please inform your student competitors that during the test, they
						must write their full name on the answer sheet{' '}
						<b>as it appears when inputted</b>! Failure to do so (e.g. the use
						of a nickname) may result in us not being able to score the test,
						resulting in the score being dropped.
					</p>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
						<Button text="new team" onClick={this.openNewTeamModal} />
					</div>
					<Table
						headers={['Number', 'Members', '']}
						filter={this.state.filter}
						onItemClick={this.openTeamModal}
						data={this.state.teams.slice().map(team => {
							return {
								_id: team._id,
								fields: [
									team.number,
									team.members
										.map(m => m.name)
										.reduce((a, b) => a + ', ' + b, '')
										.substring(2),
									''
								]
							}
						})}
					/>
				</div>
			</div>
		)
	}
}
