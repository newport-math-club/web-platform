import React, { Component } from 'react'
import { Nav, getNavItems, OfficerPane, Bio } from '../Components'

export default class AboutPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(0)} />
				<OfficerPane header="Officers">
					<Bio
						name="Justin Chen"
						title="President"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={1}
						column={1}
					/>
					<Bio
						name="Alex Liu"
						title="Vice President"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={2}
						column={1}
					/>
					<Bio
						name="Kevin Nam"
						title="Secretary"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={3}
						column={1}
					/>
					<Bio
						name="Jerry Jin"
						title="Treasurer"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={4}
						column={1}
					/>
					<Bio
						name="Marcelo Shen"
						title="Webmaster"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={5}
						column={1}
					/>
					<Bio
						name="Alex Niu"
						title="Shadow Officer"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={6}
						column={1}
					/>
					<Bio
						name="Ryan Zhang"
						title="Shadow Officer"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={7}
						column={1}
					/>
					<Bio
						name="Jeenah Gwak"
						title="Shadow Officer"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={8}
						column={1}
					/>
					<Bio
						name="Minghan Sun"
						title="Shadow Officer"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={9}
						column={1}
					/>
					{/* <Bio
						name="Kevin Nam"
						title="Shadow Officer"
						image="https://www.newportmathclub.org/assets/favicon.ico"
						row={9}
						column={1}
					/> */}
					
				</OfficerPane>

				<div
					style={{
						float: 'left',
						width: 'calc(66% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h1>WEBSITE UNDER CONSTRUCTION! (KPMT registration is operating)</h1>
					<h2>Mission</h2>
					<p>
						Our goal is to provide a positive environment to develop
						mathematical skills while improving problem solving techniques and
						accuracy in an enjoyable manner. Through working in individual and
						group settings, we strive to prepare our members to be stronger math
						students and competitors. We want to encourage working well as a
						team while also excelling as an individual.
					</p>

					<h2 style={{ paddingTop: '1em' }}>Topics</h2>
					<p>
						Our curriculum goes beyond what is covered in district math classes
						and is meant to complement and not just repeat what is learned in
						class. For this reason, members are strongly encouraged to take math
						classes all four years of high school and challenge themselves by
						taking Advanced Placement classes such as AP Calculus and AP
						Statistics. Members are also encouraged to meet with their teachers
						during tutorial after school to reinforce concepts they learned in
						class. Since we build on knowledge gained in high school-level math
						classes, it is critical that members make sure they understand basic
						math concepts that they have been taught.
					</p>

					<h2 style={{ paddingTop: '1em' }}>Attendance & Communication</h2>
					<p>
						Our club strongly values communication between our officers and our
						members. If you have any suggestions for the officers, please let
						them know. All members need to register with the secretary upon
						joining the club to ensure that they receive the latest information
						and that they can be registered for competitions that they sign up
						to attend. Attendance will also be taken at meetings, so be sure to
						attend as many meetings and competitions as possible. Members are
						expected to make Math Club one of their top priorities, so
						attendance at all events is strongly encouraged, as well as
						necessary to improve math skills for competitions in a group
						environment. Members are also encouraged to bring friends to the
						club meetings.
					</p>

					<h2 style={{ paddingTop: '1em' }}>Bylaws</h2>
					<p>
						Our bylaws govern the club activities and provide basic structure to
						its operations. Our{' '}
						<a href="https://newport-math-club.nyc3.digitaloceanspaces.com/bylaws.pdf">
							current bylaws
						</a>{' '}
						were written and last ratified by the club officers and advisor on
						March 23, 2012.
					</p>
				</div>
			</div>
		)
	}
}
