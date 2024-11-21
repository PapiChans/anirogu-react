import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Components from './main';

const App = () => {
  const [searchData, setSearchData] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null);

  const handleSearch = (data) => {
    setSearchData(data); // Update state with the input data
    setSelectedAnime(null);
  };

  const handleAnimeClick = (id) => {
    setSelectedAnime(id); // Set the anime ID to fetch details
  };

  return (
    <>
      <Components.Logo />
      <Components.Search onSearch={handleSearch} />
      {selectedAnime ? (
        <Components.AnimeInfo id={selectedAnime} setId={setSelectedAnime} /> // Show AnimeInfo when an anime is selected
      ) : (
        searchData && <Components.Results data={searchData} onAnimeClick={handleAnimeClick} />
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);