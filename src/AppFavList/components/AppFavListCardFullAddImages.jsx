import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
import StorageItem from '../modules/StorageItem.js';
import googleCustomSeachFetch from '../modules/googleCustomSeachFetch.js';

// events: 'AppFavListCard.updated'
class AppFavListCardFullAddImages extends Component {

    constructor(props) {
        super(props);

        this.dataObj = new StorageItem(this.props.id, 'favListStorage').getItem();
        this.imageSearchCounter = 0;

        this.state = {
            _mode: 'initial',
            newImgSrc: '',
            googleCustomSearchArr: favStorage('favListStorage').get().optionsJSON.googleCustomSearch
        };
    }

    changeDisplayTrigger = (state) => {
        this.setState({
            _mode: state
        });
    }

    handleChange(e) {
        let { name, value } = e.target;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {

        if (this.state._mode === 'addNewImage') {
            this.addNewImageToStorage();
        }

        this.setState({
            _mode: 'initial'
        });
    }

    seachImageByGoogleCustomSearch = e => {

        if( this.imageSearchCounter > 91 ) {
            this.imageSearchCounter = 0;
        }

        let searchInit = new googleCustomSeachFetch({
            key: this.state.googleCustomSearchArr[0].apiKey,
            cx: this.state.googleCustomSearchArr[0].cx,
            searchType: 'image',
            start: 1 + this.imageSearchCounter
        });

        let { nameEng, nameAlt } = this.dataObj;

        let name = [nameEng, nameAlt]
            .map( item => item.replace('?', '') )
            .filter( item => item !== '' );

        document.querySelector('.loadingIndicator').classList.add( 'addingImagesAnimation' );

        searchInit.getImagesFetch(name)
            .then(data => {
                this.addNewImageToStorage(data);

                document.querySelector('.loadingIndicator').classList.remove( 'addingImagesAnimation' );

                this.setState({
                    _mode: 'initial'
                });
            });
    }

    addNewImageToStorage(addArray) {

        new StorageItem(this.props.id, 'favListStorage').change( item => {
            
            if (addArray) {

                for (let imgItem of addArray) {
                    item.imgFav.webImgUrlsArr.unshift(imgItem);
                }

                if( item.imgFav.hasOwnProperty( 'prevImagePageCounter' ) ) {   
                    this.imageSearchCounter = item.imgFav.prevImagePageCounter;
                } else {
                    item.imgFav.prevImagePageCounter = this.imageSearchCounter;
                }

                this.imageSearchCounter += 10;
                item.imgFav.prevImagePageCounter = this.imageSearchCounter;

            } else {

                item.imgFav.webImgUrlsArr.unshift({
                    link: this.state.newImgSrc,
                    kind: 'favList user added'
                });
            }
        } );

        this._event('updated');

        // let storageObj = favStorage('favListStorage').get();
        // let thisItem = this.props.dataObj;

        // for (let item of storageObj.items) {
        //     if (item.id === thisItem.id) {

        //         if (addArray) {

        //             for (let imgItem of addArray) {
        //                 item.imgFav.webImgUrlsArr.unshift(imgItem);
        //             }

        //             if( item.imgFav.hasOwnProperty( 'prevImagePageCounter' ) ) {   
        //                 this.imageSearchCounter = item.imgFav.prevImagePageCounter;
        //             } else {
        //                 item.imgFav.prevImagePageCounter = this.imageSearchCounter;
        //             }

        //             this.imageSearchCounter += 10;
        //             item.imgFav.prevImagePageCounter = this.imageSearchCounter;

        //         } else {

        //             item.imgFav.webImgUrlsArr.unshift({
        //                 link: this.state.newImgSrc,
        //                 kind: 'favList user added'
        //             });
        //         }
        //     }
        // }

        // favStorage('favListStorage').set(storageObj);
    }

    _event = (msg) => {
        let event = new Event('AppFavListCard.' + msg);
        document.dispatchEvent(event);
    }

    render() {

        if (this.state._mode === 'addNewImage') {
            return (
                <form
                    className='favCardFull_DescriptionAddNewImagesForm'
                    onSubmit={() => this.handleSubmit()}
                >
                    <div>
                        <input
                            type="text"
                            id='newImgSrc'
                            name='newImgSrc'
                            placeholder='image url'
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='optionsBtnSet'>
                        <button
                            type="submit"
                            className='btn'
                        >{'ок'}</button>
                    </div>
                </form>
            );
        }

        return (
            <>
                <div className='optionsBtnSet' style={{position: 'relative'}}>

                    <button
                        className='btn btnEdit hideEdit'
                        onClickCapture={() => this.setState({ _mode: 'addNewImage' })}
                    >{'add new images'}</button>

                    <button
                        className='btn btnEdit hideEdit'
                        onClickCapture={this.seachImageByGoogleCustomSearch}
                    >{'auto search images'}</button>

                    <span className='loadingIndicator'>{'*'}</span>
                </div>
            </>
        );
    }
}

export default AppFavListCardFullAddImages;