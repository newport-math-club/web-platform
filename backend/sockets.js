let io
const schemas = require('./schemas')

const Member = schemas.Member

module.exports = {
	init: (server, sessionMiddleware) => {
		io = require('socket.io')(server)

		io.use(function(socket, next) {
			var req = socket.handshake
			var res = {}
			sessionMiddleware(req, res, async function(err) {
				if (err) {
					console.error(err)
					let error = new Error('Internal Error')
					error.data = {
						type: 'internal_error'
					}
					return next(error)
				}

				var id = req.session._id

				if (!id || !req.session.authenticated) {
					let error = new Error('Authentication error')
					error.data = {
						type: 'authentication_error'
					}
					return next(error)
				}

				// be able to reference this member later on
				socket.join(id.toString())

				try {
					// if admin, join admin room
					const user = await Member.findOne({ _id: id }).exec()

					if (user && user.admin) {
						console.log('joined admin room')
						socket.join('admin')
					}
				} catch (err) {
					console.log(err)
					return next(err)
				}
				return next()
			})
		})
	},
	onPiPointChange: (memberId, piPointChange) => {
		io.to(memberId.toString()).emit('piPointChange', piPointChange)
	},
	onMembersChange: (type, payload) => {
		/**
		 * type: String; 'add', 'remove', or 'edit'
		 * payload: Object/String
		 *    if 'add': entire member object
		 *    if 'remove': member id to remove
		 *    if 'edit': {
		 *      _id: id,
		 *      data: [{
		 *        field: String, e.g. name or email
		 *        value: new value NOTE: pi point updates are always relative changes in pi points
		 *      },  ...]
		 *    }
		 */
		io.to('admin').emit('membersChange', {
			type: type,
			payload: payload
		})
	},
	onMeetingsChange: (type, payload) => {
		/**
		 * type: String; 'add', 'remove', or 'edit'
		 * payload: Object/String
		 *    if 'add': entire meeting object
		 *    if 'remove': meeting id to remove
		 *    if 'edit': {
		 *      _id: id,
		 *      data: [{
		 *        field: String, e.g. name or email
		 *        value: new value NOTE: pi point updates are always relative changes in pi points
		 *      },  ...]
		 *    }
		 */
		io.to('admin').emit('meetingsChange', { type: type, payload: payload })
	}
}
