import React, {Component} from 'react';
import './ContentSlider.css';

class ContentSlider extends Component {

	render() {
		var newChildren = this.props.children.map(function(child) {
			return React.cloneElement(child, { className: 'slider-item'});
		});
		var innerStyle = {
			height: '100%',
			top: (this.props.index * 100 * -1) + '%'
		};

		return <div className="slider-outer" >
        <div className="slider-inner" style={innerStyle} >
          {newChildren}
        </div>
      </div>;
	}

}

export default ContentSlider;
