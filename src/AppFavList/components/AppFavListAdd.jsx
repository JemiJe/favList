import React, { Component } from 'react';

import favStorage from '../modules/storage.js';
import formateData from '../modules/formateData.js';
import favList_getActualTags from '../modules/favList_getActualTags.js';
import favList_typingSuggestion from '../modules/favList_typingSuggestion.js';

// events: 'AppFavListAdd.itemAdded' 'AppFavListAdd.backupRestored' 'AppFavListAdd.optionsChanged'

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
            folder: '',
            tags: '',
            rating: '',
            _display: 'short',
            _isTagsTyping: false,
            _actualTags: favList_getActualTags(),
            _actualFolders: favStorage('favListStorage').get().folders.map(f => f.name),
            optionsJSON: JSON.stringify(favStorage('favListStorage').get().optionsJSON, null, 2)
        };
    }

    componentDidMount() {
        document.addEventListener('focusin', this.removeSuggestion);
    }

    componentWillUnmount() {
        document.removeEventListener('focusin', this.removeSuggestion);
    }

    handleChange(e) {
        let { name, value } = e.target;

        if (name === 'imgFav') {
            value = Object.assign(this.state.imgFav, { webImgUrl: value });
        }

        this.setState({
            [name]: value,
            _isTagsTyping: name === 'tags' ? value : false,
            _isFolderTyping: name === 'folder' ? value : false,
        });
    }

    // componentDidMount() {
    //     console.log( this.state._actualTags );
    // }

    clearForm() {
        let formElems = [...document.querySelectorAll(`
            #imgFav, #nameEng, #nameAlt, #comment, #tags, #rating
        `)];

        for (let elem of formElems) {
            elem.value = '';
        }
    }

    setNewUserOptions = e => {

        e.preventDefault();

        favStorage('favListStorage').change(storage => {
            let insertedOptionsObj = JSON.parse(this.state.optionsJSON);
            storage.optionsJSON = insertedOptionsObj;
        });

        this._event('optionsChanged');

        this.setState({
            _display: 'short'
        });
    }

    handleSubmit = e => {

        e.preventDefault();

        if (this.state._display === 'options' && !'import export'.includes(e.target.name)) {

            // favStorage('favListStorage').change(storage => {
            //     let insertedOptionsObj = JSON.parse(this.state.optionsJSON);
            //     storage.optionsJSON = insertedOptionsObj;
            // });

            // this._event('optionsChanged');

            // this.setState({
            //     _display: 'short'
            // });

        } else {

            const additionalInfoObj = {
                folder: this.state.folder ? this.state.folder : 'unset',
                rating: this.state.rating ? +this.state.rating : 1,
                tags: formateData().handleTags(this.state.tags),
                dateAdded: new Date().toString(),
                dateEdited: new Date().toString(),
                id: +Math.random().toString().slice(2)
            };

            favStorage('favListStorage').change( storage => {
                
                storage.items.push(Object.assign({
                    nameEng: this.state.nameEng,
                    nameAlt: this.state.nameAlt,
                    comment: this.state.comment,
                    imgFav: this.state.imgFav,
                }, additionalInfoObj));
                
                storage.folders = formateData().addFolder(storage.folders, this.state.folder);
            } );

            this._event('itemAdded');

            this.clearForm();
            this.close();
        }

    }

    removeSuggestion = e => {
        if( e.target.classList.value.includes( 'suggestionInsert' ) ) return;
        this.setState({
            _isTagsTyping: false,
            _isFolderTyping: false,
        });
    }

    suggestionInsertOnClick = (e) => {
        console.dir(e.target.textContent);

        let insertTarget = e.target.parentNode.parentNode.querySelector('.suggestionInsert');
        insertTarget.value += insertTarget.name === 'tags'
            ? ', ' + e.target.textContent
            : e.target.textContent;
    }

    renderTagsWereFound = typingStr => {

        let foundTags = favList_typingSuggestion(typingStr, this.state._actualTags)

        return foundTags.map((tag, i) => {
            return <span 
                className='tag' 
                key={i}
                onClickCapture={this.suggestionInsertOnClick}
            >{tag}
            </span>
        });
    }

    renderFolderWereFound = typingStr => {

        let foundFolders = favList_typingSuggestion(typingStr, this.state._actualFolders)

        return foundFolders.map((folder, i) => {
            return <span 
                className='folder' 
                key={i}
                onClickCapture={this.suggestionInsertOnClick}
            >{folder}</span>
        });
    }

    _storageEdited = () => {
        favStorage('favListStorage').change(storage => {
            storage.editedDate = new Date().toUTCString();
        });
    }

    deleteStorageSaveOptions = () => {
        const options = favStorage('favListStorage').get().optionsJSON;
        localStorage.setItem('favStorage | options temp backup', JSON.stringify(options));
        favStorage('favStorage | options temp backup').set(options);

        localStorage.removeItem('favListStorage');
    }

    restoreBackup = () => {

        favStorage('favListStorage').restore('userBackup');
        this._event('backupRestored');
    }

    importItems = () => {
        let inputTextAreaValue = document.querySelector('#importExport').value;
        favStorage('favListStorage').change(storage => {
            storage.items = JSON.parse(inputTextAreaValue);
        });
    }

    exportItems = () => {
        let outputTextArea = document.querySelector('#importExport');
        outputTextArea.textContent = this._returnItemsJSON();
        outputTextArea.onclick = outputTextArea.select;
    }

    _returnItemsJSON = () => {
        let items = favStorage('favListStorage').get().items;

        return JSON.stringify(items, null, 2);
    }

    _event(type) {

        if (type === 'itemAdded' || type === 'optionsChanged') this._storageEdited();

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
                    >{'Options'}</button>
                </div>
            );
        }

        if (this.state._display === 'options') {

            return (
                <div className='optionsFormWrapper'>
                    <div className='optionsForm'>

                        <button
                            className='favCardFull_BtnClose btn'
                            onClickCapture={this.close}
                        ><span>+</span></button>

                        <div className='addFavForm__formSection' style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <button
                                className='btn'
                                onClickCapture={() => favStorage('favListStorage').backup('userBackup')}
                            >{'backup localStorage'}</button>

                            <button
                                className='btn'
                                onClickCapture={this.restoreBackup}
                            >{'restore lates backup'}</button>

                            <button
                                className='btn btnDanger'
                                onClickCapture={this.deleteStorageSaveOptions}
                                title={'if there are some problems'}
                            >{'delete localStorage (options will be saved)'}</button>
                        </div>
                    </div>
                    <form
                        className='optionsForm'
                    >
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
                                name='optionsJSON'
                                onClickCapture={this.setNewUserOptions}
                            >{'Apply'}</button>
                        </div>
                    </form>
                    <div className='optionsForm'>
                        <div className='addFavForm__formSection'>
                            <label htmlFor="importExport">{`Import/Export items`}</label>
                            <textarea
                                type="text"
                                id='importExport'
                                name='importExport'
                                placeholder='for import insert here your exported json and click import'
                                onChange={e => this.handleChange(e)}
                            />

                            <button
                                className='btn'
                                name='import'
                                onClickCapture={this.importItems}
                            >{'import'}</button>

                            <button
                                className='btn'
                                name='export'
                                onClickCapture={this.exportItems}
                            >{'export'}</button>
                        </div>
                    </div>
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

                    <div className='addFavForm__formSection' style={{ position: 'relative' }}>
                        <label htmlFor="folder">{`Folder`}</label>
                        <input
                            className='suggestionInsert'
                            type="text"
                            id='folder'
                            name='folder'
                            onChange={e => this.handleChange(e)}
                        />
                        {this.state._isFolderTyping &&
                            <div className='addFavForm__foundFolders'>
                                {this.renderFolderWereFound(this.state._isFolderTyping)}
                            </div>
                        }
                    </div>

                    <div className='addFavForm__formSection' style={{ position: 'relative' }}>
                        <label htmlFor="tags">{`Tags`}</label>
                        <textarea
                        className='suggestionInsert'
                            type="text"
                            id='tags'
                            name='tags'
                            onChange={e => this.handleChange(e)}
                        />
                        {this.state._isTagsTyping &&
                            <div className='addFavForm__foundTags'>
                                {this.renderTagsWereFound(this.state._isTagsTyping)}
                            </div>
                        }
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
                        ><span>+</span></button>
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