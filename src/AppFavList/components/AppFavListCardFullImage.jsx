import React, { Component } from 'react';

import favStorage from '../modules/storage.js';

// events: 'AppFavListCard.updated'
class AppFavListCardFullImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _isDeleted: false
        };
    }

    changeCardImgInStorage = (event) => {
        
        let storageObj = favStorage('favListStorage').get();
        
        let thisItemId = this.props.id;
        
        for(let item of storageObj.items) {
            
            if ( item.id === thisItemId ) {
                item.imgFav.webImgUrl = event.target.parentElement.parentElement.querySelector('img').src;
            }
        }
        
        favStorage('favListStorage').set(storageObj);
        this._event('updated');
    }

    deleteImgInStorage = (event) => {
        
        let storageObj = favStorage('favListStorage').get();
        let thisItemId = this.props.id;
        let thisImgSrc = event.target.parentElement.parentElement.querySelector('img').src;
        
        for(let item of storageObj.items) {
            
            if ( item.id === thisItemId ) {
                let imgsArr = item.imgFav.webImgUrlsArr;

                for( let i = 0; i < imgsArr.length; i++ ) {
                    const arrItemSrc = imgsArr[i].link;
                    
                    if( thisImgSrc === arrItemSrc) imgsArr.splice( i, 1 );
                }
            }
        }
        
        favStorage('favListStorage').set(storageObj);
        this._event('updated');

        this.setState({
            _isDeleted: true
        });
    }

    openInNewTab = () => {
        window.open(this.props.src, '_blank');
    }

    _event = (msg) => {
        let event = new Event('AppFavListCard.' + msg);
        document.dispatchEvent(event);
    }

    render() {

        if( this.state._isDeleted ) return null;

        return (
            <div className='favCardFull_imgsContainer'>
                
                <img 
                    src={`${this.props.src}`} 
                    alt="favCardFull_Photo"
                    onClickCapture={ this.openInNewTab }
                />
                
                <div className='optionsBtnSet editImages hideEdit'>
                    
                    <button 
                        className='btn'
                        onClickCapture={ this.changeCardImgInStorage }    
                    >{'set as main'}</button>
                    
                    <button 
                        className='btn btnDanger'
                        onClickCapture={ this.deleteImgInStorage }    
                    >{'del'}</button>

                </div>
            </div>
        );
    }
}

export default AppFavListCardFullImage;