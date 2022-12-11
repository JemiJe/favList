import React, { Component } from 'react';

import AppFavListCardFull from './AppFavListCardFull'
import AppFavListCardRating from './AppFavListCardRating'

import StorageItem from '../modules/StorageItem.js';

class AppFavListCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _display: 'short',
            dataObj: () => new StorageItem(this.props.id, 'favListStorage').getItem()
        };

    }

    changeDisplayTrigger = () => {
        this.setState({
            _display: this.state._display === 'short' ? 'full' : 'short'
        });
    }

    renderDate() {
        if (!this.state.dataObj().dateAdded) return false;
        return new Date(this.state.dataObj().dateAdded).toDateString();
    }

    returnToDefaltDisplayCallback = () => {
        this.setState({
            _display: 'short'
        });
        // this.props.updateParentFunc();
        this.update();
    }

    update = () => {
        this.setState({});
    }

    render() {

        let dataObj = this.state.dataObj();

        if (this.state._display === 'short') {
            return (
                <article className='favCard'>
                    <div 
                        className='favCardImageWrapper'
                        onClickCapture={this.changeDisplayTrigger}
                    >
                        <img
                            src={`${dataObj.imgFav.webImgUrl}`}
                            alt="favListPhoto"
                            width={176}
                        />
                        <AppFavListCardRating rating={dataObj.rating}/>
                    </div>
                    <div className='favCardDescription'>
                        
                        <div className='favCardName'>
                            <span>{`${dataObj.nameEng}`}</span><br />
                            <span>{`${dataObj.nameAlt}`}</span>
                        </div>
                    </div>
                    <footer>
                        <div className='favCardDateAdder'>{`${dataObj.dateAdded ? this.renderDate() : 'unknown'}`}</div>
                    </footer>
                </article>
            );
        }

        if (this.state._display === 'full') {
            return (
                <AppFavListCardFull
                    id={dataObj.id}
                    callbackFunc={this.returnToDefaltDisplayCallback}
                />
            );
        }
    }
}

export default AppFavListCard;