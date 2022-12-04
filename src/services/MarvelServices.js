

class MarvelServices {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=0c4f10f4cf9da496e40a61bd27cb5dc1';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Not found in ${url}, error type: ${res.status}`)
        }

        return await res.json();
    };

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformChar);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformChar(res.data.results[0]);
    }

    _transformChar = (char) => {

        if (!char.description) {
            char.description = "This character doesn't have any description";
        };

        if (char.description.length > 220) {
            char.description = char.description.slice(0, 217) + '...'
        }

        if (char.name.length > 23) {
            char.name = char.name.slice(0, 20) + '...';
        };

        if (char.comics.items.length > 10) {
            char.comics.items = char.comics.items.slice(0, 10);
        } else if (char.comics.items.length === 0) {
            char.comics.items[0] = {name: 'Not found!'}
        }

        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
};

export default MarvelServices;