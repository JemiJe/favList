
// optionsObj includes {getUrl, putUrl, postUrl, deleteUrl, isPost} props
// events 'SyncFetch.js: wasSent', 'SyncFetch.js: sendError', 'SyncFetch.js: updated'

import favStorage from './storage.js';
import StorageItem from './StorageItem.js';

class SyncFetch {

    constructor(optionsObj) {
        this.options = optionsObj;
        this.isPost = this.options.isPost;
        this.isWithoutImgs = this.options.isWithoutImgs;
        this.isAlredyExists = this.options.isAlredyExists;
    }

    async sendData(forcePOST) {

        let currentData = favStorage('favListStorage').get();
        
        if(forcePOST /*|| !currentData.isSyncConnected*/) this.isPost = true; // if doesn't exist - first POST then PUT
        
        let { putUrl, postUrl } = this.options;
        
        let link = this.isPost ? postUrl : putUrl;
        let method = this.isPost ? 'POST' : 'PUT';

        if( this.isWithoutImgs ) {
            // currentData.items = this._removeImagesUrls(currentData.items);
        }

        try {

            let bodyData = { data: currentData };

            let resp = await fetch(link, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(bodyData)
            });
            
            if (resp.ok) {

                favStorage('favListStorage').change( storage => {
                    if (!storage.isSyncConnected) {
                        storage.isSyncConnected = true;
                    }
                } );
                
                this._event('wasSent');
            } else {
                
                // favStorage('favListStorage').change( storage => {
                //     if (storage.isSyncConnected) {
                //         storage.isSyncConnected = false;
                //     }
                // } );
            }

        } catch (error) {
            console.log('SyncFetch.js error: ' + error);
            
            this._event('sendError');
            throw new Error(error);
        }

    }

    async getAndUpdateData() {

        let currentData = favStorage('favListStorage').get();

        if(this.isAlredyExists) currentData.isSyncConnected = true;

        if (!currentData.isSyncConnected) {
            try {
                await this.sendData(true);
                return true;
            } catch (error) {
                console.log('SyncFetch init error: ' + error);
                return false;
            }
        }

        await new Promise( r => setTimeout(r, 1000) );

        let { getUrl } = this.options;
        let resp = await fetch(getUrl);

        if (resp.ok) {
            let dataFromServerObj = await resp.json();

            let serverData = dataFromServerObj[0];

            if( this._isNewer(serverData.data.editedDate) ) {

                if(this.isWithoutImgs) {
                    
                    favStorage('favListStorage').backup('SyncFetchBackup');
                    this._updateStorageItems(serverData.data.items);

                    if( serverData.data.folders ) {

                        favStorage('favListStorage').change( storage => {
                            storage.folders = serverData.data.folders;
                            storage.optionsUI = serverData.data.optionsUI;
                        });
                    }

                } else {
                    // favStorage('favListStorage').backup('SyncFetchBackup');
                    // favStorage('favListStorage').set( serverData.data );
                }

                this._event('updated');

            } else {
                this._event('serverDataIsOlder');
                return false;
            }
        }
    }

    _updateStorageItems(serverItems) {
        
        let oldItemsArr = [];
                    
        for(let serverItem of serverItems) {
            
            let storageHasId = new StorageItem(serverItem.id, 'favListStorage').hasId();
            
            if( storageHasId ) {

                oldItemsArr.push(serverItem.id);
                
                new StorageItem(serverItem.id, 'favListStorage').change( item => {
                    
                    // let temp = item.imgFav.webImgUrlsArr;                              
                    item = Object.assign(item, serverItem);
                    // item.imgFav.webImgUrlsArr = temp;
                } );

            } else { // new items
                oldItemsArr.push(serverItem.id);
                new StorageItem(false, 'favListStorage').addItem(serverItem);
            }
        }

        this._deleteExtraItems(oldItemsArr);
    }

    _isNewer(dataFromServerEditedDate) {
        let currentDataEditedTime = favStorage('favListStorage').get().editedDate;
        let difference = new Date(currentDataEditedTime) - new Date(dataFromServerEditedDate);

        let result = difference < 0 ? true : false;
        return result;
    }

    _event(msg) {
        let event = new Event('SyncFetch.js: ' + msg); 
        document.dispatchEvent(event);
    }

    // _removeImagesUrls(itemsArr) {

    //     let newArr = [...itemsArr];

    //     for( let item of newArr ) {
    //         item.imgFav.webImgUrlsArr = [];
    //     }

    //     return newArr;
    // }

    _deleteExtraItems(idsWereSendFromServerArr) {

        let storageItems = favStorage('favListStorage').get().items;

        for( let storageItem of storageItems ) {
            if( !idsWereSendFromServerArr.includes(storageItem.id) ) {
                new StorageItem(storageItem.id, 'favListStorage').deleteItem();
            }
        }
    }
}

export default SyncFetch;