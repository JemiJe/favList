import React, { Component } from 'react';

import favStorage from '../modules/storage.js';

// events on each chage: 'AppFavListFolder.updated' 
// exact events: AppFavListFolder.open AppFavListFolder.renamed AppFavListFolder.deleted AppFavListFolder.deletedPermanent
// event.folderName
class AppFavListFolder extends Component {

    constructor(props) {
        super(props);
        this.baseColor = 'hsl(199deg 65% 55% / 93%)';
        this.state = {
            rename: false,
        }
    }

    update = () => {
        this.setState({});
    }

    openFolder = e => {

        // if ('favFolder_renameForm renameFolderInput btn'.includes(e.target.classList.value)) return;
        if (e.target.parentElement.classList.value === 'optionsBtnSet'
            || e.target.id === 'renameFolderValue'
            || e.target.id === 'renameFolderBtn' ) return;

        favStorage('favListStorage').change(storage => {
            storage.optionsUI.displayMode = 'currentFolder';
            storage.optionsUI.currentFolder = this.props.data.name;
        });

        this._event('open');
    }

    deleteFolder = () => {
        favStorage('favListStorage').change(storage => {
            
            storage.items = storage.items
                .map(item => {
                    if( item.folder === this.props.data.name ) {
                        item.folder = 'unset';
                    }
                    return item;
                });

            for(let i = 0; i < storage.folders.length; i++) {
                if( storage.folders[i].name === this.props.data.name ) {
                    storage.folders.splice(i, 1);
                }
            }
        });

        this._event('deleted');
    }

    renameFolder = () => {
        favStorage('favListStorage').change(storage => {
            storage.items = storage.items
                .map(item => {
                    if( item.folder === this.props.data.name ) {
                        item.folder = this.state.renameFolderValue;
                    }
                    return item;
                });
        });

        this._event('renamed');

        this.setState({
            rename: false
        })
    }

    deleteItemsForever = () => {
        favStorage('favListStorage').change(storage => {
            
            for(let i = 0; i < storage.items.length; i++) {
                if(storage.items[i].folder === this.props.data.name) {
                    storage.items.splice(i,1);
                }
            }
        });

        this._event('deletedPermanent');
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    _event(type) {
        let event = new Event('AppFavListFolder.' + type);
        event.folderName = this.props.data.name;
        document.dispatchEvent(event);
        
        let event2 = new Event('AppFavListFolder.updated');
        event2.folderName = this.props.data.name;
        document.dispatchEvent(event2);
    }

    _getColorStyle = (baseColorHSLA, isRandom) => { // example: hsl(199deg 65% 55% / 93%)

        if (this.props.data.name === 'unset') {
            return {
                color: 'hsl(199deg 55% 35%)',
                backgroundColor: 'hsl(199deg 55% 30% / 10%)'
            };
        }

        let deg = isRandom ? Math.trunc(359 * Math.random()) : (this.props.data.size * 20) % 359;
        let [s, l, a] = baseColorHSLA.match(/\d\d%/gm).map(num => parseInt(num));

        return {
            color: `hsl(${deg}deg ${s}% ${l}% / ${a}%)`,
            backgroundColor: `hsl(${deg}deg ${s}% ${l - 40}% / ${a - 60}%)`
        };
    }

    _renameForm = () => {
        this.setState({
            rename: true,
        });
    }

    _btnSet = (isUnset) => {
        return (
            <div className='optionsBtnSet'>

                { !isUnset && <button
                    className='btn'
                    onClickCapture={this._renameForm}
                >{'rename'}</button> }

                { !isUnset && <button
                    className='btn btnDanger btnDelete'
                    onClickCapture={this.deleteFolder}
                >{'delete'}</button> }

                { isUnset && <button
                    className='btn btnDanger btnDelete'
                    onClickCapture={this.deleteItemsForever}
                >{'delete all items'}</button> }
            </div>
        );
    }

    render() {

        return (
            <article
                className='favFolder'
                onClickCapture={this.openFolder}
                style={this._getColorStyle(this.baseColor)}
            >
                <div className='favFolder_Name'>{this.props.data.name}</div>
                <div className='favFolder_Size'>{this.props.data.size}</div>

                {(this.props.data.name !== 'unset' && !this.state.rename)
                    && this._btnSet()}

                {(this.props.data.name === 'unset' && !this.state.rename)
                    && this._btnSet(true)}

                {this.state.rename
                    && <div className='favFolder_renameForm'>
                        <input
                            type="text"
                            className='renameFolderInput'
                            name="renameFolderValue"
                            id="renameFolderValue"
                            defaultValue={this.props.data.name}
                            onChangeCapture={this.handleChange}
                        />
                        <button
                            id='renameFolderBtn'
                            className='btn'
                            onClickCapture={this.renameFolder}
                        >{'OK'}</button>
                    </div>}
            </article>
        );
    }
}

export default AppFavListFolder;