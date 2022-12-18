
import favStorage from './storage.js';

const favList_getActualTags = () => {
    
    let storage = favStorage('favListStorage').get().items;
    let currentTags = storage.reduce( (tags, item) => {
        return [...tags, ...item.tags];
    }, [] );
    currentTags = [...new Set(currentTags)];

    return currentTags;
}

export default favList_getActualTags;