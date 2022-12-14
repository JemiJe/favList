import React, { Component } from 'react';

import './css/AppFavListStyle.css';

import AppFavListAdd from './components/AppFavListAdd';
import AppFavListCard from './components/AppFavListCard';
import AppFavListFolder from './components/AppFavListFolder';
import AppFavListDisplayOptions from './components/AppFavListDisplayOptions';
import AppFavListLoadingAnimation from './components/AppFavListLoadingAnimation';

import favStorage from './modules/storage.js';
import SyncFetch from './modules/SyncFetch.js';
// import StorageItem from './modules/StorageItem.js';

class AppFavList extends Component {

    constructor(props) {
        super(props);

        if (!localStorage.getItem('favListStorage')) {
            localStorage.setItem('favListStorage', JSON.stringify({

                userId: +Math.random().toString().slice(2),
                editedDate: 0,
                items: [],
                folders: [],

                isSyncConnected: true,

                optionsUI: {
                    displayMode: 'folders',
                    sort: 'addedUp'
                },

                optionsJSON: {
                    googleCustomSearch: [
                        { apiKey: '', cx: '' }
                    ],
                    synchServers: [
                        {
                            isAlredyExists: true,
                            isPost: false,
                            isWithoutImgs: true,
                            deleteUrl: '',
                            getUrl: '',
                            postUrl: '',
                            putUrl: ''
                        }
                    ]
                },
            }));
        }

        if (localStorage.getItem('favStorage | options temp backup')) {

            favStorage('favListStorage').change(storage => {
                storage.optionsJSON = favStorage('favStorage | options temp backup').get();
            });

            localStorage.removeItem('favStorage | options temp backup');
        }

        this.state = {
            loadingAnimation: false,
            isSearching: false,
        };
    }

    async _sync(mode = 'update', serverIndexInOptions = 0) {

        let syncOptions = favStorage('favListStorage').get().optionsJSON.synchServers[serverIndexInOptions];

        if (!syncOptions.getUrl || !syncOptions.putUrl || !syncOptions.postUrl) {
            console.log('AppFavList: there is no sync options, set it manually in options json');
            return false;
        }

        let syncInit = new SyncFetch(syncOptions);

        if (mode === 'update') {
            this.syncAnimation(true);

            await syncInit.getAndUpdateData()
                .then(() => {
                    this.syncAnimation(false);
                    window.favListInterval = {};

                    // mark than we already know server, connected and no need to POST for first connections in SyncFetch
                    let storage = favStorage('favListStorage').get();
                    let alreadyExists = storage.optionsJSON.synchServers[serverIndexInOptions].isAlredyExists;
                    if (storage.isSyncConnected && !alreadyExists) {

                        favStorage('favListStorage').change(storageObj => {
                            storageObj.optionsJSON.synchServers[serverIndexInOptions].isAlredyExists = true;
                        });
                    }

                    this._storageEdited();
                });

            this.update({type: null});
        }
        else if (mode === 'send') {
            await syncInit.sendData();
        }
    }

    syncAnimation = isRun => {
        this.setState({
            loadingAnimation: isRun ? true : false
        });
    }

    syncSend = () => {
        this._sync('send');
    }

    componentDidMount() {

        // this._cleanItems();

        this._sync('update');

        document.addEventListener('AppFavListAdd.itemAdded', this.syncSend);
        document.addEventListener('AppFavListCard.updated', this.syncSend);

        document.addEventListener('AppFavListAdd.itemAdded', this.update);
        document.addEventListener('AppFavListAdd.backupRestored', this.update);
        document.addEventListener('AppFavListDisplay.update', this.update);
        document.addEventListener('AppFavListDisplay.searching', this.update);
        // document.addEventListener('AppFavListFolder.open', this.update);
        document.addEventListener('AppFavListFolder.updated', this.update);
    }

    // _cleanItems() {
    //     favStorage('favListStorage').change(storage => {
    //         for (let item of storage.items) {
    //             delete item._isFolderTyping;
    //             delete item.optionsJSON;
    //             delete item._actualFolders;
    //             delete item._isTagsTyping;
    //             delete item._actualTags;
    //             delete item._display;
    //         }
    //     });
    // }

    renderItems() {

        const storage = favStorage('favListStorage').get();

        let items = storage.items;
        const options = storage.optionsUI;

        if (options.displayMode === 'folders') {

            const folders = this._getActualFolders();

            favStorage('favListStorage').change(storage => {
                storage.folders = folders;
            });

            let itemsComponentsArr = folders
                .sort((a, b) => {
                    let sizeWrap = folder => folder.name === 'unset' ? 0 : folder.size; // 'unset' folder always last
                    return sizeWrap(b) - sizeWrap(a);
                })
                .map(folder => {
                    let data = {
                        name: folder.name,
                        size: folder.size
                    };
                    return (<AppFavListFolder data={data} key={Math.random()} />);
                });

            return itemsComponentsArr;

        }
        else if (options.displayMode === 'currentFolder') {

            items = this._sortItems(items, options);

            if (storage.optionsUI.currentFolder) {
                let newItems = items.filter(item => item.folder === storage.optionsUI.currentFolder);
                return this._returnItemsCompsArr(newItems);
            }
        }
        else if (options.displayMode === 'default') {

            items = this._sortItems(items, options);

            return this._returnItemsCompsArr(items);
        }
    }

    _filterSearchItems = (items, textCond) => {
        if (!textCond) return;

        let filterTextCond = textCond.toLowerCase();

        const valueFormate = value => value.toString().toLowerCase();
        const isValueEqualCond = value => valueFormate(value).includes(filterTextCond);
        const removeExtraProps = item => {
            let copyItem = Object.assign({}, item);
            ['id', 'imgFav'].forEach(prop => delete copyItem[prop]);
            return copyItem;
        };

        let filteredItems = [...items].filter(item => {
            return Object.values(removeExtraProps(item)).find(isValueEqualCond);
        });

        // return filteredItems.length > 0 ? filteredItems : items;
        return filteredItems;
    }

    _sortItems = (items, optionsUI) => {

        const sortWrapper = (itemsArr, boolCond, func) => {

            return [...itemsArr].sort((a, b) => {
                return boolCond ? func(a) - func(b) : func(b) - func(a);
            });
        }

        if (optionsUI.sort.includes('name')) {

            const getWordCode = ({ nameEng }) => nameEng ? nameEng[0].toLowerCase().charCodeAt() : 32; //empty '' fix
            const isUp = optionsUI.sort.includes('Up') ? true : false;

            let itemsSorted = sortWrapper(items, isUp, getWordCode);

            return itemsSorted;
        }
        else if (optionsUI.sort.includes('added')) {

            const getDateObj = ({ dateAdded }) => new Date(dateAdded);
            const isUp = optionsUI.sort.includes('Up') ? true : false;

            let itemsSorted = sortWrapper(items, isUp, getDateObj);

            return itemsSorted;
        }
        else if (optionsUI.sort.includes('edited')) {

            const getDateObj = ({ dateEdited }) => new Date(dateEdited);
            const isUp = optionsUI.sort.includes('Up') ? true : false;

            let itemsSorted = sortWrapper(items, isUp, getDateObj);

            return itemsSorted;
        }
        else if (optionsUI.sort.includes('rating')) {

            const getRating = ({ rating }) => rating >= 0 ? rating : 0;
            const isUp = optionsUI.sort.includes('Up') ? true : false;

            let itemsSorted = sortWrapper(items, isUp, getRating);

            return itemsSorted;
        }
        else {
            return items;
        }
    }

    _folderSize = folderName => {
        let items = favStorage('favListStorage').get().items;
        let folderItems = items.filter(item => item.folder === folderName);
        return folderItems.length;
    }

    _getActualFolders = () => {
        let storage = favStorage('favListStorage').get().items;
        let currentFolders = storage.reduce((folders, item) => {
            return [...folders, item.folder];
        }, []);
        currentFolders = [...new Set(currentFolders)];

        currentFolders = currentFolders.reduce((foldersObj, folderName) => {
            return [...foldersObj, { name: folderName, size: this._folderSize(folderName) }]
        }, []);

        return currentFolders;
    }

    _returnItemsCompsArr = items => {

        items = this.state.isSearching ? this._filterSearchItems(items, this.state.isSearching) : items;

        let itemsComponentsArr = items.length > 0
            ? items.map(item => {
                return (<AppFavListCard id={item.id} key={Math.random()} />);
            })
            : [(<div className='emptySearchResults'>{':( nothing was found'}</div>)];

        return itemsComponentsArr;
    }

    _storageEdited = () => {
        favStorage('favListStorage').change(storage => {
            storage.editedDate = new Date().toUTCString();
        });
    }

    update = e => {
        this.setState({
            isSearching: (e.type && e.type === 'AppFavListDisplay.searching') ? e.dataObj : false
        });
    }

    render() {

        return (
            <div className='AppFavListContainer'>
                <header>
                    <AppFavListAdd callbackFunc={this.update} />

                    <AppFavListDisplayOptions />

                    <AppFavListLoadingAnimation
                        key={Math.random()}
                        isRun={this.state.loadingAnimation}
                        style={{
                            top: '1.7em',
                            left: '2.5em'
                        }}
                        animationCssNames={['loadingAnimation', 'loadingAnimationText']}
                        text={'sync...'}
                    />
                </header>
                <main>
                    <div className='AppFavListCardContainer'>
                        {this.renderItems()}
                    </div>
                </main>
            </div>
        );
    }
}

export default AppFavList;