// TODO: use the domain after migration to cloudflare
const BASE_URL = 'http://165.227.54.2:3000/api'

exports.login = (email, password) => {
	return fetch(BASE_URL + '/members/login', {
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
