// TODO: use the domain after migration to cloudflare

const BASE_URL = 'http://165.227.54.2:3000'

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
