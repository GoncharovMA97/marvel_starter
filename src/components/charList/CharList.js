import { useState, useEffect } from 'react';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import PropTypes from 'prop-types';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [nemCharLoading, setNemCharLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelServices = new MarvelServices();

    useEffect(() => {
        onRequest(offset);
    }, [])

    const onRequest = (offset) => {
        setNemCharLoading(true);
        marvelServices
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    }

    const onCharListLoaded = (newCharList) => {
        let onEnd = false;

        if (offset > 1561) {
            onEnd = true;
        };

        setCharlist((charList) => [...charList, ...newCharList]);
        setLoading(false);
        setError(false);
        setNemCharLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(onEnd);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const inputArrTransform = (arr) => {
        const newArr = arr.map(item => {
            const imgNA = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
            const styleImg = imgNA ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return(
                <li className="char__item" 
                    key={item.id} 
                    tabIndex={0}
                    onFocus={() => props.onCharSelected(item.id)}
                >
                    <img src={item.thumbnail} style={styleImg} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });
        return(
            <ul className="char__grid">
                {newArr}
            </ul>
        );

    }

    const load = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMesage/> : null;
    const content = !(load || errorMessage) ? inputArrTransform(charList) : null;
    return (
        <div className="char__list">
            {load}
            {errorMessage}
            {content}
            <button 
                onClick={() => onRequest(offset)}
                disabled={nemCharLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
};

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;