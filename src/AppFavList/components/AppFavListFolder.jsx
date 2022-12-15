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

    _getColorStyle = (baseColorHSLA, isRandom) => { // example: hsl(199deg 65% 55% / 93%)

        if( this.props.data.name === 'unset' ) {
            return {
                color: 'hsl(199deg 55% 35%)',
                backgroundColor: 'hsl(199deg 55% 30% / 10%)'
            };
        }

        let deg = isRandom ? Math.trunc( 359 * Math.random() ) : ( this.props.data.size  * 20) % 359;
        let [ s, l, a ] = baseColorHSLA.match( /\d\d%/gm ).map( num => parseInt(num));

        return {
            color: `hsl(${deg}deg ${s}% ${l}% / ${a}%)`,
            backgroundColor: `hsl(${deg}deg ${s}% ${l - 40}% / ${a - 60}%)`
        };
    }

    // folderItemsAmout() {
    //     let items = favStorage('favListStorage').get().items;
    //     let folderItems = items.filter( item => item.folder === this.props.data.name );
    //     return folderItems.length;
    // }

    render() {

        return (
            <article 
                className='favFolder'
                onClickCapture={ this.openFolder }
                style={ this._getColorStyle( this.baseColor ) }
            >
                <div className='favFolder_Name'>{ this.props.data.name }</div>
                <div className='favFolder_Size'>{ this.props.data.size }</div>
            </article>
        );
    }
}

export default AppFavListFolder;