import React, { Component } from 'react';

import favStorage from '../modules/storage.js';

// events: AppFavListFolder.open
// event.folderName
class AppFavListFolder extends Component {

    constructor(props) {
        super(props);
        this.baseColor = 'hsl(199deg 65% 55% / 93%)';
    }

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

    _getRandomColorStyle = baseColorHSLA => { // example: hsl(199deg 65% 55% / 93%)
        
        let randDeg = Math.trunc( 359 * Math.random() );
        let [ s, l, a ] = baseColorHSLA.match( /\d\d%/gm ).map( num => parseInt(num));

        return {
            color: `hsl(${randDeg}deg ${s}% ${l}% / ${a}%)`,
            backgroundColor: `hsl(${randDeg}deg ${s}% ${l - 40}% / ${a - 60}%)`
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
                style={ this._getRandomColorStyle( this.baseColor ) }
            >
                <div className='favFolder_Name'>{ this.props.data.name }</div>
                <div className='favFolder_Size'>{ this.folderItemsAmout() }</div>
            </article>
        );
    }
}

export default AppFavListFolder;