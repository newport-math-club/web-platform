import { fetchKPMTTeams, fetchKPMTCompetitors } from '../../nmc-api'

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
    let teamsByGrade = teams.reduce((a, t) => {
      a[t.grade - 5].concat([t])
    }, [[], [], [], []])

    // For each grade...
    teamsByGrade.forEach(gT => {
      // Sort by weighted score in decreasing order...
      gT.sort((a, b) => b.scores.weighted - a.scores.weighted)

      // Take the top 5...
      gT = gT.slice(0, 5)

      // And sanitize the obejtcs
      gT = gT.map(t => {
        t.school = t.school.name
        delete t.members 
      })
    })

    // PARSE COMPETITORS
    let competitors = await competitorResponse.json()

    let competitorsByGrade = competitors.reduce((a, c) => {
      return a[c.grade - 5].concat([c])
    }, [[], [], [], []])

    competitorsByGrade.forEach(gC => {
      gC.sort((a, b) => b.scores.weighted - a.scores.weighted)
      gC = gC.slice(0, 10)
      gC = gC.map(c => {
        c.school = c.school.name
        c.team = c.team ? c.team.number : null
      })
    })

    let final = {
      
 teams: teamsByGrade,
      competitors: competitorsByGrade   }
 

    // TODO: turn into CSV and PDF
   res(final)
  })
}
