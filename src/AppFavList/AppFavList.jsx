import React, { Component } from 'react';

import './css/AppFavListStyle.css';

import AppFavListAdd from './components/AppFavListAdd';
import AppFavListCard from './components/AppFavListCard';

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
            update: false
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
            await syncInit.getAndUpdateData();
        }
        else if (mode === 'send') {
            await syncInit.sendData();
        }
    }

    syncSend = () => {
        this._sync('send');
    }

    componentDidMount() {

        this._sync('update');
        document.addEventListener('AppFavListAdd.itemAdded', this.syncSend);
        document.addEventListener('AppFavListCard.updated', this.syncSend);
    }

    renderCardsWithData() {
        let dataItemsArr = favStorage('favListStorage').get().items;

        let itemsComponentsArr = dataItemsArr.map((itemData) => {

            // new StorageItem(itemData.id, 'favListStorage').change( item => {
            //     delete item.optionsJSON;
            // } );

            return (<AppFavListCard key={Math.random()} id={itemData.id} updateParentFunc={this.update} />);
        });

        return itemsComponentsArr;
    }

    update = () => {
        this.setState({});
        // this._sync('send');
    }

    render() {

        return (
            <div className='AppFavListContainer'>
                <header>
                    <AppFavListAdd callbackFunc={this.update} />
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