import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
// import formateData from '../modules/formateData.js';

// events: 'AppFavListDisplay.update' 'AppFavListDisplay.searching'(dataObj = value)

class AppFavListDisplayOptions extends Component {

    constructor(props) {
        super(props);
        
        const storage = favStorage('favListStorage').get().optionsUI;
        
        this.state = {
            displayMode: storage.displayMode,
            sort: storage.sort,
            searchValue: ''
        };

        this.clicked = false;
        this.onlySort = false;
    }

    clickHandle = (e) => {

        const storage = favStorage('favListStorage').get();

        if( 'name added rating edited'.includes(e.target.name) ) {
            
            if( storage.optionsUI.displayMode === 'folders' ) return;

            this.onlySort = true;
            
            this.setState({
                sort: this.state.sort.includes('Up')
                    ? e.target.name + 'Down'
                    : e.target.name + 'Up',
                // displayMode: 'currentFolder'        
            });
        }

        if( 'default folders'.includes(e.target.name) ) {
            
            if( e.target.name === storage.optionsUI.displayMode ) return;

            this.onlySort = false;
            
            this.setState({
                displayMode: e.target.name
            });
        }

        [...document.querySelectorAll('.btnSpec')].forEach( elem => elem.classList.remove('btnSpec'));
        e.target.classList.add('btnSpec');

        this.clicked = true;
    }

    updateStorage = () => {

        if( !this.clicked ) return;

        favStorage('favListStorage').change( storage => {
            
            storage.optionsUI = storage.optionsUI ? storage.optionsUI : {};
            
            if( this.onlySort ) {
                storage.optionsUI.sort = this.state.sort;
            }
            else {
                storage.optionsUI = Object.assign( storage.optionsUI, this.state );
            }
        } );

        if( this.clicked ) {
            this._event('update');
            this.clicked = false;
        }
    }

    handleChange(e) {
        
        if( e.target.name === 'searchValue' ) {
            let { name, value } = e.target;

            this._event( 'searching', value );

            this.setState({
                [name]: value
            });
        }
    }

    _event(type, data) {
        let event = new Event('AppFavListDisplay.' + type);
        event.dataObj = data;
        document.dispatchEvent(event);
    }

    render() {

        this.updateStorage();
        
        return (
            <nav className='AppFavListDisplayOptions'>
                <div className='AppFavListDisplayOptions_section'>
                    {/* <span className='AppFavListDisplayOptions_sectionLabel'>ITEMS</span> */}
                    <button className='btn' name='default' onClickCapture={this.clickHandle}>{'all items'}</button>
                    <button className='btn' name='folders' onClickCapture={this.clickHandle}>{'folders'}</button>
                </div>
                <div className='AppFavListDisplayOptions_section'>
                    {/* <span className='AppFavListDisplayOptions_sectionLabel'>SORT</span> */}
                    <button className='btn' name='name' onClickCapture={this.clickHandle}>{'name'}</button>
                    <button className='btn' name='edited' onClickCapture={this.clickHandle}>{'edited'}</button>
                    <button className='btn' name='added' onClickCapture={this.clickHandle}>{'added'}</button>
                    <button className='btn' name='rating' onClickCapture={this.clickHandle}>{'rating'}</button>
                </div>
                <div className='AppFavListDisplayOptions_section'>
                    {/* <span className='AppFavListDisplayOptions_sectionLabel'>SEARCH</span> */}
                    <input
                        onChange={e => this.handleChange(e)} 
                        type="text" 
                        name="searchValue"
                        id="searchValue"
                        placeholder='Search...'
                    />
                </div>
            </nav>
        );
    }
}

export default AppFavListDisplayOptions;