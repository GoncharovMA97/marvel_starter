import { useForm } from "react-hook-form";
import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMesage';
import PropTypes from 'prop-types';

import './charSearchForm.scss';

const CharSearchForm = (props) => {
    const [char, setChar] = useState(null);   
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {loading, error, getCharacterByName} = useMarvelServices();

    const onSubmit = data => updateChar(data);

    const updateChar = (name) => {

        if (!name) {
            return;
        }

        getCharacterByName(name)
            .then(setChar);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMesage /></div> : null;
    const results = !char ? null : char.length > 0 ?
                    <div className="char__search-wrapper">
                        <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                            <div className="inner">To page</div>
                        </Link>
                    </div> : 
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;


    return (
    <div className="char__search-form">
        <label className="char__search-label">Or find a character by name:</label>
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)} className="char__search-wrapper">
            {/* register your input into the hook by invoking the "register" function */}
            <input {...register("name", { required: true })} placeholder="Enter name"/>
            {/* errors will return when field validation fails  */}
            <div className="char__search-error">
                {errors.name && <span>This field is required</span>}
            </div>
            <input type="submit" 
                    className="button button__main"
                    disabled={loading}>
                <div className="inner">find</div>
            </input>
        </form>
        {errorMessage}
        {results}
    </div>
    );
    }

export default CharSearchForm;