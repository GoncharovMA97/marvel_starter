import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useMarvelServices from '../../../services/MarvelServices';
import Spinner from '../../spinner/Spinner';
import ErrorMesage from '../../errorMessage/ErrorMesage';
import AppBanner from '../../appBanner/AppBanner';

import './singleComic.scss';

const SingleComic = () => {

    const [comic, setComic] = useState(null);
    const {comicId} = useParams();

    const {loading, error, getComic, clearError} = useMarvelServices();

    useEffect(() => {
        updateComic()
    }, [comicId])

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(setComic);
    }
    const load = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMesage/> : null;
    const content = !(load || errorMessage || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            <AppBanner/>
            {load}
            {errorMessage}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {name, description, pageCount, thumbnail, language, price} = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComic;