import { Component } from 'react/cjs/react.production.min';
import MarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelServices = new MarvelServices();

    componentDidMount() {
        this.updateChar(this.props.charId)
    }

    componentDidUpdate(PrevProps) {
        if (this.props.charId !== PrevProps.charId) {
            this.updateChar(this.props.charId)
        };
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
            error: false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    updateChar = (charId) => {

        if (!charId) {
            return;
        }
        
        this.onCharLoaded();

        this.marvelServices
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;
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

export default CharInfo;