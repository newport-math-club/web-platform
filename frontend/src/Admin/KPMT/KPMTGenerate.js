import {
	fetchKPMTTeams,
	fetchKPMTCompetitors,
	fetchKPMTSchools
} from '../../nmc-api'
import imageString from './KPMTImage'
import { max } from 'moment'

const generateScoreReport = () => {
	return new Promise(async (res, rej) => {
		const teamResponse = await fetchKPMTTeams()
		const competitorResponse = await fetchKPMTCompetitors()

		if (teamResponse.status !== 200 || competitorResponse.status !== 200) {
			rej('Cannot fetch data')
		}

		// PARSE TEAMS
		let teams = await teamResponse.json()

		// Separate teams by grade
		let teamsByGrade = [[], [], [], []]
		teams.forEach(t => {
			teamsByGrade[t.grade - 5].push(t)
		})

		// For each grade...
		teamsByGrade.forEach((_, i, arr) => {
			// Sort by weighted score in decreasing order...
			arr[i].sort((a, b) => b.scores.weighted - a.scores.weighted)

			// Take the top 5...
			arr[i] = arr[i].slice(0, 5)

			// And sanitize the obtest
			arr[i] = arr[i].map(t => {
				t.school = t.school.name
				return t
			})

			// reverse the teams
			arr[i].reverse()
		})

		// PARSE COMPETITORS
		let competitors = await competitorResponse.json()

		let competitorsByGrade = [[], [], [], []]

		competitors.forEach(c => {
			competitorsByGrade[c.grade - 5].push(c)
		})

		competitorsByGrade.forEach((_, i, arr) => {
			arr[i].sort((a, b) => b.scores.weighted - a.scores.weighted)
			arr[i] = arr[i].slice(0, 10)
			arr[i] = arr[i].map(c => {
				c.school = c.school.name
				c.team = c.team ? c.team.number : null
				return c
			})
			arr[i].reverse()
		})

		let final = {
			teams: teamsByGrade,
			competitors: competitorsByGrade
		}

		let dd = {
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

		dd.content.push({ text: 'Score Report: Teams', style: 'header' })
		dd.content.push({ text: '\n', style: 'header' })

		final.teams.forEach((gT, i) => {
			dd.content.push({ text: i + 5 + 'th Grade Teams', style: 'subheader' })
			gT.forEach((t, i) => {
				let members = t.members
					.reduce((a, c) => a + ', ' + c.name, '')
					.substring(2)
				dd.content.push({
					text:
						gT.length -
						i +
						':\t' +
						t.number +
						'\t' +
						members +
						'\t' +
						t.scores.weighted,
					style: 'content'
				})
			})
			dd.content.push({ text: '\n', style: 'content' })
		})

		dd.content.push({ text: '\n', pageBreak: 'after' })
		dd.content.push({ text: 'Score Report: Individuals', style: 'header' })
		dd.content.push({ text: '\n', style: 'header' })
		let left = []
		let right = []

		final.competitors.forEach((gC, i) => {
			let assignedColumn = i <= 6 ? left : right
			assignedColumn.push({
				text: i + 5 + 'th Grade Individuals',
				style: 'subheader'
			})
			gC.forEach((c, i) => {
				assignedColumn.push({
					text: gC.length - i + ':\t' + c.name + '\t' + c.scores.weighted,
					style: 'content'
				})
			})
			assignedColumn.push({ text: '\n', style: 'content' })
		})

		dd.content.push({ columns: [left, right] })

		res(dd)
	})
}

const generateAssignments = (maxPeoplePerRoom = 16, maxTeamsPerRoom = 4) => {
	console.log(maxPeoplePerRoom, maxTeamsPerRoom)
	return new Promise(async (res, rej) => {
		let assignments = {}
		const teamsResponse = await fetchKPMTTeams()
		const competitorsResponse = await fetchKPMTCompetitors()
		const schoolsResponse = await fetchKPMTSchools()

		if (
			teamsResponse.status !== 200 ||
			competitorsResponse.status !== 200 ||
			schoolsResponse.status !== 200
		) {
			rej('Cannot fetch data')
		}

		let teams = await teamsResponse.json()
		let individuals = await competitorsResponse.json()
		let schools = await schoolsResponse.json()

		// rooms are populated by order of distance from the library
		const roomNumbers = [
			2124,
			2123,
			2122,
			2121,
			2120,
			2119,
			2101,
			2102,
			2103,
			2104,
			2105,
			2118,
			2117,
			2116,
			1114,
			1113,
			1112,
			1101,
			1102,
			1111,
			1110,
			1109,
			1103,
			1104,
			1105,
			1108,
			1107,
			1106,
			2106,
			2107,
			2108,
			2115,
			2114,
			2113,
			2109,
			2110,
			2112,
			2111
		]

		// const maxPeoplePerRoom = 16
		// const maxTeamsPerRoom = 4

		teams.forEach(team => {
			team.members.forEach(m => {
				individuals = individuals.filter(
					i => i._id.toString() !== m._id.toString()
				)
			})
		})

		let freshIndividuals = JSON.parse(JSON.stringify(individuals))

		const compare = (a, b) => {
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
		// TODO: modify these if want to enforce a higher than necessary room count (for volunteer assignment ease)
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
					// delete team.members
				})
			}
		})

		rooms = rooms.filter(r => r.constituents.length > 0)

		let csvContent = ''

		rooms.forEach(function(room) {
			if (room.category) room.category = room.category.replace('/', '-')

			let type = room.type === 'indiv' ? 'Indiv' : 'Team'
			let row = room.room + ',' + type + ',' + room.category + ','

			if (room.type === 'indiv') {
				row += room.constituents.length + ',0,'
				for (let i = 0; i < 20; i++) {
					if (room.constituents.length > i) {
						row += room.constituents[i].name
					}
					row += ','
				}
			} else {
				row +=
					room.constituents.reduce((a, c) => a + c.members.length, 0) +
					',' +
					room.constituents.length +
					','
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

		assignments.roomAssignments = csvContent
		// fileDownload(csvContent, 'roomassignment-' + Date.now() + '.csv')

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

		assignments.roomSigns = dd
		// pdfMake.createPdf(dd).download('room-signs.pdf')

		// generate pdfs for team assignments
		let freshTeamsResponse = await fetchKPMTTeams()
		let freshTeams = await freshTeamsResponse.json()
		let dd2 = {
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
			dd2.content.push(generateSchoolAssignment(s))
		})

		assignments.schoolAssignments = dd2
		// pdfMake.createPdf(dd).download('school-assignments.pdf')

		res(assignments)
	})
}

const generateSalesReport = () => {
	return new Promise(async (res, rej) => {
		const schoolsResponse = await fetchKPMTSchools()

		if (schoolsResponse.status !== 200) {
			rej('Cannot fetch data')
		}

		let schools = await schoolsResponse.json()

		let dd = {
			content: [
				{ text: 'KPMT Sales Report', style: 'header' },
				{ text: '\n', style: 'header' },
				{
					layout: 'lightHorizontalLines', // optional
					table: {
						// headers are automatically repeated if the table spans over multiple pages
						// you can declare how many rows should be treated as headers
						headerRows: 1,
						widths: ['*', 'auto', 'auto', 'auto', 'auto'],

						body: [
							[
								{ bold: true, text: 'School' },
								{ bold: true, text: 'Teams' },
								{ bold: true, text: 'Individuals' },
								{ bold: true, text: 'Amt. Due' },
								{ bold: true, text: 'Amt. Paid' }
							]
							// ,[
							// 	'Somerset Elementary',
							// 	'Value 2',
							// 	'Value 3',
							// 	'Value 4',
							// 	'Value 5'
							// ]
						]
					}
				}
			],
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

		let rows = dd.content[2].table.body

		let totalTeams = 0
		let totalIndivs = 0
		let totalDue = 0
		let totalPaid = 0

		schools.forEach(s => {
			let numTeams = s.teams.length
			let numIndividuals =
				s.competitors.length - s.teams.reduce((a, c) => a + c.members.length, 0)

			let amountDue = numTeams * 40 + numIndividuals * 15
			let amountPaid = s.amountPaid

			rows.push([s.name, numTeams, numIndividuals, amountDue, amountPaid])

			totalTeams += numTeams
			totalIndivs += numIndividuals
			totalDue += amountDue
			totalPaid += amountPaid
		})

		rows.push([
			{ bold: true, text: 'TOTAL' },
			{ bold: true, text: totalTeams },
			{ bold: true, text: totalIndivs },
			{ bold: true, text: totalDue },
			{ bold: true, text: totalPaid }
		])

		res(dd)
	})
}

export { generateScoreReport, generateAssignments, generateSalesReport }
