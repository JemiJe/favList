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
                editedDate: new Date().toUTCString(),
                items: [],
                folders: [],

                isSyncConnected: true,

                optionsUI: {
                    displayMode: 'folders',
                    sort: 'dateUp'
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

        this.state = {
            loadingAnimation: false
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

                    // mark than we already know server, connected and no need to POST for first connections in SyncFetch
                    let storage = favStorage('favListStorage').get();
                    let alreadyExists = storage.optionsJSON.synchServers[serverIndexInOptions].isAlredyExists;
                    if (storage.isSyncConnected && !alreadyExists) {

                        favStorage('favListStorage').change(storageObj => {
                            storageObj.optionsJSON.synchServers[serverIndexInOptions].isAlredyExists = true;
                        });
                    }
                });

            this.update();
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

        // console.dir(  );

        this._sync('update');

        document.addEventListener('AppFavListAdd.itemAdded', this.syncSend);
        document.addEventListener('AppFavListCard.updated', this.syncSend);

        document.addEventListener('AppFavListAdd.itemAdded', this.update);
        document.addEventListener('AppFavListAdd.backupRestored', this.update);
        document.addEventListener('AppFavListDisplay.update', this.update);
        document.addEventListener('AppFavListFolder.open', this.update);
    }

    renderItems() {
        
        const storage =  favStorage('favListStorage').get();

        let items = storage.items;
        const options = storage.optionsUI;

        if( options.displayMode === 'folders' ) {

            const folders = this._getActualFolders();

            favStorage('favListStorage').change( storage => {
                storage.folders = folders;
            } );

            let itemsComponentsArr = folders
                .map( folder => {
                    let data = {
                        name: folder
                    };
                    return (<AppFavListFolder data={ data } key={Math.random()} />);
                });
            
            return itemsComponentsArr;

        }
        else if( options.displayMode === 'currentFolder' ) {
            
            if( storage.optionsUI.currentFolder ) {
                let newItems = items.filter( item => item.folder === storage.optionsUI.currentFolder );
                return this._returnItemsCompsArr(newItems);
            }
        }
        else if( options.displayMode === 'default' ) {   
            return this._returnItemsCompsArr(items);
        }
    }

    _getActualFolders = () => {
        let storage = favStorage('favListStorage').get().items;
        let currentFolders = storage.reduce( (folders, item) => {
            return [...folders, item.folder];
        }, [] );
        currentFolders = [...new Set(currentFolders)];
        return currentFolders;
    }

    _returnItemsCompsArr = items => {
        
        let itemsComponentsArr = items.map( item => {

            // new StorageItem(item.id, 'favListStorage').change( i => {
            //     i.folder = 'j';
            // });

            return (<AppFavListCard id={ item.id } key={Math.random()} />);
        });

        return itemsComponentsArr;
    }

    // updateItemsList( options ) {
    //     this.optionsUI = options;
    //     this.update();
    // }

    update = e => {
        this.setState({});
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
                        { this.renderItems() }
                    </div>
                </main>
            </div>
        );
    }
}

export default AppFavList;