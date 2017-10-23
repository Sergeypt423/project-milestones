import React, {Component} from 'react';
import './styles.css';
import Header from '../Header';
import Content from '../Content';
import Item from '../Item';

class SearchMilestones extends Component {

	constructor(props) {
		super(props);

		this.state = {
			milestones: this.props.milestones,
			filter: '',
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			milestones: nextProps.milestones
		})
	}

	handleInputChange(e) {
		e.preventDefault();
		this.setState({
			filter: e.target.value,
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

	contain(text, filter) {
		var lowerText = text.toLowerCase();
		var lowerFilter = filter.toLowerCase();
		return lowerText.indexOf(lowerFilter) !== -1;
	}

	render() {
		var self = this;
		var milestones = this.state.milestones;
		return (
			<div className="searchMilestones">
				<Header title="PM" />
				<Content>
					<div className="goBack" onClick={ this.props.homeView }>
						{ "< Back to my home view" }
					</div>
					<div className="pageName">Search new milestones</div>
					<div className="searchBox">
						<input
							type="text"
							placeholder="Search reviewer username"
							value={this.state.filter}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className="scrollableBox">
						{milestones.map(function(milestone, idx) {
							var details, state;
							details = self.getDetailsFromMilestone( milestone );
							state = 0;
							if (milestone.completion_status === 'approved')
								state = 1;
							if (milestone.completion_status === 'rejected')
								state = 2;
							if (!self.contain(milestone.name, self.state.filter))
								return null;
							return <Item
								Icon='fa-heart'
								key={idx}
								Title={ milestone.name }
								Details={ details }
								Link="View"
								index={idx}
								state={state}
							/>
						})}
					</div>
				</Content>
			</div>
		);
	}
}

export default SearchMilestones;
