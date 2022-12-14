import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
import StorageItem from '../modules/StorageItem.js';

// events: 'AppFavListCard.updated'
class AppFavListCardFullName extends Component {

    constructor(props) {
        super(props);
        
        this.dataObj = new StorageItem(this.props.id, 'favListStorage').getItem();
        
        this.state = {
            _isEdit: false,
            nameEng: this.dataObj.nameEng,
            nameAlt: this.dataObj.nameAlt,
            dataObj: this.dataObj
        };
    }

    changeDisplayTrigger = () => {
        this.setState({
            _isEdit: this.state._isEdit ? false : true
        });
    }

    handleChange(e) {
        let { name, value } = e.target;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {

        new StorageItem(this.props.id, 'favListStorage').change( item => {
            item.nameEng = this.state.nameEng;
            item.nameAlt = this.state.nameAlt;
        } );

        this._event('updated');

        this.setState({
            _isEdit: false
        })
    }

    toggleEditOptions = () => {
        let elemsParent = document.querySelector('.favCardFull');
        let elems = [...elemsParent.querySelectorAll('.btnEdit, .btnDelete, .editImages')];

        for (let elem of elems) {
            elem.classList.toggle('hideEdit');
        }
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

        // let dataObj = this.props.dataObj;

        if (this.state._isEdit) {
            return (
                <form
                    className='favCardFull_Name'
                    onSubmit={this.handleSubmit}
                >
                    <div>
                        <input
                            type="text"
                            id='nameEng'
                            name='nameEng'
                            defaultValue={this.state.nameEng}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            id='nameAlt'
                            name='nameAlt'
                            defaultValue={this.state.nameAlt}
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
                <div className='favCardFull_Name'>
                    <span>{`${this.state.nameEng}`}</span>
                    <span>{`${this.state.nameAlt}`}</span>

                    <button
                        className='btn btnEditModeToggle'
                        onClickCapture={ this.toggleEditOptions }
                    >{'edit'}</button>

                    <div className='optionsBtnSet'>
                        <button
                            className='btn btnEdit hideEdit'
                            onClickCapture={this.changeDisplayTrigger}
                        >{'edit name'}</button>
                    </div>

                </div>
            </>
        );
    }
}

export default AppFavListCardFullName;