import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Components from './main';

const logo = ReactDOM.createRoot(document.getElementById('logo'));
logo.render(
  <React.StrictMode>
    <Components.Logo />
  </React.StrictMode>
);

