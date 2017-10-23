import React, {Component} from 'react';
import './ReviewMilestone.css';
import ContentSlider from '../ContentSlider';
import {feathersClient} from '../feathersClient';

class ReviewMilestone extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showQuiz: true,
			quizId: 0,
			milestone: [],
			option: 'approved',
			reason: '',
		}

		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.handleReasonChange = this.handleReasonChange.bind(this);
		this.submitReview = this.submitReview.bind(this);
		this.tick = this.tick.bind(this);
		this.handleExit = this.handleExit.bind(this);
	}

	handleExit() {
		this.props.exitReview();

		this.timer = setInterval(this.tick, 500);
	}

	tick() {
		this.setState({
			showQuiz: true,
			quizId: 0,
			milestone: [],
			option: 'approved',
			reason: '',
		});
		clearInterval(this.timer);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			milestone: nextProps.milestone,
		})
	}
	
	handleOptionChange(e) {
		this.setState({
			option: e.target.value,
		})
	}

	handleReasonChange(e) {
		this.setState({
			reason: e.target.value,
		})
	}

	answer(id, ans) {
		var {quizId, milestone, showQuiz} = this.state;
		milestone.requirements_complete[id] = ans;
		quizId ++;
		if (quizId === milestone.completion_requirements.length)
			showQuiz = false;
		this.setState({ quizId, milestone, showQuiz });
	}

	submitReview() {
		var {milestone, option} = this.state;
		if (option !== 'extend') {
			milestone.completion_status = option;
		}

		const milestones = feathersClient.service('milestones');
		milestones.update(milestone._id, milestone).then((updatedItem) => {
      this.props.exitReview();
		});
		
		this.timer = setInterval(this.tick, 500);
	}

	render() {

		var self = this;
		var milestone = this.props.milestone;
		if (milestone === undefined)
			return null;

		const style = {
								height: '6rem',
								width: '100%',
								resize:'none',
								boxSizing:'border-box'};
		
		if (this.state.showQuiz) {
			return (
				<div className="reviewMilestone">
					<div className="inside">
						<div className="space"></div>
						<div className="close">
							<span onClick={this.handleExit}>X</span>
						</div>
						<div className="title">
							{ 'Review milestone for ' + milestone.name }
						</div>
						<div className="subtitle">
							Answer honestly, don’t worry your approval decision is made at the end.
						</div>
						<div className="quizarea">
							<ContentSlider index={this.state.quizId}>
							{
								milestone.completion_requirements.map(function(req, id) {
									return <div key={id} className='quiz'>
											<div className='question'>
												Is this requirement complete?
											</div>
											<div className='requirement'>
												{req}
											</div>
											<div className='buttons'>
												<div className='yes round-div' onClick={() => {self.answer(id, true)}}>
													<div className="icon">
														<span className={'fa fa-heart'} />
													</div>
													<div className='option'>
														Totally
													</div>
												</div>
												<div className='no round-div' onClick={() => {self.answer(id, false)}}>
													<div className="icon">
														<span className={'fa fa-heart'} />
													</div>
													<div className='option'>
														Not Really
													</div>
												</div>
											</div>
										</div>;
								})
							}
							</ContentSlider>
						</div>
						<div className="space"></div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div className="reviewMilestone">
					<div className="inside">
						<div className="space"></div>
						<div className="close">
							<span onClick={this.handleExit}>X</span>
						</div>
						<div className="title">
							{ 'Review milestone for ' + milestone.name }
						</div>
						<div className='final-question'>
							Is this milestone complete?
						</div>
						<div className='box'>
							<div className='question'>
								What is your decision?
							</div>
							<form>
								<div className="radio">
									<label>
										<input type="radio" value="approved"
											checked={this.state.option==='approved'}
											onChange={this.handleOptionChange} />
										Approved
									</label>
								</div>
								<div className="radio">
									<label>
										<input type="radio" value="extend"
											checked={this.state.option==='extend'}
											onChange={this.handleOptionChange} />
										Extend deadline to: <span className='select'>select date</span>
									</label>
								</div>
								<div className="radio">
									<label>
										<input type="radio" value='rejected'
											checked={this.state.option==='rejected'}
											onChange={this.handleOptionChange} />
										Reject forever
									</label>
								</div>
							</form>
						</div>
						<div className='box'>
							<div className='question'>
								Reasoning for review:
							</div>
							<div className='reason'>
								<textarea
									style={style}
									value={this.state.reason}
									onChange={this.handleReasonChange} />
							</div>
							<div className='submit'>
								<input type='button' value='Submit review' onClick={this.submitReview} />
							</div>
						</div>
						<div className="space"></div>
					</div>
				</div>
			);
		}
	}
}

export default ReviewMilestone;
