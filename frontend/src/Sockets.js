import io from 'socket.io-client'
import { BASE_URL } from './nmc-api'

const socket = io(BASE_URL, { secure: true })

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
	},
	subscribeToSchoolsChange: cb => {
		socket.on('schoolsChange', cb)
	},
	unsubscribeSchoolsChange: () => {
		socket.on('schoolsChange', () => {})
	},
	subscribeToTeamsChange: cb => {
		socket.on('teamsChange', cb)
	},
	unsubscribeTeamsChange: () => {
		socket.on('teamsChange', () => {})
	},
	subscribeToCompetitorsChange: cb => {
		socket.on('competitorsChange', cb)
	},
	unsubscribeCompetitorsChange: () => {
		socket.on('competitorsChange', () => {})
	}
}

export default SocketEventHandlers
