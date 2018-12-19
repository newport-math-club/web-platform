import { fetchKPMTTeams, fetchKPMTCompetitors } from '../../nmc-api'
const pdfMake = require('pdfmake/build/pdfmake')
pdfMake.vfs = require('pdfmake/build/vfs_fonts').pdfMake.vfs

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
				delete t.members
				return t
			})
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
		})

		let final = {
			teams: teamsByGrade,
			competitors: competitorsByGrade
		}

		// TODO: turn into and PDF

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
				dd.content.push({
					text: i + 1 + ':\t' + t.number + '\t' + t.scores.weighted,
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
					text: i + 1 + ':\t' + c.name + '\t' + c.scores.weighted,
					style: 'content'
				})
			})
			assignedColumn.push({ text: '\n', style: 'content' })
		})

		dd.content.push({ columns: [left, right] })

		res(dd)
	})
}

export { generateScoreReport }
