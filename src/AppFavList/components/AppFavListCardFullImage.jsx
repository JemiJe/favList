import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
import StorageItem from '../modules/StorageItem.js';

// events: 'AppFavListCard.updated'
class AppFavListCardFullImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _isDeleted: false
        };
    }

    changeCardImgInStorage = (event) => {

        new StorageItem(this.props.id, 'favListStorage').change( item => {
            item.imgFav.webImgUrl = event.target.parentElement.parentElement.querySelector('img').src;
        } );
        
        this._event('updated');
    }

    deleteImgInStorage = (event) => {
        
        let thisImgSrc = event.target.parentElement.parentElement.querySelector('img').src;

        new StorageItem(this.props.id, 'favListStorage').change( item => {
            let imgsArr = item.imgFav.webImgUrlsArr;

            for( let i = 0; i < imgsArr.length; i++ ) {
                const arrItemSrc = imgsArr[i].link;
                
                if( thisImgSrc === arrItemSrc) imgsArr.splice( i, 1 );
            }
        } );
        
        this._event('updated');

        this.setState({
            _isDeleted: true
        });
    }

    openInNewTab = () => {
        window.open(this.props.src, '_blank');
    }

    _event = (msg) => {

        if(msg === 'updated') this._storageEdited();

        let event = new Event('AppFavListCard.' + msg);
        document.dispatchEvent(event);
    }

    _storageEdited = () => {
        favStorage('favListStorage').change( storage => {
            storage.editedDate = new Date().toUTCString();
        } );
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