import React, {Component} from 'react';
import './styles.css';
import {feathersClient} from '../feathersClient';
import Header from '../Header';
import Content from '../Content';
import Item from '../Item';
import MilestoneView from '../MilestoneView';
import ReviewMilestone from '../ReviewMilestone';
import PageSlider from '../react-page-slider';

class ReviewMilestones extends Component {

	constructor(props) {
		super(props);
		this.state = {
			milestones: [],
			index: 0,
			displayMilestone: false,
			displayReview: false,
			prevDisplayReview: false,
			slideMode: 'bottom'
		};
		const milestones = feathersClient.service('milestones');
    milestones.find({
      query: {
        $limit: 100,
        $sort: {
          completion_date: 1
        }
      }
    }).then( response => {
      const milestones = response.data;
      this.setState({milestones});
    });
		this.reviewView = this.reviewView.bind(this);
		this.viewMilestone = this.viewMilestone.bind(this);
		this.enterReview = this.enterReview.bind(this);
		this.exitReview = this.exitReview.bind(this);
		this.getDetailsFromMilestone = this.getDetailsFromMilestone.bind(this);
		this.tick = this.tick.bind(this);
	}

	tick() {
		this.setState({
			displayMilestone: false,
		});
		clearInterval(this.timer);
	}

	viewMilestone(idx) {
		this.setState({
			index: idx,
			displayMilestone: true,
			slideMode: 'bottom',
		})
	}

	reviewView() {
		this.setState({
			displayMilestone: false,
		})
	}

	enterReview() {
		this.setState({
			displayReview: true,
		})
		this.timer = setInterval(this.tick, 500);
	}

	exitReview() {
		this.setState({
			displayMilestone: false,
			displayReview: false,
			slideMode: 'top',
		})
	}

	getDetailsFromMilestone(milestone) {
		var deadline = new Date(milestone.completion_date);
		var nowd = Date.now();
		var delta = deadline.getTime() - nowd;
		var secs = delta / 1000;
		var days = secs / 3600 / 24;
		var res = '';
		if (milestone.completion_status === 'in progress') {
			res = 'Milestone in progress ';
			if (days < 0)
				res += Math.ceil(-days) + ' days before';
			else
				res += Math.ceil(days) + ' days after';
			res += ' completion deadline.';
		}
		return res;
	}

	render() {
		var self = this;
		var milestones = this.state.milestones;
		return (
			<div>
				<PageSlider show={!this.state.displayMilestone || this.state.displayReview} slideFrom={'left'}>
					<div className="reviewMilestones">
						<Header title="PM" />
						<Content>
							<div className="goBack" onClick={ this.props.homeView }>
								{ "< Back to my home view" }
							</div>
							<div className="pageName">Review Milestones</div>
							<div className="statement">
							{
								"You have " + milestones.length + " milestone" + (milestones.length > 1 ? 's' : '') + " you volunteered to review."
							}
							</div>
							<div className="scrollableBox">
								{
									milestones.map(function(milestone, idx) {
										var details, state;
										details = self.getDetailsFromMilestone( milestone );
										state = 0;
										if (milestone.completion_status === 'approved')
											state = 1;
										if (milestone.completion_status === 'rejected')
											state = 2;
										if (self.state.displayReview)
											return;
										return <Item
											Icon='fa-heart'
											key={idx}
											Title={ milestone.name }
											Details={ details }
											Link="Review"
											index={idx}
											onView={self.viewMilestone}
											isMilestone={true}
											state={state}
										/>
									})
								}
							</div>
						</Content>
					</div>
				</PageSlider>
				<PageSlider show={this.state.displayMilestone} slideFrom='right'>
					<MilestoneView
						displayReview={ this.state.displayReview }
						milestone={ milestones[this.state.index] }
						reviewView={ this.reviewView }
						enterReview={ this.enterReview }
					/>
				</PageSlider>
				<PageSlider show={ this.state.displayReview } slideFrom={this.state.slideMode}>
					<ReviewMilestone
						milestone={milestones[this.state.index]}
						exitReview={this.exitReview}
					/>
				</PageSlider>
			</div>
		);
	}
}

export default ReviewMilestones;
