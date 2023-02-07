import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [nemComicsLoading, setNemComicsLoading] = useState(false);
    const [offset, setOffset] = useState(21);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelServices();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial = false) => {
        setNemComicsLoading(!initial);
        getAllComics(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newComicsList) => {
        let onEnd = false;

        if (offset > 61) {
            onEnd = true;
        };

        setComicsList((comicsList) => [...comicsList, ...newComicsList]);
        setNemComicsLoading(false);
        setOffset((offset) => offset + 9);
        setComicsEnded(onEnd);
    }

    const inputArrTransform = (arr) => {
        const newArr = arr.map(item => {
            return(
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.name} className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        });
        return(
            <ul className="comics__grid">
                {newArr}
            </ul>
        );

    }

    const load = loading && !nemComicsLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMesage/> : null;

    return (
        <div className="comics__list">
                {load}
                {errorMessage}
                {inputArrTransform(comicsList)}
            <button  
                onClick={() => onRequest(offset)}
                disabled={nemComicsLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;