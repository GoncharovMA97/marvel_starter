import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({Component, dataType}) => {

    const [data, setData] = useState(null);
    const {id} = useParams();

    const {loading, error, getComic, getCharacter, clearError} = useMarvelServices();

    useEffect(() => {
        updatePage()
    }, [id])

    const updatePage = () => {
        clearError();
        switch (dataType) {
            case 'comic': 
                getComic(id)
                    .then(setData);
                    break;

            case 'character':
                getCharacter(id)
                .then(setData);
        }
    }

    const load = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMesage/> : null;
    const content = !(load || errorMessage || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {load}
            {errorMessage}
            {content}
        </>
    )
}

export default SinglePage;