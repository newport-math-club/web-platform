const BASE_URL = 'https://api.newportmathclub.org'
//const BASE_URL = "http://localhost:3000"

exports.BASE_URL = BASE_URL

exports.login = (email, password) => {
	return fetch(BASE_URL + '/api/members/login', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: password
		}),
		credentials: 'include'
	})
}

exports.fetchProfile = () => {
	return fetch(BASE_URL + '/api/members/profile', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.logout = () => {
	return fetch(BASE_URL + '/api/members/logout', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	})
}

exports.newMember = (name, email, yearOfGraduation, admin) => {
	return fetch(BASE_URL + '/api/members/add', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			email: email,
			yearOfGraduation: yearOfGraduation,
			admin: admin
		}),
		credentials: 'include'
	})
}

exports.newMeeting = (piPoints, memberIds, description, date) => {
	return fetch(BASE_URL + '/api/meetings/add', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			piPoints: piPoints,
			memberIds: memberIds,
			description: description
		}),
		credentials: 'include'
	})
}

exports.editMeeting = (id, piPoints, memberIds, description, date) => {
	return fetch(BASE_URL + '/api/meetings/update', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			piPoints: piPoints,
			date: date,
			memberIds: memberIds,
			description: description
		}),
		credentials: 'include'
	})
}

exports.editMember = (id, name, email, yearOfGraduation, admin) => {
	return fetch(BASE_URL + '/api/members/update', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			name: name,
			email: email,
			yearOfGraduation: yearOfGraduation,
			admin: admin
		}),
		credentials: 'include'
	})
}

exports.deleteMember = id => {
	return fetch(BASE_URL + '/api/members/remove', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.deleteMeeting = id => {
	return fetch(BASE_URL + '/api/meetings/remove', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.fetchMembers = () => {
	return fetch(BASE_URL + '/api/members', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.fetchMeetings = () => {
	return fetch(BASE_URL + '/api/meetings', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.changePassword = (email, password, newPassword) => {
	return fetch(BASE_URL + '/api/members/change-password', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: password,
			newPassword: newPassword
		}),
		credentials: 'include'
	})
}

// KPMT ROUTES BELOW
exports.fetchKPMTSchools = () => {
	return fetch(BASE_URL + '/api/kpmt/schools', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.fetchKPMTTeams = () => {
	return fetch(BASE_URL + '/api/kpmt/teams', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.fetchKPMTCompetitors = () => {
	return fetch(BASE_URL + '/api/kpmt/competitors', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.deleteKPMTSchool = id => {
	return fetch(BASE_URL + '/api/kpmt/removeSchool', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.activateSchool = id => {
	return fetch(BASE_URL + '/api/kpmt/approveSchool', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.deactivateSchool = id => {
	return fetch(BASE_URL + '/api/kpmt/deactivateSchool', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.registerKPMT = (school, coachName, coachEmail, password) => {
	return fetch(BASE_URL + '/api/kpmt/register', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			school: school,
			coachName: coachName,
			email: coachEmail,
			password: password
		}),
		credentials: 'include'
	})
}

exports.registerVolunteerKPMT = (school, name, email, preferredRole, grade) => {
	return fetch(BASE_URL + '/api/kpmt/register/volunteer', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			school: school,
			name: name,
			email: email,
			preferredRole: preferredRole,
			grade: grade 
		}),
		credentials: 'include'
	})
}

exports.dropoutVolunteerKPMT = (code) => {
	return fetch(BASE_URL + "/api/kpmt/dropout/volunteer", {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			code: code
		}),
		credentials: "include"
	})
}

exports.loginKPMT = (email, password) => {
	return fetch(BASE_URL + '/api/kpmt/login', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: password
		}),
		credentials: 'include'
	})
}

exports.fetchSchoolProfile = () => {
	return fetch(BASE_URL + '/api/kpmt/profile', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.schoolChangePassword = (email, password, newPassword) => {
	return fetch(BASE_URL + '/api/kpmt/change-password', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password,
			newPassword
		}),
		credentials: 'include'
	})
}

exports.addTeam = members => {
	return fetch(BASE_URL + '/api/kpmt/team/add', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			team: members
		}),
		credentials: 'include'
	})
}

exports.editTeam = (id, members) => {
	return fetch(BASE_URL + '/api/kpmt/team/edit', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			members: members
		}),
		credentials: 'include'
	})
}

exports.addIndiv = (name, grade) => {
	return fetch(BASE_URL + '/api/kpmt/indiv/add', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			grade: grade
		}),
		credentials: 'include'
	})
}

exports.editIndiv = (id, name, grade) => {
	return fetch(BASE_URL + '/api/kpmt/indiv/edit', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			name: name,
			grade: grade
		}),
		credentials: 'include'
	})
}

exports.removeIndiv = id => {
	return fetch(BASE_URL + '/api/kpmt/indiv/remove', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.removeTeam = id => {
	return fetch(BASE_URL + '/api/kpmt/team/remove', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		}),
		credentials: 'include'
	})
}

exports.getLockStatus = () => {
	return fetch(BASE_URL + '/api/kpmt/getLocks', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.exportData = () => {
	return fetch(BASE_URL + '/api/kpmt/export', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		credentials: 'include'
	})
}

exports.coachLock = lock => {
	return fetch(BASE_URL + '/api/kpmt/lock', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			lock: lock
		}),
		credentials: 'include'
	})
}

exports.regLock = lock => {
	return fetch(BASE_URL + '/api/kpmt/reglock', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			lock: lock
		}),
		credentials: 'include'
	})
}

exports.wipeKPMT = () => {
	return fetch(BASE_URL + '/api/kpmt/clear', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({}),
		credentials: 'include'
	})
}

exports.scoreIndiv = (id, score, last) => {
	return fetch(BASE_URL + '/api/kpmt/score/indiv', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id,
			score,
			last
		}),
		credentials: 'include'
	})
}

exports.scoreBlock = (id, score) => {
	return fetch(BASE_URL + '/api/kpmt/score/block', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id,
			score
		}),
		credentials: 'include'
	})
}

exports.scoreMental = (id, score) => {
	return fetch(BASE_URL + '/api/kpmt/score/mental', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id,
			score
		}),
		credentials: 'include'
	})
}

exports.scoreTeam = (id, score, type) => {
	return fetch(BASE_URL + '/api/kpmt/score/team', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id,
			score,
			type
		}),
		credentials: 'include'
	})
}
