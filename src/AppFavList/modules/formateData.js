
// events: 'storage.js.updated', 'storage.js.backup', 'storage.js.restored'

const formateData = () => {

    return {

        handleTags(tagsStr) {
          
            if( Array.isArray(tagsStr) ) return tagsStr;
            if (!tagsStr.includes(',')) return [tagsStr];

            return tagsStr.split(',')
                .map(i => i.trim())
                .filter(i => i !== '');
        },

        addFolder(currentFoldersArr, newFolderName) {
            
            let foldersArr = currentFoldersArr ? currentFoldersArr : [];
            
            let newFoldersArr = [...foldersArr, newFolderName];
            return [...new Set(newFoldersArr)];
        }
    };
}

export default formateData;