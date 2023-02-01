import { useHttp } from "../hooks/http.hook";

const useMarvelServices = () => {
    const _apiKey = 'apikey=0c4f10f4cf9da496e40a61bd27cb5dc1';
    const _baseOffset = 210;
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';

    const {loading, error, request, clearError} = useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformChar(res.data.results[0]);
    }

    const _transformChar = (char) => {

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

    return {loading, error, clearError, getCharacter, getAllCharacters};
};

export default useMarvelServices;