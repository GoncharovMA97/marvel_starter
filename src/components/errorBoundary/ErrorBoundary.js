import { Component } from "react/cjs/react.production.min";
import ErrorMesage from "../errorMessage/ErrorMesage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCath(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        });
    }

    render() {
        if (this.props.error) {
            return <ErrorMesage/>
        }
        return this.props.children
    }
}

export default ErrorBoundary;