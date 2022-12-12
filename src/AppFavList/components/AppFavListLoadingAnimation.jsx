import React, { Component } from 'react';

// need key={Math.random()} each time when uses
// need to set top/bottom left/rigth in props.style in parent
class AppFavListLoadingAnimation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRun: this.props.test ? true : this.props.isRun
        };

        this.styleContainerElem = Object.assign({
            position: 'absolute',
            display: 'none',
            alignItems: 'center',
            color: '#ffff00',
        }, this.props.style);

        this.styleIndicator = {
            lineHeight: '0.85em',
            width: '0.4em',
            height: '0.4em',
            fontSize: '5em',
        };

        this.styleText = {
            padding: '0 0.5em'
        };

        this.animationStyle = {
            display: 'block',
            transition: '1s',
            animation: `${this.props.animationCssNames} 3s infinite`,
            animationTimingFunction: 'ease-out',
        };

    }

    applyAnimation = animationName => {
        return {
            display: 'block',
            transition: '1s',
            animation: `${animationName} 3s infinite`,
            animationTimingFunction: 'ease-out',
        }
    }

    render() {

        let styleIndicator = this.styleIndicator;
        let styleText = this.styleText;

        if(this.state.isRun) {
            styleIndicator = Object.assign( styleIndicator, this.applyAnimation(this.props.animationCssNames[0]) );
            styleText = Object.assign( styleText, this.applyAnimation(this.props.animationCssNames[1]) );
            this.styleContainerElem.display = 'flex';
        }

        return (
            <div style={this.styleContainerElem}>
                <span 
                    className='loadingIndicator'
                    style={ styleIndicator }
                >
                    {'*'}
                </span>
                <span 
                    style={ styleText }
                >
                    {this.props.text ? this.props.text : ''}
                </span>
            </div>
        );
    }
}

export default AppFavListLoadingAnimation;