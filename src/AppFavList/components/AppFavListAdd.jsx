import React, { Component } from 'react';

import favStorage from '../modules/storage.js'

// events: 'AppFavListAdd.itemAdded' 'AppFavListAdd.backupRestored'

class AppFavListAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgFav: {
                localImgUrl: '',
                webImgUrl: '',
                webImgUrlsArr: []
            },
            nameEng: '',
            nameAlt: '',
            comment: '',
            tags: '',
            rating: '',
            _display: 'short',
            optionsJSON: JSON.stringify(favStorage('favListStorage').get().optionsJSON, null, 2)
        };
    }

    _handleTags(tagsStr) {

        if (!tagsStr.includes(',')) return tagsStr;

        return tagsStr.split(',')
            .map(i => i.trim())
            .filter(i => i !== '');
    }

    handleChange(e) {
        let { name, value } = e.target;

        if (name === 'imgFav') {
            value = Object.assign(this.state.imgFav, { webImgUrl: value });
        }

        this.setState({
            [name]: value
        });
    }

    clearForm() {
        let formElems = [...document.querySelectorAll(`
            #imgFav, #nameEng, #nameAlt, #comment, #tags, #rating
        `)];

        for (let elem of formElems) {
            elem.value = '';
        }
    }

    handleSubmit = e => {

        e.preventDefault();

        if (this.state._display === 'options') {

            let storage = favStorage('favListStorage').get();

            let insertedOptionsObj = JSON.parse(this.state.optionsJSON);
            storage.optionsJSON = insertedOptionsObj;

            favStorage('favListStorage').set(storage);

            this.setState({
                _display: 'short'
            });

        } else {

            const additionalInfoObj = {
                rating: +this.state.rating,
                tags: this._handleTags(this.state.tags),
                dateAdded: new Date().toString(),
                id: +Math.random().toString().slice(2)
            };

            let storage = favStorage('favListStorage').get();
            storage.items.unshift(Object.assign(this.state, additionalInfoObj));
            favStorage('favListStorage').set(storage);

            this._event('itemAdded');

            this.clearForm();
            this.close();
        }

    }

    restoreBackup = () => {

        favStorage('favListStorage').restore('userBackup');
        this._event('backupRestored');
    }

    _event(type) {
        let event = new Event('AppFavListAdd.' + type);
        document.dispatchEvent(event);
    }

    close = () => {
        this.setState({
            _display: 'short'
        });
    }

    render() {

        if (this.state._display === 'short') {
            return (
                <div className='addFavForm'>
                    <button
                        className='toAddBtn'
                        onClickCapture={() => this.setState({ _display: 'full' })}
                    >{'Add'}</button>
                    <button
                        onClickCapture={() => this.setState({ _display: 'options' })}
                    >{'options'}</button>
                </div>
            );
        }

        if (this.state._display === 'options') {

            return (
                <div className='optionsFormWrapper'>
                    <form
                        className='optionsForm'
                        onSubmit={this.handleSubmit}
                    >
                        <div className='addFavForm__formSection' style={{flexDirection: 'row'}}>  
                            <button
                                className='btn'
                                onClickCapture={ () => favStorage('favListStorage').backup('userBackup') }
                            >{'backup localStorage'}</button>
                            
                            <button
                                className='btn'
                                onClickCapture={ this.restoreBackup }
                            >{'restore lates backup'}</button>
                        </div>

                        <div className='addFavForm__formSection'>
                            <label htmlFor="optionsJSON">{`JSON options`}</label>
                            <textarea
                                type="text"
                                id='optionsJSON'
                                name='optionsJSON'
                                defaultValue={this.state.optionsJSON}
                                onChange={e => this.handleChange(e)}
                            />

                            <button
                                type="submit"
                                className='submitBtn btn'
                            >{'Apply'}</button>

                            <button
                                className='favCardFull_BtnClose btn'
                                onClickCapture={this.close}
                            >X</button>
                        </div>
                    </form>
                </div>
            );
        }

        if (this.state._display === 'full') {

            return (
                <form
                    className='addFavForm'
                    onSubmit={this.handleSubmit}
                >

                    <div className='addFavForm__formSection'>
                        <label htmlFor="imgFav">Image</label>
                        <input
                            type="text"
                            id='imgFav'
                            name='imgFav'
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='addFavForm__formSection'>
                        <label htmlFor="nameEng">{`Name (eng)`}</label>
                        <input
                            type="text"
                            id='nameEng'
                            name='nameEng'
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='addFavForm__formSection'>
                        <label htmlFor="nameAlt">{`Name (alt)`}</label>
                        <input
                            type="text"
                            id='nameAlt'
                            name='nameAlt'
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='addFavForm__formSection'>
                        <label htmlFor="comment">{`Comment`}</label>
                        <textarea
                            type="text"
                            id='comment'
                            name='comment'
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='addFavForm__formSection'>
                        <label htmlFor="tags">{`Tags`}</label>
                        <textarea
                            type="text"
                            id='tags'
                            name='tags'
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='addFavForm__formSection'>
                        <label htmlFor="rating">{`Rate (0-5)`}</label>
                        <input
                            type="number"
                            id='rating'
                            name='rating'
                            min={1}
                            max={5}
                            step={1}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    <div className='addFormBtnSet'>
                        <button
                            className='btnClose btn'
                            onClickCapture={this.close}
                        >X</button>
                        <button
                            type="submit"
                            className='submitBtn Btn'
                        >Add</button>
                    </div>
                </form>
            );
        }
    }
}

export default AppFavListAdd;