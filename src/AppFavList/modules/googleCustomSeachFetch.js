



/*
let searchUrlObj2 = seachUrlInit('https://www.googleapis.com/customsearch/v1', {
    key: 'AIzaSyAldAvijb1HkWDO6C4KKdMc1Jh9twbC-Iw',
    cx: 'a39f22ac79254422d',
    searchType: 'image',
    start: 1
});

document.querySelector('#getImgs').addEventListener( 'click', () => {

    setImgUrlsToJMArr(JMArr, searchUrlObj2)
        .then( data => {
            localStorage.setItem('JMArrWithImgUrls-' + new Date().toDateString(), JSON.stringify(data));
            console.log(data);
        });
} );
*/

export class googleCustomSeachFetch {

    constructor(searchParametersObj) {
        this.searchParams = searchParametersObj;
        this.baseUrl = 'https://www.googleapis.com/customsearch/v1';
        this.delay = 2000;
    }

    _seachUrlInit() {
    
        let urlObjWithParams = new URL(this.baseUrl);
        
        if( this.searchParams.start && this.searchParams.start > 100 ) this.searchParams.start = 1; //restriction of search api
        
        for(let paramName in this.searchParams) {
            const paramValue = this.searchParams[paramName];
            urlObjWithParams.searchParams.set( paramName, paramValue );
        }
        return urlObjWithParams;
    }

    async _searchOfImgNamesArr( namesArr ) {
        
        let results = [];

        for( let i = 0; i < namesArr.length; i++ ) {
            await new Promise( r => setTimeout(r, this.delay) );
            let result = await this.getImagesFetch( namesArr[i] );
            results = [...results, ...result];
        }

        return results;
    }
    
    async getImagesFetch( imageNameStrOrArr ) {

        if(!imageNameStrOrArr || imageNameStrOrArr.length === 0) return false;

        if( Array.isArray( imageNameStrOrArr ) ) {
            let data = await this._searchOfImgNamesArr( imageNameStrOrArr );
            return data;
        }
    
        let urlObjWithParams = this._seachUrlInit();
        urlObjWithParams.searchParams.set( 'q', imageNameStrOrArr );
        let link = urlObjWithParams.href;
        let resp = await fetch(link);
        let data = await resp.json();
    
        return data.items;
    }
    
}

export default googleCustomSeachFetch;