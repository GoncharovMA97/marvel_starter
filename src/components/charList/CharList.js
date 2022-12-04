import { Component } from 'react/cjs/react.production.min';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import PropTypes from 'prop-types';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        nemCharLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelServices = new MarvelServices();

    componentDidMount() {
        this.onRequest();
    }

    onRequest(offset) {
        this.setState({newCharListLoading: true})
        this.marvelServices
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoaded = (newCharList) => {
        let onEnd = false;

        if (this.state.offset > 1561) {
            onEnd = true;
        };

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            error: false,
            newCharListLoading: false,
            offset: offset + 9,
            charEnded: onEnd
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    inputArrTransform(arr) {
        const newArr = arr.map(item => {
            const imgNA = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
            const styleImg = imgNA ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return(
                <li className="char__item" key={item.id} onClick={() => this.props.onCharSelected(item.id)}>
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

    render() {
        const {charList, loading, error, newCharListLoading, offset, charEnded} = this.state;
        const transArr = this.inputArrTransform(charList)
        const load = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMesage/> : null;
        const content = !(load || errorMessage) ? transArr : null;
        return (
            <div className="char__list">
                {load}
                {errorMessage}
                {content}
                <button 
                    onClick={() => this.onRequest(offset)}
                    disabled={newCharListLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;