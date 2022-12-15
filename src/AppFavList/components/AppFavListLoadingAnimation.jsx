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
            alignSelf: 'flex-start',
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

        this.intervalId = Math.trunc(Math.random() * 999);
        if(!window.favListInterval) window.favListInterval = {};

    }

    applyAnimation = animationName => {
        return {
            display: 'block',
            transition: '1s',
            animation: `${animationName} 3s infinite`,
            animationTimingFunction: 'ease-out',
        }
    }

    dotsAnimation = () => {

        clearInterval(window.favListInterval[this.intervalId]);

        let counter = 0;
        let initialText = this.props.text;
        window.favListInterval[this.intervalId] = setInterval(() => {
            let textElem = document.querySelector(`.loadingText-${this.intervalId}`);
            try {
                textElem.textContent = initialText.slice(0, counter++ % (initialText.length + 1));
            }
            catch {
                return;
            }
        }, 1000 / (initialText.length + 5));
    }

    render() {

        let styleIndicator = this.styleIndicator;
        let styleText = this.styleText;

        if(this.state.isRun) {
            styleIndicator = Object.assign( styleIndicator, this.applyAnimation(this.props.animationCssNames[0]) );
            styleText = Object.assign( styleText, this.applyAnimation(this.props.animationCssNames[1]) );
            this.styleContainerElem.display = 'flex';
            if(!window.favListInterval[this.intervalId]) this.dotsAnimation();
        } else {
            clearInterval(window.favListInterval[this.intervalId]);
            window.favListInterval[this.intervalId] = false;
        }

        return (
            <div
                className='favList_loadingAnimation' 
                style={this.styleContainerElem}
            >
                <span 
                    className='loadingIndicator'
                    style={ styleIndicator }
                >
                    {'*'}
                </span>
                <span className={`loadingText-${this.intervalId}`}
                    style={ styleText }
                >
                    {this.props.text ? this.props.text : ''}
                </span>
            </div>
        );
    }
}

export default AppFavListLoadingAnimation;