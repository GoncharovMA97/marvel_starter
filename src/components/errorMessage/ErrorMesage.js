import img from './error.gif';

const ErrorMesage = () => {
    return (
        <img src={img} style={{display: 'block', margin: '0 auto', width: '180px', height: '180px'}} alt="Error"/>
    )
}

export default ErrorMesage;