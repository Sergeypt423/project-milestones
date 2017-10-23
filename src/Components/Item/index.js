import React, {Component} from 'react';
import './styles.css';

class Item extends Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.onView(this.props.index);
	}

	render() {
		var status;
		if (this.props.state === 1)
			status = <span>Approved </span>;
		if (this.props.state === 2)
			status = <span>Rejected </span>;
		return (
			<div className="item" onClick={this.props.isMilestone ? this.handleClick : this.props.onClick}>
				<div className="image">
					<span className={'fa ' + this.props.Icon} />
				</div>
				<div className="item-right">
					<div className="item-title">{status}{this.props.Title}</div>
					<div className="details">{this.props.Details}</div>
					<div className="link">{this.props.Link}</div>
				</div>
			</div>
		);
	}
}

export default Item;
