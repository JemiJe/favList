
// events: 'storage.js.updated', 'storage.js.backup', 'storage.js.restored'

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
            // console.log( `%cstorage.js%c backup has been created: '${backupName}'`, consoleStyle1, 'color: lime' );

            let event = new Event('storage.js.backup'); 
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
            // console.log( `%cstorage.js%c storage has been restored from '${backupName}' to '${newStorageName}'`, consoleStyle1, 'color: lime' );

            let event = new Event('storage.js.restored'); 
            document.dispatchEvent(event);
        }
    };
}

export default favStorage;