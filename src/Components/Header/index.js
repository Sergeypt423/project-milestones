import React, {Component} from 'react';
import './styles.css';

class Header extends Component {

		render() {
				return (
						<div className="header">
							<span>{this.props.title}</span>
						</div>
				);
		}
}

export default Header;
