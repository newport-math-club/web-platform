import React, { Component } from 'react'
import { Nav, getNavItems } from '../Components'

export default class HomePage extends Component {
	render() {
		const items = [
			{
				name: 'Item 1',
				highlight: true
			},
			{
				name: 'Item 2',
				highlight: false
			},
			{
				name: 'Item 3',
				highlight: false
			},
			{
				name: 'Item 4',
				highlight: false
			}
		]

		return <Nav admin={true} items={getNavItems(0)} />
	}
}
