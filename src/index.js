import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Components from './main';

const App = () => {
  const [searchData, setSearchData] = useState('');

  const handleSearch = (data) => {
    setSearchData(data); // Update state with the input data
  };

  return (
    <>
      <Components.Logo />
      <Components.Search onSearch={handleSearch} />
      {searchData && <Components.Results data={searchData} />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);