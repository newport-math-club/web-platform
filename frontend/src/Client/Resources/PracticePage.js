import React, { Component } from 'react'
import { Nav, getNavItems, Link } from '../../Components'

export default class PracticePage extends Component {
	render() {
		var linksData = [
			{
				href: 'https://artofproblemsolving.com/community/c13_contests',
				name: 'American Mathematics Competition'
			},
			{
				href: 'https://artofproblemsolving.com/community/c13_contests',
				name: 'United States of America Mathematical Olympiad'
			},
			{
				href: 'http://www.wamath.net/contests/MathisCool/samples/high.html',
				name: 'Math is Cool'
			},
			{
				href: 'http://wamath.net/hs/contests/fallclassic/samples.html',
				name: 'Mu Alpha Theta Fall Classic'
			},
			{
				href: 'http://wamath.net/hs/contests/wastate/state08/index.html',
				name: 'Mu Alpha Theta State'
			},
			{
				href: 'http://www.wsmc.net/contests/',
				name: 'Washington State Mathematics Council Mathematics Contest'
			},
			{
				href: 'http://wamath.net/hs/contests/sigma/samples.html',
				name: 'Skyview Math Contest'
			}
		]

		var links = linksData.map(linkData => {
			return <Link href={linkData.href} name={linkData.name} />
		})

		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(2, 2)} />
				<div
					style={{
						float: 'left',
						marginLeft: '20%',
						width: 'calc(60% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>Practice</h2>
					<p>
						Below you will find links to past papers for various competitions.
						There are three areas that you should aim to improve when you
						practice competition mathematics. They are listed below along with
						some helpful pointers.
					</p>
					<p>
						<b>Knowledge</b> - Read the entire problem. Think about possible
						approaches to solving it. Then try to solve the problem and check
						your answer. Do another similar problem and try to reinforce the
						concept. If you get stuck, use the internet, a teacher, or a friend
						to help you work through the problem. Memorize any necessary
						formulas or steps. Find a problem-solving method that makes sense to
						you.
					</p>
					<p>
						<b>Accuracy</b> - Once you understand the related math concept, find
						a series of problems that are similar to the one you learned (or
						make them up if possible). Then, do a short number of problems and
						check your answers. Go over those problems and see what you did
						wrong. Finally, finish the rest of the problems and focus on being
						as accurate as possible. Avoid rushing at this point.
					</p>
					<p>
						<b>Speed</b> - Now that you are confident that you can solve the
						problem, find or have a friend construct a practice test. Set a
						fast-paced, but reasonable time limit, create an answer grid, and
						go! On scratch paper, write as much as you need to as you work, but
						try not to write so much that it slows you down. Once the time is
						up, review each problem and how you solved it, and search for faster
						methods. Take the test again, and see if you can complete the same
						problems at a faster rate. Over time, you will start to recognize
						similar problems on related tests and you will begin to develop
						faster solution methods.
					</p>
					{links}
				</div>
			</div>
		)
	}
}
