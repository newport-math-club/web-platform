import React, { Component } from 'react'
import { Nav, getNavItems } from '../../Components'

export default class KPMTAboutPage extends Component {
	render() {
		return (
			<div className="fullheight">
				<Nav admin={false} items={getNavItems(3, 1)} />

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
					<img
						alt="kpmt-banner"
						style={{ width: '100%' }}
						src="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmtbanner.png"
					/>
					<h2 style={{ paddingTop: '1em' }}>About KPMT</h2>
					<p>
					
						<h4 style = {{color: '#eb5757'}}>Knight of Pi Math Tournament is on December 12th this year!</h4>
						<h5 style = {{color: "#eb5757"}}>This is likely our final decision. However, if we decide to reschedule KPMT to a later date, registered coaches will be notified through email. Please email if you have questions.</h5>
					</p>
					<p>
						Welcome to Newport High School's Knights of Pi Math Tournament! This
						exciting and challenging math contest for students in grades 5-8 is
						hosted by Newport Math Club, the math team at Newport High School.
						The tournament is designed to be a positive and fun math experience
						for all involved and provide the highly motivated students a chance
						to demonstrate what they have learned throughout the year. If you
						have any questions about the competition, feel free to let us know.
					</p>

					<p>
						<b>2020 KPMT Date: December 12th, 1:15 - 7:00 PM</b>
						<br />
						<b>Registration Deadline: December 5th, 6:00 PM</b>
					</p>

					<h2 style = {{paddingTop: '1em'}}>NOTICE: Registration/payment instructions document has been updated as of Jan. 17, 2020</h2> 
					
					<a href="https://youtu.be/WUrMGa5KeII">
						<h3>Detailed registration instructions</h3>
					</a>

					<br />

					<a href="https://drive.google.com/file/d/1SpizncN3eCBj2etw5gLv1uoJmQB1o2J9/view?usp=sharing">
						<h3>FAQ</h3>
					</a>

					<br />

					<a href="https://drive.google.com/file/d/1_7V4tfMny9J1k3w0F9t6zyBFWEdcqXeP/view?usp=sharing">
						<h3>Schedule</h3>
					</a>

					<br />

					<a href="https://drive.google.com/file/d/1sgj3KzCLvrMrJlPx7t93xpmEUyZOxLhL/view?usp=sharing">
						<h3>Registration and Payment</h3>
					</a>

					<br />
					
					<a href="https://drive.google.com/file/d/1GbmVIkScIuZH6fc3VdWz8Y2PfjCUx79A/view?usp=sharing">
						<h3>Test Format, Scoring, Rules, and Guidelines</h3>
					</a>

					<br />

{/* 					<a href="">
						<h3>Schedule</h3>
					</a>

					<br /> */}

{/* 					<a href="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmt-docs/regpay.pdf">
						<h3>Detailed registration and payment instructions</h3>
					</a>

					<br />

					<a href="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmt-docs/rules.pdf">
						<h3>Detailed competition rules and guidelines</h3>
					</a>

					<br />

					<a href="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmt-docs/scoring.pdf">
						<h3>Test format and scoring specifications</h3>
					</a>

					<br />

					<a href="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmt-docs/schedule.pdf">
						<h3>Official schedule of events</h3>
					</a>

					<br />

					<a href="https://newport-math-club.nyc3.digitaloceanspaces.com/kpmt-docs/faq.pdf">
						<h3>Frequently asked questions</h3>
					</a> */}

					<br />

					<h2>Registration</h2>
					<p>
						Registration is carried out <b>PER SCHOOL</b>. Please coordinate
						with all teams in your school, and have a <b>single</b> coach
						register the entire school. We will not approve duplicate schools.
						Unless unique circumstances arise, we will only accept the first
						registration of a school; other coaches that register the same
						school will be removed.
					</p>

					<h3>Fees and Deadlines</h3>
					<p>
						<b>Registration Fee: $15/team, $5/individual</b>
					</p>
					<p>
						<b>
							Registration and modifications close December 5th, 2020 at 6 PM.
						</b>{' '}
						We allow competitors to switch teams at the registration table on
						the day of, but no new teams or individuals may be added after this
						deadline.
					</p>

					<a href="/kpmt/registration">
						<h3>Register your school</h3>
					</a>

					<h2 style={{ paddingTop: '1em' }}>Sponsor</h2>
					<a href="https://bellevue.aopsacademy.org/">
						<img
							style={{ width: '100%', marginTop: '1em' }}
							src="https://bellevue.aopsacademy.org/assets/images/logos/aops-academy-bellevue.svg"
							alt="kpmt-banner"
						/>
					</a>
					<p>
						We are honored to be sponsored by{' '}
						<a href="https://bellevue.aopsacademy.org/">
							AoPS Academy Bellevue
						</a>{' '}
						this year! A representative will be speaking during KPMT, and they
						will set up a booth to talk to interested parents and students.
					</p>

					<h2 style={{ paddingTop: '1em' }}>History</h2>

					<a href="/kpmt/past">
						<h3>Past test archives</h3>
					</a>

					<p>
						The tenth annual KPMT Tournament was held on Saturday, March 17,
						2018. The test was identical to the 9th KPMT, complete with a Pi
						recitation contest. This was again, the largest KPMT in our history,
						with over 650 contestants. A special thanks to all of the
						volunteers, National Honors Society, and parents who helped out.
						Cheers to a great 10 years!
					</p>
					<p>
						The ninth annual KPMT Tournament was held on Saturday, January 7,
						2017. The test consisted of a total of six tests: The three team
						tests were Algebra and Operations, Geometry, and Probability and
						Potpourri, and the three individual tests were Block Math,
						Individual, and Mental Math. Once again, we had the PI recitation
						contest. A special thanks to all of the volunteers, National Honors
						Society, and parents who helped out.
					</p>
					<p>
						The eighth annual KPMT Tournament was held Saturday, December 16,
						2015. The relay round was retired from the contest while a new
						unique individual test was featured, called the Block Round. The
						Probability/Potpourri round was brought back as well. Nearly 450
						students signed up, with over a 130 teams participating in the
						contest. It was one of the most successful contests to date, with
						almost too many volunteers as well! The pi recitation contest
						tradition continued as well. We would like to give a special thank
						you to all volunteers and our math club, as well as the parents and
						teachers who helped us be able to run such a successful contest.
					</p>
					<p>
						The fifth annual KPMT Tournament was held on Saturday, December
						15th, 2012, featuring a huge expansion in tournament attendance with
						an amazing 108 teams signed up, 20 more than the previous year. The
						special round was again the relay round and we had special questions
						at the end to recite the digits of pi and to solve interesting
						puzzles. A special thanks to all our math club and National Honors
						Society volunteers, as well as the parents and teachers who
						contributed. We could not have done it without you.
					</p>
					<p>
						The fourth annual KPMT Tournament was held on Saturday, January 28,
						2012, featuring a new relay round in which teams had to cooperate in
						order to answer questions both quickly and accurately and relay the
						answer down to the next person to be used in the next question. A
						special thanks to all our math club and National Honor Society
						volunteers, as well as the parents, and teachers who contributed.
					</p>

					<p>
						The third annual KPMT Tournament was held on Saturday, December 4,
						2010, featuring the tournament's greatest attendance yet and KPMT
						Live! where teams faced off in exciting rounds of Jeopardy and
						College Bowl for exclusive prizes. A special thanks to all our math
						club and National Honor Society volunteers, as well as the parents
						and teachers who contributed.
					</p>
					<p>
						The second annual KPMT Tournament was held on Saturday, December 12,
						2009, featuring the new Joust! round in which teams raced to
						complete various math- and logic-related activities. A special
						thanks to all our math club and National Honor Society volunteers,
						as well as the parents, teachers, and sponsors who contributed.
					</p>
					<p>
						The first annual KPMT Tournament was held on Saturday, May 16, 2009.
						Thanks to all everyone who attended, and a special thanks to all the
						wonderful coaches, parents, volunteers, and sponsors.
					</p>
					<p>
						See more information about past tests and results in our archive.
					</p>
				</div>
			</div>
		)
	}
}
