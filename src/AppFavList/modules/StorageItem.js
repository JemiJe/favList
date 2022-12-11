
//events: 'StorageItem.js.change', 'StorageItem.js.deleted'
// events.storageItemDataObj - for details

import favStorage from './storage.js';

class StorageItem {
    
    constructor(itemIdInt, storageName) {
        this.itemIdInt = itemIdInt;
        this.storageName = storageName;
    }

    _sendEvent(typeStr, eventData) {
        
        let event = new Event(typeStr);
        event.storageItemDataObj = eventData;
        
        document.dispatchEvent(event);
    }

    change = funcToChangeItem => {
    
        let storageObj = favStorage(this.storageName).get();
        
        for (let item of storageObj.items) {
            
            if (item.id === this.itemIdInt) {
                funcToChangeItem( item );
            }
        }
    
        favStorage(this.storageName).set(storageObj);

        this._sendEvent('StorageItem.js.change', {itemId: this.itemIdInt});
    }

    hasId() {
        let storageObj = favStorage(this.storageName).get();
        
        for (let item of storageObj.items) {
            
            if (item.id === this.itemIdInt) {
                return true;
            }
        }

        return false;
    }

    addItem = itemObj => {
        let storageObj = favStorage(this.storageName).get();
        let storageObjItemsArr = storageObj.items;

        storageObjItemsArr.unshift(itemObj);
        
        favStorage(this.storageName).set(storageObj);
    }

    deleteItem = () => {
        
        let storageObj = favStorage(this.storageName).get();
        let storageObjItemsArr = storageObj.items;

        for( let i = 0; i < storageObjItemsArr.length; i++ ) {
            
            if( this.itemIdInt === storageObjItemsArr[i].id) storageObjItemsArr.splice( i, 1 );
        }
        
        favStorage(this.storageName).set(storageObj);
        
        this._sendEvent('StorageItem.js.deleted', {itemId: this.itemIdInt});
    }

    getItem = () => {
    
        let storageObj = favStorage(this.storageName).get();
        
        for (let item of storageObj.items) {
            
            if (item.id === this.itemIdInt) {
               return item;
            }
        }
    }
}

export default StorageItem;