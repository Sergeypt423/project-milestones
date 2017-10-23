import React, {Component} from 'react';
import './MilestoneView.css';
import Header from '../Header';
import Content from '../Content';
import Item from '../Item';

class MilestoneView extends Component {

	render() {
		var milestone = this.props.milestone;
		if (milestone === undefined)
			return null;
		return (
			<div>
				<div className="milestoneView">
					<Header title="PM" />
					<Content>
						<div className="goBack" onClick={ this.props.reviewView }>
							{ "< Back to completion requests" }
						</div>
						<div className="pageName">{'Review ' + milestone.name}</div>
						<div className="infoBox">
							<div className="subTitle">Milestone Description:</div>
							<div>{milestone.description}</div>
						</div>
						<div className="infoBox">
							<div className="subTitle">Completion Requirements:</div>
							<div className="reqs">{
								milestone.evidence.map(function(req, index) {
									return <li key={index}>{Object.keys(req)[0]}</li>
								})
							}</div>
						</div>
						<div className="infoBox">
							<span className="subTitle">Evidence: </span>
							Youtube, Github, Instagram, S3 asset#1, S3 asset#2
						</div>
						<Item
							Icon='fa-heart'
							Title="Make review"
							Details={milestone.description}
							Link="Make review"
							onClick={ this.props.enterReview }
						/>
					</Content>
				</div>
			</div>
		);
	}
}

export default MilestoneView;
