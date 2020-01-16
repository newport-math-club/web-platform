import React, { Component } from 'react'
import { fetchProfile, fetchSchoolProfile } from './nmc-api'

/**
 * Gets the nav items array complete with highlight injection
 * Default array is as follows
 * [
 *    about,
 *    events,
 *    [resources, articles, practice, links],
 *    [kpmt, about, registration, past tests & results, contact],
 *    login
 * ]
 * @param {*} itemIndex
 * @param {*} subItemIndex
 */
export const getNavItems = (itemIndex, subItemIndex) => {
	let base = [
		{ name: 'about', path: '/about' },
		{ name: 'events', path: '/events' },
		[
			{ name: 'resources', path: '/resources' },
			{ name: 'articles', path: '/articles' },
			{ name: 'practice', path: '/practice' },
			{ name: 'links', path: '/links' }
		],
		[
			{ name: 'kpmt', path: '/kpmt' },
			{ name: 'about', path: '/kpmt' },
			{ name: 'registration', path: '/kpmt/registration' },
			{ name: 'volunteer', path: '/kpmt/volunteer' },
			{ name: 'past tests & results', path: '/kpmt/past' },
			{ name: 'contact', path: '/kpmt/contact' },
			{ name: 'coach login', path: '/kpmt/login' }
		],
		{ name: 'member login', path: '/login' }
	]

	if (itemIndex < 0) return base

	let item = base[itemIndex]
	if (item instanceof Array) {
		item[0].highlight = true
		item[subItemIndex].highlight = true
	} else {
		item.highlight = true
	}

	return base
}

export const getAdminNavItems = (itemIndex, subItemIndex) => {
	let base = [
		{ name: 'meetings', path: '/admin/meetings' },
		{ name: 'members', path: '/admin/members' },
		[
			{ name: 'kpmt', path: '/admin/kpmt' },
			{ name: 'schools', path: '/admin/kpmt/schools' },
			{ name: 'teams', path: '/admin/kpmt/teams' },
			{ name: 'competitors', path: '/admin/kpmt/competitors' },
			{ name: 'data entry', path: '/admin/kpmt/entry' }
		],
		{ name: 'logout', path: '/logout', end: true }
	]

	if (itemIndex < 0) return base

	let item = base[itemIndex]
	if (item instanceof Array) {
		item[0].highlight = true
		item[subItemIndex].highlight = true
	} else {
		item.highlight = true
	}

	return base
}

export const getCoachNavItems = (itemIndex, subItemIndex) => {
	let base = [
		{ name: 'dashboard', path: '/kpmt/coach/dashboard' },
		{ name: 'teams', path: '/kpmt/coach/teams' },
		{ name: 'individuals', path: '/kpmt/coach/individuals' },
		{ name: 'logout', path: '/coachLogout', end: true }
	]

	if (itemIndex < 0) return base

	let item = base[itemIndex]
	if (item instanceof Array) {
		item[0].highlight = true
		item[subItemIndex].highlight = true
	} else {
		item.highlight = true
	}

	return base
}

/**
 * props:
 * {
 *    items: [{
 *      name: String,
 *      path: String, // used in window.location.href = path
 *      highlight: Boolean
 *    }] // NOTE: could be array of arrays, for subitems
 * }
 */
export class CoachNav extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	gotoDashboard = () => {
		window.location.href = '/kpmt/coach/dashboard'
	}

	async componentDidMount() {
		const profileResponse = await fetchSchoolProfile()

		if (profileResponse.status === 200) {
			const data = await profileResponse.json()

			this.setState({ name: data.coachName.split(' ')[0] })
		}
	}

	render() {
		let items = this.props.items.slice()
		if (this.state.name) {
			// base[4] = { name: profileName, path: '/profile', end: true }
			items[items.length - 1] = [
				{
					name: this.state.name,
					path: '/kpmt/coach/profile',
					end: true,
					highlight: true
				},
				{ name: 'logout', path: '/coachLogout' }
			]
		}
		const navItems = items.map(item => {
			return (
				<NavItem
					item={item}
					key={
						item instanceof Array
							? item.map(i => i.name).reduce((a, b) => a + b)
							: item.name
					}
				/>
			)
		})

		const title = (
			<h4 onClick={this.gotoDashboard} className="title">
				<red>kpmt</red>
			</h4>
		)

		return (
			<div className="nav">
				{title}
				{navItems}
			</div>
		)
	}
}

/**
 * props:
 * {
 *    admin: Boolean, // needed to determine which title to use in the navbar
 *    items: [{
 *      name: String,
 *      path: String, // used in window.location.href = path
 *      highlight: Boolean
 *    }] // NOTE: could be array of arrays, for subitems
 * }
 */
export class Nav extends Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false
		}
	}

	gotoHome = () => {
		window.location.href = '/'
	}

	gotoAdminHome = () => {
		window.location.href = '/admin/meetings'
	}

	async componentDidMount() {
		const profileResponse = await fetchProfile()

		if (profileResponse.status === 200) {
			const data = await profileResponse.json()

			this.setState({ name: data.name.split(' ')[0] })
		}
	}

	render() {
		let items = this.props.items.slice()
		if (this.state.name) {
			// base[4] = { name: profileName, path: '/profile', end: true }
			items[items.length - 1] = [
				{ name: this.state.name, path: '/profile', end: true, highlight: true },
				{ name: 'logout', path: '/logout' }
			]
		}
		const navItems = items.map(item => {
			return (
				<NavItem
					item={item}
					key={
						item instanceof Array
							? item.map(i => i.name).reduce((a, b) => a + b)
							: item.name
					}
				/>
			)
		})

		const title = this.props.admin ? (
			<h4 onClick={this.gotoAdminHome} className="title">
				<red>newportmathclub</red>
				<gold>admin</gold>
			</h4>
		) : (
			<h4 onClick={this.gotoHome} className="title">
				<red>newportmathclub</red>
			</h4>
		)

		return (
			<div className="nav">
				<i
					className="material-icons menu"
					onClick={() => {
						this.setState({ open: !this.state.open })
					}}>
					menu
				</i>
				{title}
				<div className={'navPane' + (this.state.open ? ' visible' : '')}>
					{navItems}
				</div>
			</div>
		)
	}
}

class NavItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			hover: false,
			contentHover: false
		}
	}

	gotoPath = path => {
		window.location.href = path
	}

	render() {
		// check if there are subitems
		let item
		let style = {}
		if (this.props.item instanceof Array) {
			item = this.props.item.slice()
			let mainItem = item.splice(0, 1)[0]
			let subItems = item.map(subItem => {
				return (
					<h4
						key={subItem.name}
						className={
							'navItem navSubitem' + (subItem.highlight ? ' _highlight' : '')
						}
						onClick={() => this.gotoPath(subItem.path)}>
						{subItem.name}
					</h4>
				)
			})

			return (
				<div className="navbar-item" style={style}>
					<h4
						className={'navItem' + (mainItem.highlight ? ' _highlight' : '')}
						onClick={() => this.gotoPath(mainItem.path)}
						onMouseEnter={() => this.setState({ hover: true })}
						onMouseLeave={() => this.setState({ hover: false })}>
						{mainItem.name}
					</h4>
					<div
						style={{
							paddingTop: '0.2em',
							paddingLeft: '9em',
							fontSize: '0.7em'
						}}>
						{subItems}
					</div>
				</div>
			)
		} else {
			item = this.props.item
			let style = {}

			if (item.end) {
				style.marginLeft = 'auto'
			}
			return (
				<div style={style}>
					<h4
						className={'navItem' + (item.highlight ? ' _highlight' : '')}
						onClick={() => this.gotoPath(item.path)}>
						{item.name}
					</h4>
				</div>
			)
		}
	}
}

/**
 * props:
 * {
 *    header: String
 * }
 */
export class OfficerPane extends Component {
	render() {
		return (
			<div style={{ paddingTop: '2em' }}>
				<h2 style={{ paddingLeft: '1em' }}>{this.props.header}</h2>
				<div
					style={{
						display: 'grid',
						gridColumnGap: '1em',
						gridRowGap: '0.5em',
						padding: '2em'
					}}>
					{this.props.children}
				</div>
			</div>
		)
	}
}

/**
 * props:
 * {
 *    name: String,
 *    title: String,
 *    image: String,
 *    row: Number, // starts at 1
 *    column: Number // starts at 1
 *
 * }
 */
export class Bio extends Component {
	render() {
		return (
			<div style={{ height: '5em' }}>
				<img src={this.props.image} style={{ height: '90%', float: 'left' }} />
				<div
					style={{
						paddingLeft: '1em',
						height: '90%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'left'
					}}>
					<h3>{this.props.name}</h3>
					<h5>{this.props.title}</h5>
				</div>
			</div>
		)
	}
}

/**
 * props:
 * {
 *    name: String,
 *    href: String
 * }
 */
export class Link extends Component {
	render() {
		return (
			<a href={this.props.href}>
				<h4
					onClick={this.props.onClick}
					style={{
						marginTop: '1em',
						display: 'inline-block',
						color: this.props.danger ? '#eb5757' : 'auto'
					}}>
					{this.props.name}
				</h4>
			</a>
		)
	}
}

/**
 * props:
 * {
 *    placeholder: String,
 *    type: String
 * }
 */
export class Textbox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			text: this.props.text || '',
			errored: false
		}
	}

	getText = () => {
		return this.state.text
	}

	error = () => {
		this.setState({ errored: true })
	}

	unError = () => {
		this.setState({ errored: false })
	}

	clear = () => {
		this.setState({ text: '' })
	}

	handleKeyDown = e => {
		if (e.key === 'Enter') {
			if (this.props.onEnter) this.props.onEnter()
		}

		if (e.key === 'Tab') {
			if (this.props.onTab) this.props.onTab()
		}

		if (e.key === 'ArrowDown') {
			if (this.props.onArrowDown) this.props.onArrowDown()
		}

		if (e.key === 'ArrowUp') {
			if (this.props.onArrowUp) this.props.onArrowUp()
		}
	}

	render() {
		let style = { ...this.props.style }
		if (this.state.errored) style.border = '2px solid #eb5757'

		return (
			<input
				onKeyDown={this.handleKeyDown}
				style={style}
				placeholder={this.props.placeholder}
				type={this.props.type}
				value={this.state.text}
				onChange={e => {
					this.setState({ text: e.target.value })
					if (this.props.onTextChange) this.props.onTextChange(e.target.value)
				}}
			/>
		)
	}
}

export class FilterBar extends Component {
	getText = () => {
		return this.state.text
	}

	constructor(props) {
		super(props)
		this.state = {
			text: ''
		}
	}
	render() {
		return (
			<input
				style={{ display: 'inline-block' }}
				placeholder={this.props.placeholder}
				type={this.props.type}
				value={this.state.text}
				onChange={e => {
					this.setState({ text: e.target.value })
					this.props.onTextChange(e.target.value)
				}}
			/>
		)
	}
}

export class Table extends Component {
	constructor(props) {
		super(props)

		this.state = {
			sortIndex: null,
			sortDirection: null
		}
	}

	toggleSortByIndex = index => {
		const currentSortIndex = this.state.sortIndex
		const currentSortDirection = this.state.sortDirection

		// toggle order: sort ascending, sort descending, sort off
		if (index === currentSortIndex) {
			if (currentSortDirection === 1) {
				this.setState({ sortDirection: -1 })
				return
			} else if (currentSortDirection === -1) {
				this.setState({ sortIndex: null, sortDirection: null })
				return
			}
		} else {
			this.setState({ sortIndex: index, sortDirection: 1 })
		}
	}

	render() {
		let headers = this.props.headers.map((header, index) => {
			return (
				<th key={header} onClick={() => this.toggleSortByIndex(index)}>
					{header}
					{this.state.sortIndex === index && this.state.sortDirection === -1 && (
						<i
							className="material-icons"
							style={{ color: '#000', position: 'relative', top: '8%' }}>
							arrow_drop_down
						</i>
					)}
					{this.state.sortIndex === index && this.state.sortDirection === 1 && (
						<i
							className="material-icons"
							style={{ color: '#000', position: 'relative', top: '8%' }}>
							arrow_drop_up
						</i>
					)}
				</th>
			)
		})

		let rows
		if (this.props.filter.length > 0) {
			const data = this.props.data.slice()

			const sortIndex = this.state.sortIndex
			const sortDirection = this.state.sortDirection
			if (
				data.length > 0 &&
				sortIndex !== null &&
				sortDirection !== null &&
				!isNaN(sortIndex) &&
				!isNaN(sortDirection) &&
				sortIndex >= 0 &&
				sortIndex < data[0].fields.length
			) {
				data.sort((a, b) => {
					return (
						sortDirection *
						a.fields[sortIndex].toString().localeCompare(b.fields[sortIndex])
					)
				})
			}

			rows = data.slice().map(row => {
				for (let i = 0; i < row.fields.length; i++) {
					if (!row.fields[i]) continue
					if (
						row.fields[i]
							.toString()
							.toLowerCase()
							.includes(this.props.filter.toLowerCase())
					) {
						return (
							<tr
								key={row._id}
								onClick={() => {
									this.props.onItemClick(row._id)
								}}>
								{row.fields.map((item, index) => {
									return <td hey={index}>{item}</td>
								})}
							</tr>
						)
					}
				}
			})
		} else {
			const data = this.props.data.slice()

			const sortIndex = this.state.sortIndex
			const sortDirection = this.state.sortDirection
			if (
				data.length > 0 &&
				sortIndex !== null &&
				sortDirection !== null &&
				!isNaN(sortIndex) &&
				!isNaN(sortDirection) &&
				sortIndex >= 0 &&
				sortIndex < data[0].fields.length
			) {
				data.sort((a, b) => {
					if (!a.fields[sortIndex]) return 1
					return (
						sortDirection *
						a.fields[sortIndex].toString().localeCompare(b.fields[sortIndex])
					)
				})
			}

			rows = data.slice().map(row => {
				return (
					<tr
						key={row._id}
						onClick={() => {
							this.props.onItemClick(row._id)
						}}>
						{row.fields.map((item, index) => {
							return <td key={index}>{item}</td>
						})}
					</tr>
				)
			})
		}

		return (
			<table>
				<thead>
					<tr>{headers}</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		)
	}
}

/**
 * props:
 * {
 *    text: String,
 *    onClick: function
 * }
 */
export class Button extends Component {
	startLoading = () => {}

	stopLoading = () => {}

	constructor(props) {
		super(props)
		this.state = {
			loading: false
		}
	}

	render() {
		return (
			<div
				style={this.props.style}
				onClick={this.props.onClick}
				className="button">
				{this.props.text}
			</div>
		)
	}
}

export class ToggleButton extends Component {
	constructor(props) {
		super(props)

		this.state = {
			enabled: this.props.checked || false
		}
	}

	isEnabled = () => {
		return this.state.enabled
	}

	setEnabled = enabled => {
		this.setState({ enabled: enabled })
	}

	render() {
		return (
			<label className="switch">
				<input
					type="checkbox"
					checked={this.state.enabled}
					onChange={() => {
						if (this.props.onClick) {
							const shouldAutoToggle = this.props.onClick()
							if (shouldAutoToggle)
								this.setState({ enabled: !this.state.enabled })
						} else {
							this.setState({ enabled: !this.state.enabled })
						}
					}}
				/>
				<span className="slider round" />
			</label>
		)
	}
}
