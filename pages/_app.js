import App from 'next/app';
import { Provider } from 'react-redux';
import { getStore } from '../store';
class MyApp extends App {
    constructor(props) {
        super(props);
        this.store = getStore();
    }
    render() {
        const { Component, pageProps } = this.props;
        return (
            <Provider store={this.store}>
                <Component {...pageProps} />
            </Provider>
        )
    }

}

export default MyApp;