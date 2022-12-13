
// events: 'storage.js.updated', 'storage.js.backup', 'storage.js.restored'
// also return event.storageName

const favStorage = storageName => {
    
    if( !localStorage.getItem(storageName) ) return false;

    const consoleStyle1 = 'color: yellow; border: 1px solid';

    return {

        get() {         
            return JSON.parse(localStorage.getItem(storageName));
        },

        set(newStorageObj) {
            
            newStorageObj.editedDate = new Date().toUTCString();
            
            localStorage.setItem( storageName, JSON.stringify(newStorageObj) );
            
            let event = new Event('storage.js.updated');
            event.storageName = storageName;
            document.dispatchEvent(event);
        },

        change(func) {

            let storageObj = JSON.parse( localStorage.getItem(storageName) );
            
            func( storageObj );

            storageObj.editedDate = new Date().toUTCString();
            localStorage.setItem( storageName, JSON.stringify(storageObj) );
            
            let event = new Event('storage.js.updated');
            event.storageName = storageName;
            document.dispatchEvent(event);
        },

        backup(customName) {
            
            const prevStorageObj = JSON.parse(localStorage.getItem(storageName));
            let name = customName ? customName : '';
            let backupName = storageName + ` | ${name} | ` + new Date().toISOString();
            
            if(customName) {
                let keys = Object.keys(localStorage);

                let keysArr = [...keys]
                    .filter( item => item.includes(customName) );
                
                for( let backups of keysArr) {
                    localStorage.removeItem(backups);
                }
            }
            
            localStorage.setItem( backupName, JSON.stringify(prevStorageObj) );

            let event = new Event('storage.js.backup');
            event.storageName = storageName;
            document.dispatchEvent(event);
        },

        restore(backupStorageName) {
            
            let keys = Object.keys(localStorage);

            let keysArr = [...keys]
                .filter( item => item.includes( backupStorageName ) )
                .sort( item => {
                    let date = new Date(item.split(' | ')[2]);
                    return new Date() - date;
                } );

            if( !keysArr[0] && !backupStorageName ) {
                console.log( '%cstorage.js%c there is no any backups, create .backup() first', consoleStyle1, 'color: coral' );
            }

            localStorage.setItem( storageName, localStorage.getItem(keysArr[0]) );

            let event = new Event('storage.js.restored');
            event.storageName = storageName; 
            document.dispatchEvent(event);
        }
    };
}

export default favStorage;