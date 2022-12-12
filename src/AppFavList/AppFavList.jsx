import React, { Component } from 'react';

import './css/AppFavListStyle.css';

import AppFavListAdd from './components/AppFavListAdd';
import AppFavListCard from './components/AppFavListCard';
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
                
                isSyncConnected: true,
                
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
            update: false,
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
                .then( () => {
                    this.syncAnimation(false);

                    // mark than we already know server, connected and no need to POST for first connections in SyncFetch
                    let storage = favStorage('favListStorage').get();
                    let alreadyExists = storage.optionsJSON.synchServers[serverIndexInOptions].isAlredyExists;
                    if( storage.isSyncConnected && !alreadyExists) {
                        storage.optionsJSON.synchServers[serverIndexInOptions].isAlredyExists = true;
                    }
                } );
                       
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

        this._sync('update');
        document.addEventListener('AppFavListAdd.itemAdded', this.syncSend);
        
        document.addEventListener('AppFavListAdd.itemAdded', this.update);
        document.addEventListener('AppFavListAdd.backupRestored', this.update);
        
        document.addEventListener('AppFavListCard.updated', this.syncSend);
    }

    renderCardsWithData() {
        let dataItemsArr = favStorage('favListStorage').get().items;

        let itemsComponentsArr = dataItemsArr.map((itemData) => {

            return (<AppFavListCard key={Math.random()} id={itemData.id} updateParentFunc={this.update} />);
        });

        return itemsComponentsArr;
    }

    update = () => {
        this.setState({});
    }

    render() {

        return (
            <div className='AppFavListContainer'>
                <header>
                    <AppFavListAdd callbackFunc={this.update} />

                    <AppFavListLoadingAnimation
                        key={Math.random()}
                        isRun={this.state.loadingAnimation}
                        style={{
                            top: '1.7em',
                            left: '2.5em'
                        }}
                        animationCssName={'loadingAnimation'}
                        text={'sync...'}
                    />
                </header>
                <main>
                    <div className='AppFavListCardContainer'>
                        {this.renderCardsWithData()}
                    </div>
                </main>
            </div>
        );
    }
}

export default AppFavList;