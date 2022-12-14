import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
// import formateData from '../modules/formateData.js';

// events: 'AppFavListDisplay.update'

class AppFavListDisplayOptions extends Component {

    constructor(props) {
        super(props);
        
        const storage = favStorage('favListStorage').get().optionsUI;
        
        this.state = {
            displayMode: storage.displayMode,
            sort: storage.sort,
            currentFolder: storage.currentFolder
        };

        this.clicked = false;
    }

    clickHandle = (e) => {
        if( 'name date rating'.includes(e.target.name) ) {
            this.setState({
                sort: this.state.sort.includes('Up')
                    ? e.target.name + 'Down'
                    : e.target.name + 'Up'
            });
        }

        const storage = favStorage('favListStorage').get();

        if( 'default folders'.includes(e.target.name) ) {
            
            if( e.target.name === storage.optionsUI.displayMode ) return;
            
            this.setState({
                displayMode: e.target.name
            });
        }

        this.clicked = true;
    }

    updateStorage = () => {

        if( !this.clicked ) return;

        favStorage('favListStorage').change( storage => {
            storage.optionsUI = storage.optionsUI ? storage.optionsUI : {};
            storage.optionsUI = Object.assign( storage.optionsUI, this.state );
        } );

        if( this.clicked ) {
            this._event('update');
            this.clicked = false;
        }
    }

    _event(type) {
        let event = new Event('AppFavListDisplay.' + type);
        document.dispatchEvent(event);
    }

    render() {

        this.updateStorage();
        
        return (
            <nav className='AppFavListDisplayOptions'>
                <div className='AppFavListDisplayOptions_section'>
                    <button className='btn' name='default' onClickCapture={this.clickHandle}>{'all items'}</button>
                    <button className='btn' name='folders' onClickCapture={this.clickHandle}>{'folders'}</button>
                </div>
                <div className='AppFavListDisplayOptions_section'>
                    <button className='btn' name='name' onClickCapture={this.clickHandle}>{'name'}</button>
                    <button className='btn' name='date' onClickCapture={this.clickHandle}>{'date'}</button>
                    <button className='btn' name='rating' onClickCapture={this.clickHandle}>{'rating'}</button>
                </div>
                <div className='AppFavListDisplayOptions_section'>
                    <input type="text" name="" id="" placeholder={'Search'}/>
                </div>
            </nav>
        );
    }
}

export default AppFavListDisplayOptions;