import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main';
import Footer from './components/Footer';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Main></Main>
        <Footer></Footer>
    </React.StrictMode>,
    document.getElementById('root')!
);

// reportWebVitals();
