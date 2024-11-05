import React from 'react';
import './index.css';
import LogoText from './assets/images/logotext.png';
import { useEffect, useState } from 'react';

const Logo = () => {
  return (
    <>
      <div className="container justify-content-center text-center pt-5 w-100">
        <img src={LogoText} className="img-fluid logo-display cursor-pointer" alt="Project Logo" />
      </div>
    </>
  )
};

const Search = ({ onSearch }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData)
    onSearch(data.query);
  };

  return (
    <>
      <div className="container justify-content-center text-center mt-4 w-100">
        <div className="row justify-content-center">
          <div className="col-8">
            <form onSubmit={handleSubmit} className="d-flex">
              <input
              className="form-control form-control-md me-2"
              type="text"
              name="query"
              placeholder="Search Anime..."
              required
              />
              <button type="submit" className="btn btn-outline-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

function Results({ data }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect to handle the data fetching based on `data` prop
  useEffect(() => {
    if (!data) return; // Avoid making a request if data is empty or undefined

    setLoading(true); // Start loading state
    fetch(`https://api.jikan.moe/v4/anime?q=${data}&sfw`)
      .then((response) => response.json())
      .then((data) => {
        setResults(data.data); // Store the fetched results in state
        setLoading(false); // Set loading state to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [data]); // Only re-run the effect if `data` changes

  if (loading) {
    return <div className='justify-content-center text-center mt-4'><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div className="container justify-content-center mt-4 w-100">
      <h6 className="text-light text-center">
        Search results for: {data}
      </h6>
      <div className='container mt-4'>
        <div className='row'>
          {results.length > 0 ? (
            results.map((anime) => (
              <div className='col-6 col-sm-4 col-md-4 col-lg-2 mb-3'>
                <div key={anime.mal_id} className='card border border-primary bg-dark cursor-pointer'>
                <img src={anime.images.webp.image_url} className="img-thumbnail" alt="Anime" />
                  <div className='card-body'>
                    <p className='text-light fs-6 fw-light'>{anime.title_english ? anime.title_english : anime.title}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

const Components = {
  Logo, Search, Results
};

// Export the variable
export default Components;
