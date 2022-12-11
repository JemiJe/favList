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

        this.styleAnimElem = {
            lineHeight: '0.85em',
            width: '0.4em',
            height: '0.4em',
            fontSize: '5em',
        };

        this.animationStyle = {
            display: 'block',
            transition: '1s',
            animation: `${this.props.animationCssName} 3s infinite`,
            animationTimingFunction: 'ease-out',
        };

    }

    render() {

        let style = this.styleAnimElem;

        if(this.state.isRun) {
            style = Object.assign(style, this.animationStyle);
            this.styleContainerElem.display = 'flex';
        }

        return (
            <div style={this.styleContainerElem}>
                <span 
                    className='loadingIndicator'
                    style={ style }
                >
                    {'*'}
                </span>
                <span style={{ padding: '0 0.5em' }}>
                    {this.props.text ? this.props.text : ''}
                </span>
            </div>
        );
    }
}

export default AppFavListLoadingAnimation;