import React from 'react'
import ReactDOM from 'react-dom/client'
import '../node_modules/@mdi/font/css/materialdesignicons.min.css';

// import '../node_modules/materialize-css/dist/css/materialize/.min.css';
// import '../node_modules/materialize-css/dist/jsx/materialize/.min.jsx';
import App from './App.jsx'
import './styles/style.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>,
)
