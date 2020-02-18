import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Footer from './containers/Footer/Footer';
import { BrowserRouter } from 'react-router-dom';
import HttpsRedirect from 'react-https-redirect';

ReactDOM.render(
    <BrowserRouter>
        <HttpsRedirect>
            <App />
        </HttpsRedirect>
        <Footer />
    </BrowserRouter>, document.getElementsByClassName('main')[0],
);
