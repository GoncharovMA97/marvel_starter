import { useState, useEffect } from 'react';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import Skeleton from '../skeleton/Skeleton';
import PropTypes from 'prop-types';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelServices = new MarvelServices();

    useEffect(() => {
        updateChar(props.charId)
    }, [props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
        setError(false);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const updateChar = (charId) => {

        if (!charId) {
            return;
        }
        
        onCharLoaded();

        marvelServices
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const load = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMesage/> : null;
    const content = !(load || errorMessage || !char) ? <View char={char}/> : null;
    return (
        <div className="char__info">
            {skeleton}
            {load}
            {errorMessage}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const imgNA = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
    const styleImg = imgNA ? {objectFit: 'contain'} : {objectFit: 'cover'};
    const comicsList = comics.map((item, i) => {
                        return(
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )});

    return(
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={styleImg}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;