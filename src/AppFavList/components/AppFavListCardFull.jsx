import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
import StorageItem from '../modules/StorageItem.js';

import AppFavListCardFullImage from './AppFavListCardFullImage.jsx';
import AppFavListCardFullName from './AppFavListCardFullName.jsx';
import AppFavListCardFullDescription from './AppFavListCardFullDescription.jsx';
import AppFavListCardFullAddImages from './AppFavListCardFullAddImages.jsx';

// events: 'AppFavListCard.updated'
class AppFavListCardFull extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _update: false,
            isDeleted: false,
            dataObj: new StorageItem(this.props.id, 'favListStorage').getItem()
        };
    }

    componentDidMount() {
        document.addEventListener('AppFavListCard.updated', this.update);
    }

    componentWillUnmount() {
        document.removeEventListener('AppFavListCard.updated', this.update);
    }

    changeCardImgInStorage = (event) => {

        new StorageItem(this.state.dataObj.id, 'favListStorage').change( item => {
            item.imgFav.webImgUrl = event.target.parentElement.parentElement.querySelector('img').src;
        } );

        this._event('updated');
    }

    renderImgs(isPlaceholder) {
        
        let imgsUrlArr = new StorageItem(this.props.id, 'favListStorage').getItem().imgFav.webImgUrlsArr;
        
        return imgsUrlArr.map((item, index) => {
           
            if (isPlaceholder) item.link = 'img/unknownPhoto.png';
            
            return ( <AppFavListCardFullImage 
                src={ item.link }
                id={ this.state.dataObj.id }
                key={ index }
            /> );
        });
    }

    deleteThisCardFromStorage = () => {

        new StorageItem(this.props.id, 'favListStorage').deleteItem();

        this._event('updated');

        this.setState({
            isDeleted: true
        });
    }

    update = () => {
        this.setState({});
    }

    _storageEdited = () => {
        favStorage('favListStorage').change( storage => {
            storage.editedDate = new Date().toUTCString();
        } );
    }

    _event = (msg) => {

        if( msg === 'updated' ) this._storageEdited();

        let event = new Event('AppFavListCard.' + msg);
        document.dispatchEvent(event);
    }

    render() {

        let dataObj = this.state.dataObj;

        if( this.state.isDeleted ) {
            return null;
        }

        return (
            <div
                className='favCardFullContainer'
                style={{ top: window.pageYOffset }}
            >
                <article className='favCardFull'>
                    <aside>
                        <button
                            className='favCardFull_BtnClose btn'
                            onClickCapture={ this.props.callbackFunc }
                        ><span>+</span></button>
                    </aside>
                    <header>
                        
                        <AppFavListCardFullName id={ dataObj.id } />

                        <div className='favCardFull_imgHeader'>
                            <img
                                src={`${dataObj.imgFav.webImgUrl}`}
                                alt="favListPhoto"
                                width={176}
                            />
                        </div>

                        <div className='optionsBtnSet'>
                            <button
                                className='btn btnDanger btnDelete hideEdit'
                                onClickCapture={this.deleteThisCardFromStorage}
                            >{'delete'}</button>
                        </div>
                    </header>
                    <main className='favCardFull_Description'>
                        
                        <AppFavListCardFullDescription id={ dataObj.id }/>
                        
                        <AppFavListCardFullAddImages 
                            id={ dataObj.id }
                        />
                        <div className='favCardFull_Images'>
                            {this.renderImgs()}
                        </div>
                    </main>
                </article>
            </div>
        );
    }
}

export default AppFavListCardFull;