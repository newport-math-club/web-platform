import React, { Component } from 'react'
import { fetchProfile } from './nmc-api'

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
	var base = [
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
			{ name: 'past tests & results', path: '/kpmt/past' },
			{ name: 'contact', path: '/kpmt/contact' }
		],
		{ name: 'login', path: '/login', end: true }
	]

	if (itemIndex < 0) return base

	var item = base[itemIndex]
	if (item instanceof Array) {
		item[0].highlight = true
		item[subItemIndex].highlight = true
	} else {
		item.highlight = true
	}

	return base
}

export const getAdminNavItems = (itemIndex, subItemIndex) => {
	var base = [
		{ name: 'meetings', path: '/admin/meetings' },
		{ name: 'members', path: '/admin/members' },
		[
			{ name: 'kpmt', path: '/admin/kpmt' },
			{ name: 'schools', path: '/admin/kpmt/schools' },
			{ name: 'competitors', path: '/admin/kpmt/competitors' },
			{ name: 'data entry', path: '/admin/kpmt/scoring' }
		],
		{ name: 'logout', path: '/logout', end: true }
	]

	if (itemIndex < 0) return base

	var item = base[itemIndex]
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

		this.state = {}
	}

	gotoHome = () => {
		window.location.href = '/'
	}

	gotoAdminHome = () => {
		// TODO: make this redirect to admin dashboard
		window.location.href = '/'
	}

	async componentDidMount() {
		const profileResponse = await fetchProfile()

		if (profileResponse.status == 200) {
			const data = await profileResponse.json()

			this.setState({ name: data.name.split(' ')[0] })
		}
	}

	render() {
		var items = this.props.items.slice()
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
			<h4 onClick={this.gotoHome} className="title">
				<red>newportmathclub</red>
				<gold>admin</gold>
			</h4>
		) : (
			<h4 onClick={this.gotoAdminHome} className="title">
				<red>newportmathclub</red>
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
		if (this.props.item instanceof Array) {
			var item = this.props.item.slice()
			var mainItem = item.splice(0, 1)[0]
			var subItems = item.map(subItem => {
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

			var paddingAmount = this.props.item.length * 2.2 - 2.2 + 0.5
			var style = {}
			if (this.state.hover || this.state.contentHover) {
				style.paddingTop = paddingAmount + 'em'
			}
			if (mainItem.end) {
				style.marginLeft = 'auto'
				style.textAlign = 'right'
			}

			return (
				<div style={style}>
					<h4
						className={'navItem' + (mainItem.highlight ? ' _highlight' : '')}
						onClick={() => this.gotoPath(mainItem.path)}
						onMouseEnter={() => this.setState({ hover: true })}
						onMouseLeave={() => this.setState({ hover: false })}>
						{mainItem.name}
					</h4>
					<div
						onMouseEnter={() => this.setState({ contentHover: true })}
						onMouseLeave={() => this.setState({ contentHover: false })}
						className={
							'dropdown-contents' +
							(this.state.hover || this.state.contentHover ? ' _show' : '')
						}
						style={{ paddingTop: '0.2em' }}>
						{subItems}
					</div>
				</div>
			)
		} else {
			var item = this.props.item
			var style = {}

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
			<div className="leftpane">
				<h2 style={{ paddingLeft: '2em' }}>{this.props.header}</h2>
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
			<div style={{ height: '5em', paddingLeft: '3em' }}>
				<img src={this.props.image} style={{ height: '90%', float: 'left' }} />
				<div
					style={{
						paddingLeft: '2em',
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
			<a href={this.props.href} target="_blank">
				<h4 style={{ marginTop: '1em', display: 'inline-block' }}>
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
			text: '',
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
		var style = { ...this.props.style }
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
	toggleSortByIndex = index => {
		// TODO:
	}

	render() {
		var headers = this.props.headers.map((header, index) => {
			return (
				<th key={header} onClick={this.toggleSortByIndex(index)}>
					{header}
				</th>
			)
		})

		var rows
		if (this.props.filter.length > 0) {
			rows = this.props.data.slice().map(row => {
				for (var i = 0; i < row.fields.length; i++) {
					if (!row.fields[i]) continue
					if (
						row.fields[i]
							.toString()
							.toLowerCase()
							.includes(this.props.filter.toLowerCase())
					) {
						return (
							<tr
								onClick={() => {
									this.props.onItemClick(row._id)
								}}>
								{row.fields.map(item => {
									return <td>{item}</td>
								})}
							</tr>
						)
					}
				}
			})
		} else {
			rows = this.props.data.slice().map(row => {
				return (
					<tr
						onClick={() => {
							this.props.onItemClick(row._id)
						}}>
						{row.fields.map(item => {
							return <td>{item}</td>
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
			<div onClick={this.props.onClick} className="button">
				{this.props.text}
			</div>
		)
	}
}

export class ToggleButton extends Component {
	constructor(props) {
		super(props)

		this.state = {
			enabled: false
		}
	}

	isEnabled = () => {
		return this.state.enabled
	}

	render() {
		return (
			<label class="switch">
				<input
					type="checkbox"
					onClick={() => {
						this.setState({ enabled: !this.state.enabled })
					}}
				/>
				<span class="slider round" />
			</label>
		)
	}
}
