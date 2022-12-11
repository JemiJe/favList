
// optionsObj includes {getUrl, putUrl, postUrl, deleteUrl, isPost} props
// events 'SyncFetch.js: wasSent', 'SyncFetch.js: sendError', 'SyncFetch.js: updated'

import favStorage from './storage.js';
import StorageItem from './StorageItem.js';

class SyncFetch {

    constructor(optionsObj) {
        this.options = optionsObj;
        this.isPost = this.options.isPost;
        this.isWithoutImgs = this.options.isWithoutImgs;
    }

    async sendData(forcePOST) {

        let currentData = favStorage('favListStorage').get();
        
        if(forcePOST || !currentData.isSyncConnected) this.isPost = true;
        
        let { putUrl, postUrl } = this.options;
        
        let link = this.isPost ? postUrl : putUrl;
        let method = this.isPost ? 'POST' : 'PUT';

        if( this.isWithoutImgs ) {
            currentData.items = this._removeImagesUrls(currentData.items);
        }

        try {

            // let bodyData = this.isPost 
            //     ? { data: currentData } 
            //     : { id: 0, data: currentData };

            let bodyData = { data: currentData };

            let resp = await fetch(link, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(bodyData)
            });
            
            if (resp.ok) {
                
                let currentData = favStorage('favListStorage').get();
                if (!currentData.isSyncConnected) {
                    currentData.isSyncConnected = true;
                    favStorage('favListStorage').set(currentData);
                }
                
                this._event('wasSent');
            } else {
                let currentData = favStorage('favListStorage').get();
                if (!currentData.isSyncConnected) {
                    currentData.isSyncConnected = false;
                    favStorage('favListStorage').set(currentData);
                }
            }

        } catch (error) {
            console.log('SyncFetch.js error: ' + error);
            
            this._event('sendError');
            throw new Error(error);
        }

    }

    async getAndUpdateData() {

        let currentData = favStorage('favListStorage').get();

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

            if( this._isNewer(serverData.data.editedDate) ) { //this._isNewer(serverData.data.editedDate)

                if(this.isWithoutImgs) {
                    favStorage('favListStorage').backup('SyncFetchBackup');
                    
                    let storage = favStorage('favListStorage').get();

                    for(let serverItem of serverData.data.items) {
                        
                        let storageHasId = new StorageItem(serverItem.id, 'favListStorage').hasId();
                        
                        if( storageHasId ) {
                            
                            new StorageItem(serverItem.id, 'favListStorage').change( item => {
                                
                                let temp = item.imgFav.webImgUrlsArr;
                                Object.assign(item, serverItem);
                                item.imgFav.webImgUrlsArr = temp;
                            } );
                        } else {
                            storage.items.unshift( serverItem );
                        }
                    }

                    favStorage('favListStorage').set( storage );

                } else {
                    favStorage('favListStorage').backup('SyncFetchBackup');
                    favStorage('favListStorage').set( serverData.data );
                }

                this._event('updated');

            } else {
                this._event('serverDataIsOlder');
                return false;
            }
        }
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

    _removeImagesUrls(itemsArr) {

        let newArr = [...itemsArr];

        for( let item of newArr ) {
            item.imgFav.webImgUrlsArr = [];
        }

        return newArr;
    }
}

export default SyncFetch;