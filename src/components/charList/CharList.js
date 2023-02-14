import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import PropTypes from 'prop-types';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharlist] = useState([]);
    const [nemCharLoading, setNemCharLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelServices();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial = false) => {
        setNemCharLoading(!initial);
        getAllCharacters(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newCharList) => {
        let onEnd = false;

        if (offset > 1561) {
            onEnd = true;
        };

        setCharlist((charList) => [...charList, ...newCharList]);
        setNemCharLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(onEnd);
    }

    const inputArrTransform = (arr) => {
        const newArr = arr.map(item => {
            const imgNA = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
            const styleImg = imgNA ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return(
                <CSSTransition timeout={500} classNames="char__item">
                    <li className="char__item" 
                        key={item.id} 
                        tabIndex={0}
                        onFocus={() => props.onCharSelected(item.id)}
                    >
                        <img src={item.thumbnail} style={styleImg} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            );
        });
        return(
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {newArr}
                </TransitionGroup>
            </ul>
        );

    }

    const load = loading && !nemCharLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMesage/> : null;
    return (
        <div className="char__list">
            {load}
            {errorMessage}
            {inputArrTransform(charList)}
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