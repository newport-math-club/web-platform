import React, { Component } from 'react'
import {
	Nav,
	getAdminNavItems,
	FilterBar,
	Button,
	Textbox,
	Table,
	ToggleButton
} from '../../Components'
import Modal from 'react-modal'
import SocketEventHandlers from '../../Sockets'
import {
	fetchKPMTSchools,
	fetchKPMTTeams,
	fetchKPMTCompetitors
} from '../../nmc-api'
import moment from 'moment'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		width: '40em',
		height: '40em',
		right: 'auto',
		bottom: 'auto',
		paddingLeft: '2em',
		paddingTop: '2em',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: '1px 2px 8px #c4c4c4',
		borderRadius: '32px',
		border: 'none'
	}
}

export default class KPMTCompetitorsPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
			competitorDialogIsOpen: false,
			competitors: [],
			selectedCompetitor: null
		}
	}

	componentWillUnmount() {
		// TODO: handle kpmt competitor change socket unsub
	}

	async componentDidMount() {
		// TODO: handle kpmt competitor change socket sub

		const competitorsResponse = await fetchKPMTCompetitors()

		if (competitorsResponse.status == 200) {
			const data = await competitorsResponse.json()
			this.setState({ competitors: data })
		}
	}

	openCompetitorModal = competitorId => {
		const selected = this.state.competitors
			.slice()
			.filter(t => t._id.toString() === competitorId.toString())[0]
		this.setState({
			competitorDialogIsOpen: true,
			selectedCompetitor: selected
		})
	}

	closeCompetitorModal = () => {
		this.setState({
			competitorDialogIsOpen: false,
			selectedCompetitor: null
		})
	}

	render() {
		const selectedCompetitor = this.state.selectedCompetitor || {
			school: {},
			team: {},
			scores: {}
		}
		return (
			<div className="fullheight">
				<Modal
					isOpen={this.state.competitorDialogIsOpen}
					style={customStyles}
					contentLabel="View Competitor">
					<h2>View Competitor</h2>
					<h3>Name: {selectedCompetitor.name}</h3>
					<h3>Grade: {selectedCompetitor.grade}</h3>
					<h3>School: {selectedCompetitor.school.name}</h3>
					<h3>Team: {selectedCompetitor.team.number}</h3>
					<h3>
						Individual:{' '}
						{selectedCompetitor.scores.individual +
							'/' +
							selectedCompetitor.scores.individualLast}
					</h3>
					<h3>Block: {selectedCompetitor.scores.block}</h3>
					<h3>Mental: {selectedCompetitor.scores.mental}</h3>
					<h3 style={{ color: '#527aff' }}>
						Weighted: {selectedCompetitor.scores.weighted}
					</h3>

					<div style={{ bottom: '1em', right: '1em', position: 'absolute' }}>
						<Button onClick={this.closeCompetitorModal} text="close" />
					</div>
				</Modal>

				<Nav admin={true} items={getAdminNavItems(2, 3)} />
				<div
					style={{
						float: 'left',
						marginLeft: '10%',
						width: 'calc(80% - 8em)',
						height: 'calc(100% - 12em)',
						paddingLeft: '4em',
						paddingRight: '4em',
						overflowY: 'auto'
					}}>
					<h2>KPMT Competitors</h2>
					<div>
						<FilterBar
							placeholder="filter"
							onTextChange={text => this.setState({ filter: text })}
						/>
					</div>
					<Table
						headers={['Grade', 'Name', 'School', 'Score']}
						filter={this.state.filter}
						onItemClick={this.openCompetitorModal}
						data={this.state.competitors.slice().map(competitor => {
							return {
								_id: competitor._id,
								fields: [
									competitor.grade,
									competitor.name,
									competitor.school.name,
									competitor.scores.weighted
								]
							}
						})}
					/>
				</div>
			</div>
		)
	}
}
