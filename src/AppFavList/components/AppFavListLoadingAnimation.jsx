import React, { Component } from 'react';

// need key={Math.random()} each time when uses
class AppFavListLoadingAnimation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRun: this.props.isRun
        };

        this.style = Object.assign({
            display: 'none',
            position: 'absolute',
            lineHeight: '0.85em',
            width: '0.4em',
            height: '0.4em',
            fontSize: '5em',
            color: '#ffff00',
        }, this.props.style);

        this.animationStyle = {
            display: 'block',
            transition: '1s',
            animation: `${this.props.animationCssName} 3s infinite`,
            animationTimingFunction: 'ease-out',
        };

    }

    render() {

        let style = this.style;

        if(this.state.isRun) {
            style = Object.assign(style, this.animationStyle);
        }

        return (
            <span 
                className='loadingIndicator'
                style={ style }
            >
                {'*'}
            </span>
        );
    }
}

export default AppFavListLoadingAnimation;