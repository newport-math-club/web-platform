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
						style={{
							width: '100%',
						}}
						src="https://drive.google.com/uc?id=14Jqm11IYPGynrpenz9KfVolkPmjqoeNx"
					/>
					<h2 style={{ paddingTop: '1em' }}>About KPMT</h2>
					<p>
					
						<h4 style = {{color: '#eb5757'}}>The last Knight of Pi Math Tournament was on December 12th, 2020!</h4>
					</p>

					<a href="https://drive.google.com/file/d/1BRQDr8gy9AGcBqJ1xO6Ulpu6cyiA0rx8/view?usp=sharing">
						<h3>Top KPMT Teams and Individuals</h3>
					</a>
					<br/>
					<a href="https://drive.google.com/file/d/1air5hjttguTR3Maa8_qwjsd_oaNRTsMy/view?usp=sharing">
						<h3>All KPMT Score</h3>
					</a>
					<br/>
					<a href="https://drive.google.com/drive/folders/1YL6AEdBAuWUt8PSVg3XGOchTjhE9dixE?usp=sharing">
						<h3>Answer Keys</h3>
					</a>
					<br />
					<a href="https://forms.gle/MVV6rwLrjRYvkp6i7">
						<h3>Coach/Parent Feedback forms</h3>
					</a>
					<br />
					<a href="https://youtu.be/tuAkEruJJF8">
						<h3>KPMT YouTube LiveStream Playback</h3>
					</a>
					<br/>
					<p>
						Welcome to Newport High School's Knights of Pi Math Tournament! This
						exciting and challenging math contest for students in grades 5-8 is
						hosted by Newport Math Club, the math team at Newport High School.
						The tournament is designed to be a positive and fun math experience
						for all involved and provide the highly motivated students a chance
						to demonstrate what they have learned throughout the year. If you
						have any questions about the competition, feel free to let us know.
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
