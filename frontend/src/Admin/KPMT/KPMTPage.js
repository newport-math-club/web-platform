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
	fetchKPMTCompetitors,
	fetchKPMTSchools
} from '../../nmc-api'
import moment from 'moment'
import Modal from 'react-modal'
import imageString from './KPMTImage'
import { generateScoreReport } from './KPMTGenerate'
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
		const teamsResponse = await fetchKPMTTeams()
		const competitorsResponse = await fetchKPMTCompetitors()
		const schoolsResponse = await fetchKPMTSchools()

		if (
			teamsResponse.status !== 200 ||
			competitorsResponse.status !== 200 ||
			schoolsResponse.status !== 200
		) {
			window.location.href = '/login'
			return
		}

		let teams = await teamsResponse.json()
		let individuals = await competitorsResponse.json()
		let schools = await schoolsResponse.json()

		const roomNumbers = []

		// these two loops populate the first 2 floors in the north wings
		for (let i = 1101; i <= 1114; i++) {
			roomNumbers.push(i)
		}

		for (let i = 2101; i <= 2124; i++) {
			roomNumbers.push(i)
		}

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

		let freshIndividuals = JSON.parse(JSON.stringify(individuals))

		function compare(a, b) {
			return a < b ? -1 : a > b ? 1 : 0
		}

		// split teams and individuals by 5/6 and 7/8
		let teams56 = teams
			.filter(t => t.grade <= 6)
			.sort((t1, t2) => {
				return compare(t1.school.name, t2.school.name)
			})
		let teams78 = teams
			.filter(t => t.grade >= 7)
			.sort((t1, t2) => {
				return compare(t1.school.name, t2.school.name)
			})
		let individuals56 = individuals
			.filter(i => i.grade <= 6)
			.sort((i1, i2) => {
				return compare(i1.school.name, i2.school.name)
			})
		let individuals78 = individuals
			.filter(i => i.grade >= 7)
			.sort((i1, i2) => {
				return compare(i1.school.name, i2.school.name)
			})

		// delegate as many rooms as needed for each category, up to 20 indivs per room or 5 teams per room
		let individuals56NumRooms = Math.ceil(
			individuals56.length / maxPeoplePerRoom
		)
		let individuals78NumRooms = Math.ceil(
			individuals78.length / maxPeoplePerRoom
		)
		let teams56NumRooms = Math.ceil(teams56.length / maxTeamsPerRoom)
		let teams78NumRooms = Math.ceil(teams78.length / maxTeamsPerRoom)

		let rooms = roomNumbers.map(n => {
			return {
				room: n,
				type: null,
				category: null,
				constituents: []
			}
		})

		// 5/6 individual room
		let startingRoomIndex = 0
		let roomIndex = startingRoomIndex

		for (
			let i = startingRoomIndex;
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
			let i = startingRoomIndex;
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
			let i = startingRoomIndex;
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
			let i = startingRoomIndex;
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

		// trim the data
		rooms.forEach(room => {
			if (room.type === 'indiv') {
				room.constituents.forEach(indiv => {
					indiv.school = indiv.school.name
					delete indiv.scores
				})
			} else {
				room.constituents.forEach(team => {
					team.school = team.school.name
					delete team.scores
					delete team.members
				})
			}
		})

		rooms = rooms.filter(r => r.constituents.length > 0)

		let csvContent = ''

		rooms.forEach(function(room) {
			if (room.category) room.category = room.category.replace('/', '')

			let row = room.room + ',' + room.type + ',' + room.category + ','

			if (room.type === 'indiv') {
				for (let i = 0; i < 20; i++) {
					if (room.constituents.length > i) {
						row += room.constituents[i].name
					}
					row += ','
				}
			} else {
				for (let i = 0; i < 5; i++) {
					if (room.constituents.length > i) {
						row += room.constituents[i].number
					}
					row += ','
				}
			}

			row = row.substring(0, row.length - 1)

			csvContent += row + '\r\n'
		})

		fileDownload(csvContent, 'roomassignment-' + Date.now() + '.csv')

		// generate pdf for room signs
		let dd = {
			pageOrientation: 'landscape',
			content: [],
			styles: {
				header: {
					fontSize: 48,
					bold: true,
					alignment: 'center'
				},
				content: {
					fontSize: 18,
					margin: [100, 0, 100, 0],
					alignment: 'center'
				}
			}
		}

		const generateTeamPage = (rN, teams) => {
			let res = [
				{ image: imageString, width: 300, alignment: 'center' },
				{ text: '\n', fontSize: 8 },
				{ text: 'Room ' + rN, style: 'header' },
				{ text: '\n', fontSize: 16 },
				{
					table: {
						headerRows: 1,
						widths: ['auto', '*'],
						body: [
							[
								{ text: 'Team #', bold: true },
								{ text: 'School Name', bold: true }
							]
						]
					},
					style: 'content'
				},
				{ text: '\n', fontSize: 8, pageBreak: 'after' }
			]

			teams.forEach(t => {
				res[4].table.body.push([t.number.toString(), t.school])
			})
			return res
		}

		const generateIndivPage = (rN, i) => {
			let res = [
				{ image: imageString, width: 300, alignment: 'center' },
				{ text: '\n', fontSize: 8 },
				{ text: 'Room ' + rN, style: 'header' },
				{ text: '\n', fontSize: 16 },
				{ text: 'Individuals Room ' + i, style: 'header' },
				{ text: '\n', fontSize: 8, pageBreak: 'after' }
			]

			return res
		}

		rooms
			.filter(r => r.type === 'team')
			.forEach(r => {
				dd.content.push(generateTeamPage(r.room, r.constituents))
			})
		rooms
			.filter(r => r.type === 'indiv')
			.forEach((r, i) => {
				dd.content.push(generateIndivPage(r.room, i + 1))
			})

		pdfMake.createPdf(dd).download('room-signs.pdf')

		// generate pdfs for team assignments
		let freshTeamsResponse = await fetchKPMTTeams()
		let freshTeams = await freshTeamsResponse.json()
		dd = {
			pageOrientation: 'portrait',
			content: [],
			styles: {
				header: {
					fontSize: 24,
					bold: true,
					alignment: 'left'
				},
				subheader: {
					fontSize: 16,
					bold: true,
					alignment: 'left'
				},
				content: {
					fontSize: 14,
					alignment: 'left'
				}
			}
		}

		const generateSchoolAssignment = school => {
			let schoolRes = [
				{ text: school.name, style: 'header' },
				{ text: '\n', style: 'header' }
			]
			let teamIDs = school.teams.map(t => t._id.toString())

			teamIDs.forEach(tID => {
				let t = freshTeams.filter(t => t._id.toString() === tID)[0]

				let teamRoom = rooms.filter(r => {
					return (
						r.type === 'team' &&
						r.constituents.filter(c => c._id.toString() === tID).length > 0
					)
				})[0].room

				let res = [
					{
						text: 'Team ' + t.number + ' -> Room ' + teamRoom,
						style: 'subheader'
					}
				]

				t.members.forEach(m => {
					res.push({ text: m.name, style: 'content' })
				})

				res.push({ text: '\n' })
				schoolRes.push(res)
			})

			let individuals = freshIndividuals.filter(i => {
				return i.school._id.toString() === school._id.toString()
			})

			rooms
				.filter(r => r.type === 'indiv')
				.forEach((r, i) => {
					let res = [
						{
							text: 'Individuals Room ' + (i + 1) + ' -> Room ' + r.room,
							style: 'subheader'
						}
					]

					console.log(school.name, individuals, r)

					let indivsInRoom = individuals.filter(i => {
						return r.constituents
							.map(c => c._id.toString())
							.includes(i._id.toString())
					})

					if (indivsInRoom.length === 0) return

					indivsInRoom.forEach(i =>
						res.push({ text: i.name, style: 'content' })
					)

					res.push({ text: '\n' })
					schoolRes.push(res)
				})

			schoolRes.push({ text: '\n', pageBreak: 'after' })

			return schoolRes
		}

		schools.forEach(s => {
			dd.content.push(generateSchoolAssignment(s))
		})

		pdfMake.createPdf(dd).download('school-assignments.pdf')
	}

	generateScoreReport = async () => {
		let dd = await generateScoreReport()

		pdfMake.createPdf(dd).download('score-report.pdf')
		// const teamsResponse = await fetchKPMTTeams()
		// const competitorsResponse = await fetchKPMTCompetitors()
		// if (teamsResponse.status === 200 && competitorsResponse.status === 200) {
		// 	let teams = await teamsResponse.json()
		// 	let teams5 = teams
		// 		.filter(t => t.grade === 5)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	let teams6 = teams
		// 		.filter(t => t.grade === 6)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	let teams7 = teams
		// 		.filter(t => t.grade === 7)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	let teams8 = teams
		// 		.filter(t => t.grade === 8)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	teams5.forEach(t => {
		// 		t.school = t.school.name
		// 		delete t.members
		// 	})
		// 	teams6.forEach(t => {
		// 		t.school = t.school.name
		// 		delete t.members
		// 	})
		// 	teams7.forEach(t => {
		// 		t.school = t.school.name
		// 		delete t.members
		// 	})
		// 	teams8.forEach(t => {
		// 		t.school = t.school.name
		// 		delete t.members
		// 	})
		// 	let competitors = await competitorsResponse.json()
		// 	let competitors5 = competitors
		// 		.filter(c => c.grade === 5)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	let competitors6 = competitors
		// 		.filter(c => c.grade === 6)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	let competitors7 = competitors
		// 		.filter(c => c.grade === 7)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	let competitors8 = competitors
		// 		.filter(c => c.grade === 8)
		// 		.sort((a, b) => {
		// 			return b.scores.weighted - a.scores.weighted
		// 		})
		// 		.slice(0, 9)
		// 	competitors5.forEach(c => {
		// 		c.school = c.school.name
		// 		c.team = c.team ? c.team.number : null
		// 	})
		// 	competitors6.forEach(c => {
		// 		c.school = c.school.name
		// 		c.team = c.team ? c.team.number : null
		// 	})
		// 	competitors7.forEach(c => {
		// 		c.school = c.school.name
		// 		c.team = c.team ? c.team.number : null
		// 	})
		// 	competitors8.forEach(c => {
		// 		c.school = c.school.name
		// 		c.team = c.team ? c.team.number : null
		// 	})
		// 	const final = {
		// 		teams5: teams5,
		// 		teams6: teams6,
		// 		teams7: teams7,
		// 		teams8: teams8,
		// 		competitors5: competitors5,
		// 		competitors6: competitors6,
		// 		competitors7: competitors7,
		// 		competitors8: competitors8
		// 	}
		// 	fileDownload(JSON.stringify(final), 'scorereport-' + Date.now() + '.json')
		// }
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
							onClick={this.generateAssignments}
							name={'Generate All Assignments'}
						/>
						<p>Generates room in CSV format</p>
					</div>
					<div>
						<Link
							onClick={this.generateScoreReport}
							name={'Generate Score Report'}
						/>
						<p>Generates a score report in JSON format</p>
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
