import React, { Component } from 'react';

import StorageItem from '../modules/StorageItem.js';
import formateData from '../modules/formateData.js';
import favStorage from '../modules/storage.js';

// events: 'AppFavListCard.updated'
class AppFavListCardFullDescription extends Component {

    constructor(props) {
        super(props);

        this.dataObj = new StorageItem(this.props.id, 'favListStorage').getItem();

        this.state = {
            _isEdit: false,
            dateAdded: this.dataObj.dateAdded,
            dateEdited: this.dataObj.dateEdited,
            tags: this.dataObj.tags,
            folder: this.dataObj.folder,
            rating: this.dataObj.rating,
            comment: this.dataObj.comment
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

        new StorageItem(this.props.id, 'favListStorage').change(item => {
            item.rating = this.state.rating ? +this.state.rating : 1;
            item.folder = this.state.folder ? this.state.folder : 'unset';
            item.tags = formateData().handleTags(this.state.tags);
            item.comment = this.state.comment;
            item.dateEdited = new Date().toUTCString();
        });

        favStorage('favListStorage').change( storage => {
            storage.folders = formateData().addFolder(storage.folders, this.state.folder);
        } );

        this._event('updated');

        this.setState({
            _isEdit: false,
            tags: formateData().handleTags(this.state.tags)
        })
    }

    renderDate() {
        if (!this.dataObj.dateAdded) return false;

        const dateFormateWrap = date => {
            return new Date(date).toDateString() + ` ${ new Date(date).toTimeString().slice(0,8) }`;
        };

        const added = this.dataObj.dateAdded ? `added: ${ dateFormateWrap(this.dataObj.dateAdded) }` : '';
        const edited = this.dataObj.dateEdited ? `edited: ${ dateFormateWrap(this.dataObj.dateEdited) }` : '';
        return (
            <>
                { added ?  <span>{ added }</span> : null}
                { edited ?  <span>{ edited }</span> : null}
            </>
        );
    }
    
    renderTags() {
        
        const colorStyle = tag => { 
            // const randDeg = Math.trunc( Math.random() * 359 );
            const getDeg = [...tag].map( i => i.charCodeAt()).reduce( ((sum, i) => sum + i), 0) % 359;
            return { 
                color: `hsl(${ getDeg }deg 65% 55%)`,
                backgroundColor: `hsl(${ getDeg }deg 65% 55% / 20%)`
            } 
        };
        
        return [...this.state.tags].map(tag => {
            return ( 
                <span 
                    className='tag' 
                    key={Math.random()}
                    style={colorStyle(tag)}
                >{tag}</span> 
            )
        });
    }

    _event = msg => {

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
                    className='favCardFull_DescriptionForm'
                    onSubmit={this.handleSubmit}
                >
                    <div>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            step={1}
                            id='rating'
                            name='rating'
                            defaultValue={this.state.rating}
                            onChange={e => this.handleChange(e)}
                            placeholder={'rating'}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            id='folder'
                            name='folder'
                            defaultValue={this.state.folder}
                            placeholder={'folder'}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <textarea
                            type="text"
                            id='tags'
                            name='tags'
                            defaultValue={this.state.tags}
                            placeholder={'tags'}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <textarea
                            type="text"
                            id='comment'
                            name='comment'
                            defaultValue={this.state.comment}
                            placeholder={'comment'}
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
                <div className='favCardFull_DateAdded'>
                    { this.renderDate() }
                </div>
                <div className='favCardFull_Rating'>
                    <span className='sectionHeader'>{'rating:'}</span>
                    {`${this.state.rating}`}
                </div>
                <div className='favCardFull_Folder'>
                    <span className='sectionHeader'>{'folder:'}</span>
                    {`${this.state.folder}`}
                </div>
                <div className='favCardFull_Tags'>
                    <span className='sectionHeader'>{'tags:'}</span>
                    { this.renderTags() }
                </div>
                <div className='favCardFull_Comment'>
                    <span className='sectionHeader'>{'comment:'}</span>
                    {`${this.state.comment}`}
                </div>

                <div className='optionsBtnSet'>
                    <button
                        className='btn btnEdit hideEdit'
                        onClickCapture={this.changeDisplayTrigger}
                    >{'edit description'}</button>
                </div>
            </>
        );
    }
}

export default AppFavListCardFullDescription;