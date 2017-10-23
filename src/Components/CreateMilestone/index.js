import React, {Component} from 'react';
import './styles.css';
import Header from '../Header';
import Content from '../Content';
import SelectReviewer from '../SelectReviewer';
import {feathersClient} from '../feathersClient';

class CreateMilestone extends Component {

	constructor(props) {
		super(props);

		this.state = {
			milestones: [],
			name: '',
			description: '',
			reqs: [''],
			price: '',
			showSelectReviewer: false,
			slideFrom: 'bottom',
			givers: [],
			reviewerId: -1,
		};

		const givers = feathersClient.service('givers');
    givers.find({
      query: {
        $limit: 100,
        $sort: {
          completion_date: 1
        }
      }
    }).then( response => {
      const givers = response.data;
      this.setState({givers});
    });

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleRequirementChange = this.handleRequirementChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.addRequirement = this.addRequirement.bind(this);
		this.selectReviewer = this.selectReviewer.bind(this);
		this.exitView = this.exitView.bind(this);
		this.reviewerSelected = this.reviewerSelected.bind(this);
		this.saveMilestone = this.saveMilestone.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			milestones: nextProps.milestones
		})
	}

	handleNameChange(e) {
		e.preventDefault();
		this.setState({
			name: e.target.value,
		})
	}

	handleDescriptionChange(e) {
		e.preventDefault();
		this.setState({
			description: e.target.value,
		})
	}

	handleRequirementChange(e) {
		var {reqs} = this.state;
		reqs[e.target.id] = e.target.value;
		this.setState(reqs);
	}

	handlePriceChange(e) {
		e.preventDefault();
		this.setState({
			price: e.target.value,
		})
	}

	addRequirement() {
		var {reqs} = this.state;
		reqs.push('');
		this.setState({ reqs });
	}

	selectReviewer() {
		this.setState({
			showSelectReviewer: true,
		})
	}

	exitView() {
		this.setState({
			showSelectReviewer: false,
		})
	}

	reviewerSelected(reviewerId) {
		this.setState({
			reviewerId: reviewerId,
			showSelectReviewer: false,
		})
	}

	saveMilestone() {
		feathersClient.service('milestones').create({
      name: this.state.name,
      description: this.state.description,
      image: 'image value here',
      completion_date: '',
      completion_requirements: this.state.reqs.filter(function(req) {
				return req !== '';
			}),
      evidence: [],
      completion_status: "in progress",
      requirements_complete: this.state.reqs.map(function(req) {
					if (req !== '')
						return false;
				}),
      reviewer: this.state.givers[this.state.reviewerId].name
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
		return (
			<div className="container">
				<div className="createMilestone">
					<Header title="PM" />
					<Content>
						<div className="goBack" onClick={ this.props.homeView }>
							{ "< Back to my home view" }
						</div>
						<div className="pageName">Create new milestone</div>
						<div className="scrollableBox">
							<div className="option">
								<div>What is the milestone name?</div>
								<input
									className="input1"
									type="text"
									value={this.state.name}
									onChange={this.handleNameChange}
								/>
							</div>
							<div className="option">
								<div>Quickly describe why you want to do this.</div>
								<textarea
									className="input2"
									value={this.state.description}
									onChange={this.handleDescriptionChange}
								/>
							</div>
							<div className="option">
								<div>What is required for this to be done?</div>
								{
									this.state.reqs.map(function(req, idx) {
										return <div key={idx} className="inputDiv">
											<input
												id={idx}
												className="input3"
												value={req}
												onChange={self.handleRequirementChange}
											/>
										</div>
									})
								}
								<div onClick={this.addRequirement}>+ Add requirement</div>
							</div>
							<div className="option">
								<div>How much are you asking for?</div>
								<input
									className="input4"
									value={this.state.price}
									onChange={this.handlePriceChange}
								/>
							</div>
							<div className="option">
								<div>Reviewer:</div>
								{
									this.state.reviewerId === -1 ?
										<div onClick={this.selectReviewer}>+ Select a reviewer</div> :
										<div className="reviewerName">{this.state.givers[this.state.reviewerId].name}</div>
								}
							</div>
							<div className="saveDiv">
								<input
									type="button"
									value="Save"
									onClick={this.saveMilestone}
								/>
							</div>
						</div>
					</Content>
				</div>
				<SelectReviewer
					givers={this.state.givers}
					show={this.state.showSelectReviewer}
					exitView={this.exitView}
					selectReviewer={this.reviewerSelected}
				/>
			</div>
		);
	}
}

export default CreateMilestone;
