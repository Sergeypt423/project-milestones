import React, {Component} from 'react';
import './styles.css';
import AnimateHeight from 'react-animate-height';

class SelectReviewer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
		}

		this.handleChange = this.handleChange.bind(this);
		this.onNameClick = this.onNameClick.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}

	handleExit() {
		this.props.exitView();
	}

	handleSelect() {
		this.props.givers.forEach(function(giver, idx) {
			if (giver.name === this.state.name) {
				this.props.selectReviewer(idx);
				return;
			}
		}, this);
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({
			name: e.target.value,
		});
	}

	onNameClick(e) {
		e.preventDefault();
		this.setState({
			name: this.props.givers[e.target.id].name,
		});
	}

	contain(text, filter) {
		var lowerText = text.toLowerCase();
		var lowerFilter = filter.toLowerCase();
		return lowerText.indexOf(lowerFilter) !== -1;
	}

	render() {
		var self = this;
		return (
			<div className={this.props.show? "selectReviewer-enter" : "selectReviewer"}>
				<AnimateHeight
					duration={ 1000 }
					height={ this.props.show? 'auto' : 0 }>
					
					<div className="fullContainer">
						<div className="innerContainer">
							<div className="space"></div>
							<div className="closeDiv">
								<span onClick={this.props.exitView}>X</span>
							</div>
							<div className="title">
								Select a reviewer
							</div>
							<div className="searchReviewerNameDiv">
								<div className="inputDivLeft">
								<input
									type="text"
									placeholder="Search reviewer name"
									value={this.state.name}
									onChange={this.handleChange}
								/>
								</div>
								<div className="inputDivRight">
								<input
									type="button"
									value="Select"
									onClick={this.handleSelect}
								/>
								</div>
							</div>
							<div className="nameList">
							{
								this.props.givers.map(function(giver, idx) {
									if (self.contain(giver.name, self.state.name))
										return <div className="giverName" key={idx} id={idx} onClick={self.onNameClick}>{giver.name}</div>;
									return null;
								})
							}
							</div>
							<div className="space"></div>
						</div>
					</div>

				</AnimateHeight>
			</div>
		);
	}
}

export default SelectReviewer;
