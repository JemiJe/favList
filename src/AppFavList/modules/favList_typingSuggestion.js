
const favList_typingSuggestion = (typingStr, whereToSearchArr) => {
    
    typingStr = typingStr.includes(',') ? typingStr.split(',').at(-1) : typingStr;
        
    let foundTags = [...whereToSearchArr]
        .filter(tag => tag && tag.includes( typingStr.trim() ));

    return foundTags;
}

export default favList_typingSuggestion;