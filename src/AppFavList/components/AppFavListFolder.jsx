import React, { Component } from 'react';

import favStorage from '../modules/storage.js';

// events: AppFavListFolder.open
// event.folderName
class AppFavListFolder extends Component {

    update = () => {
        this.setState({});
    }

    openFolder = () => {

        favStorage('favListStorage').change( storage => {
            storage.optionsUI.displayMode = 'currentFolder';
            storage.optionsUI.currentFolder = this.props.data.name;
        } );

        this._event('open', this.props.data.name);
    }

    _event(type, folderName) {
        let event = new Event('AppFavListFolder.' + type);
        event.folderName = folderName;
        document.dispatchEvent(event);
    }

    _getRandomColorStyle(baseColor) {
        // let randDeg = Math.trunc( 359 * Math.random() );

        return {
            color: 'green',
            backgroundColor: 'green'
        };
    }

    folderItemsAmout() {
        let items = favStorage('favListStorage').get().items;
        let folderItems = items.filter( item => item.folder === this.props.data.name );
        return folderItems.length;
    }

    render() {

        return (
            <article 
                className='favFolder'
                onClickCapture={ this.openFolder }
            >
                <div className='favFolder_Name'>{ this.props.data.name }</div>
                <div className='favFolder_Size'>{ this.folderItemsAmout() }</div>
            </article>
        );
    }
}

export default AppFavListFolder;