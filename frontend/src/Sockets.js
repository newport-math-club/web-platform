import io from 'socket.io-client'
import { BASE_URL } from './nmc-api'

const socket = io(BASE_URL, { secure: true })

socket.on('connect', function() {
	console.log('socket connected')
})

const SocketEventHandlers = {
	subscribeToPiPointChange: cb => {
		socket.on('piPointChange', cb)
	},
	unsubscribeToPiPointChange: () => {
		socket.on('piPointChange', () => {})
	},
	// below are admin only
	subscribeToMembersChange: cb => {
		socket.on('membersChange', cb)
	},
	unsubscribeMembersChange: () => {
		socket.on('membersChange', () => {})
	},
	subscribeToMeetingsChange: cb => {
		socket.on('meetingsChange', cb)
	},
	unsubscribeMeetingsChange: () => {
		socket.on('meetingsChange', () => {})
	}
}

export default SocketEventHandlers
