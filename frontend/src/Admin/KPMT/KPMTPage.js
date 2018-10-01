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
	wipeKPMT,
	fetchKPMTTeams,
	fetchKPMTCompetitors
} from '../../nmc-api'
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
		this.setState({ kpmtWipeDialogOpen: false })
	}

	async componentDidMount() {
		const response = await getLockStatus()

		if (response.status === 200) {
			const data = await response.json()

			this.setState({ locks: data })
		}
	}

	handleWipeInputTextChange = text => {
		var activated = moment(new Date()).format('MM/DD/YYYY') === text
		this.setState({
			wipeText: text,
			wipeActivated: activated
		})
	}

	coachLockKPMT = async () => {
		const response = await coachLock(!this.state.locks.coachLock)

		if (response.status === 200) {
			var newLocks = { ...this.state.locks }
			newLocks.coachLock = !newLocks.coachLock
			this.setState({ locks: newLocks })
			this.coachLockToggleButton.current.setEnabled(newLocks.coachLock)
		}
	}

	regLockKPMT = async () => {
		const response = await regLock(!this.state.locks.regLock)

		if (response.status === 200) {
			var newLocks = { ...this.state.locks }
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

	generateRoomAssignments = async () => {
		const teamsResponse = await fetchKPMTTeams()
		const competitorsResponse = await fetchKPMTCompetitors()

		if (teamsResponse.status !== 200 || competitorsResponse.status !== 200) {
			window.location.href = '/login'
			return
		}

		const teams = await teamsResponse.json()
		var individuals = await competitorsResponse.json()

		// TODO: populate this with actual newport room numbers, in order of filling priority
		const roomNumbers = [
			1101,
			1102,
			1103,
			1104,
			1105,
			1106,
			1107,
			1108,
			2101,
			2102,
			2103,
			2104,
			2105,
			2106,
			2107,
			2108,
			2109,
			2110,
			2111,
			2112,
			2113,
			2114,
			2115,
			2116,
			2117,
			2118,
			2119
		]

		const maxPeoplePerRoom = 20
		const maxTeamsPerRoom = 5

		// find the individuals by filtering team competitors out of all competitors
		teams.forEach(team => {
			team.members.forEach(m => {
				individuals = individuals.filter(
					i => i._id.toString() !== m._id.toString()
				)
			})
		})

		function compare(a, b) {
			return a < b ? -1 : a > b ? 1 : 0
		}

		// split teams and individuals by 5/6 and 7/8
		var teams56 = teams.filter(t => t.grade <= 6).sort((t1, t2) => {
			return compare(t1.school.name, t2.school.name)
		})
		var teams78 = teams.filter(t => t.grade >= 7).sort((t1, t2) => {
			return compare(t1.school.name, t2.school.name)
		})
		var individuals56 = individuals.filter(i => i.grade <= 6).sort((i1, i2) => {
			return compare(i1.school.name, i2.school.name)
		})
		var individuals78 = individuals.filter(i => i.grade >= 7).sort((i1, i2) => {
			return compare(i1.school.name, i2.school.name)
		})

		// delegate as many rooms as needed for each category, up to 20 indivs per room or 5 teams per room
		var individuals56NumRooms = Math.ceil(
			individuals56.length / maxPeoplePerRoom
		)
		var individuals78NumRooms = Math.ceil(
			individuals78.length / maxPeoplePerRoom
		)
		var teams56NumRooms = Math.ceil(teams56.length / maxTeamsPerRoom)
		var teams78NumRooms = Math.ceil(teams78.length / maxTeamsPerRoom)

		var rooms = roomNumbers.map(n => {
			return {
				room: n,
				type: null,
				category: null,
				constituents: []
			}
		})

		// 5/6 individual room
		var startingRoomIndex = 0
		var roomIndex = startingRoomIndex

		for (
			var i = startingRoomIndex;
			i < startingRoomIndex + individuals56NumRooms;
			i++
		) {
			rooms[i].type = 'indiv'
			rooms[i].category = '5/6'
		}

		while (individuals56.length > 0) {
			rooms[roomIndex].constituents.push(individuals56.splice(0, 1)[0])

			// switch to next room or go back to first room allocated
			roomIndex++
			if (roomIndex - startingRoomIndex >= individuals56NumRooms)
				roomIndex = startingRoomIndex
		}

		// 7/8 individual room
		startingRoomIndex += individuals56NumRooms
		roomIndex = startingRoomIndex

		for (
			var i = startingRoomIndex;
			i < startingRoomIndex + individuals78NumRooms;
			i++
		) {
			rooms[i].type = 'indiv'
			rooms[i].category = '7/8'
		}

		while (individuals78.length > 0) {
			rooms[roomIndex].constituents.push(individuals78.splice(0, 1)[0])

			// switch to next room or go back to first room allocated
			roomIndex++
			if (roomIndex - startingRoomIndex >= individuals78NumRooms)
				roomIndex = startingRoomIndex
		}

		// 5/6 team  rooms
		startingRoomIndex += individuals78NumRooms
		roomIndex = startingRoomIndex

		for (
			var i = startingRoomIndex;
			i < startingRoomIndex + teams56NumRooms;
			i++
		) {
			rooms[i].type = 'team'
			rooms[i].category = '5/6'
		}

		while (teams56.length > 0) {
			rooms[roomIndex].constituents.push(teams56.splice(0, 1)[0])

			// switch to next room or go back to first room allocated
			roomIndex++
			if (roomIndex - startingRoomIndex >= teams56NumRooms)
				roomIndex = startingRoomIndex
		}

		// 7/8 team  rooms
		startingRoomIndex += teams56NumRooms
		roomIndex = startingRoomIndex

		for (
			var i = startingRoomIndex;
			i < startingRoomIndex + teams78NumRooms;
			i++
		) {
			rooms[i].type = 'team'
			rooms[i].category = '7/8'
		}

		while (teams78.length > 0) {
			rooms[roomIndex].constituents.push(teams78.splice(0, 1)[0])

			// switch to next room or go back to first room allocated
			roomIndex++
			if (roomIndex - startingRoomIndex >= teams78NumRooms)
				roomIndex = startingRoomIndex
		}

		// TODO: then download a csv/json file as done below w/ the export kek

		console.log(rooms)
	}

	render() {
		var linksData = [
			{ href: '/admin/kpmt/schools', name: 'Schools' },
			{ href: '/admin/kpmt/teams', name: 'Teams' },
			{ href: '/admin/kpmt/competitors', name: 'Individuals' },
			{ href: '/admin/kpmt/entry', name: 'Data Entry' }
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
							onClick={this.generateRoomAssignments}
							name={'Generate Room Assignments'}
						/>
						<p>Generates room in CSV format</p>
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
