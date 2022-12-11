import React, { Component } from 'react';

// import favStorage from '../modules/storage.js';
import StorageItem from '../modules/StorageItem.js';

// events: 'AppFavListCard.updated'
class AppFavListCardFullDescription extends Component {

    constructor(props) {
        super(props);

        this.dataObj = new StorageItem(this.props.id, 'favListStorage').getItem();

        this.state = {
            _isEdit: false,
            dateAdded: this.dataObj.dateAdded,
            tags: this.dataObj.tags,
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

    _handleTags(tagsStr) {

        if (!tagsStr.includes(',')) return tagsStr;

        return tagsStr.split(',')
            .map(i => i.trim())
            .filter(i => i !== '');
    }

    handleSubmit = () => {

        // let storageObj = favStorage('favListStorage').get();
        // let thisItem = this.props.dataObj;

        // for (let item of storageObj.items) {
        //     if (item.id === thisItem.id) {
        //         item.rating = +this.state.rating;
        //         item.tags = this._handleTags(this.state.tags);
        //         item.comment = this.state.comment;
        //         item._editDate = new Date().toString();
        //     }
        // }

        // favStorage('favListStorage').set(storageObj);

        new StorageItem(this.props.id, 'favListStorage').change(item => {
            item.rating = +this.state.rating;
            item.tags = this._handleTags(this.state.tags);
            item.comment = this.state.comment;
            item._editDate = new Date().toString();
        });

        this._event('updated');

        this.setState({
            _isEdit: false,
            tags: this._handleTags(this.state.tags)
        })
    }

    renderDate() {
        if (!this.dataObj.dateAdded) return false;
        return new Date(this.dataObj.dateAdded).toDateString();
    }

    _event = (msg) => {
        let event = new Event('AppFavListCard.' + msg);
        document.dispatchEvent(event);
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
                            type="number"
                            min={1}
                            max={5}
                            step={1}
                            id='rating'
                            name='rating'
                            defaultValue={this.state.rating}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <textarea
                            type="text"
                            id='tags'
                            name='tags'
                            defaultValue={this.state.tags}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <textarea
                            type="text"
                            id='comment'
                            name='comment'
                            defaultValue={this.state.comment}
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
                <div className='favCardFull_DateAdder'>
                    {'date added:'}<br/>
                    {`${this.state.dateAdded ? this.renderDate() : 'unknown'}`}
                </div>
                <div className='favCardFull_Rating'>
                    {'rating:'}<br/>
                    {`${this.state.rating}`}
                </div>
                <div className='favCardFull_Tags'>
                    {'tags:'}<br/>
                    {`${this.state.tags}`}
                </div>
                <div className='favCardFull_Comment'>
                    {'comment:'}<br/>
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