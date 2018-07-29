import React, { Component } from 'react'

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
			{ name: 'kpmt', path: '/kpmt/about' },
			{ name: 'about', path: '/kpmt/about' },
			{ name: 'registration', path: '/kpmt/registration' },
			{ name: 'past tests & results', path: '/kpmt/past' },
			{ name: 'contact', path: '/kpmt/contact' }
		],
		{ name: 'login', path: '/login' }
	]

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
	render() {
		const navItems = this.props.items.map(item => {
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
			<h4 className="title">newportmathclubadmin</h4>
		) : (
			<h4 className="title">newportmathclub</h4>
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
						className={'navItem' + (subItem.highlight ? ' _highlight' : '')}
						onClick={() => this.gotoPath(subItem.path)}>
						{subItem.name}
					</h4>
				)
			})

			var paddingAmount = this.props.item.length * 1.8 - 1.55
			return (
				<div
					style={
						this.state.hover || this.state.contentHover
							? { paddingTop: paddingAmount + 'em' }
							: {}
					}>
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
						}>
						{subItems}
					</div>
				</div>
			)
		} else {
			var item = this.props.item
			return (
				<div>
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
