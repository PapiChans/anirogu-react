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
  const [animeType, setAnimeType] = useState('anime');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData); // { query: "some query", animeType: "anime" }
    onSearch({ query: data.query, animeType }); // Pass both query and animeType
  };

  const handleRadioChange = (event) => {
    setAnimeType(event.target.value);
  };

  return (
    <div className="container justify-content-center text-center mt-4 w-100">
      <div className="row justify-content-center">
        <div className="col-8">
          <form onSubmit={handleSubmit}>
            <div className="d-flex">
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
            </div>
            <div className="d-flex mt-2">
              <p className="text-light fs-6 mx-2">Type: </p>
              <input
                className="form-check-input mx-1"
                type="radio"
                name="animeType"
                id="type-Anime"
                value="anime"
                checked={animeType === 'anime'}
                onChange={handleRadioChange}
              />
              <label className="form-check-label text-light fs-6 mx-1" htmlFor="type-Anime">
                Anime
              </label>
              <input
                className="form-check-input mx-1"
                type="radio"
                name="animeType"
                id="type-HAnime"
                value="h-anime"
                checked={animeType === 'h-anime'}
                onChange={handleRadioChange}
              />
              <label className="form-check-label text-light fs-6 mx-1" htmlFor="type-HAnime">
                H-Anime
                <span class=" mx-1 badge bg-danger">18+</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Results({ data }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Store the current page
  const [totalPages, setTotalPages] = useState(1);  // Store total pages based on API response
  const [hasNextPage, setHasNextPage] = useState(false); // Track if there's a next page

  useEffect(() => {
    if (!data || !data.query) return; // Avoid making a request if data is empty or undefined

    let api;

    setLoading(true); // Start loading state

    // Construct the API URL based on the anime type and current page
    if (data.animeType === 'anime') {
      api = `https://api.jikan.moe/v4/anime?q=${data.query}&sfw&page=${currentPage}`; // Add page param
    } else {
      api = `https://api.jikan.moe/v4/anime?q=${data.query}&rating=rx&page=${currentPage}`; // Add page param
    }

    // Make the fetch request
    fetch(api)
      .then((response) => response.json())
      .then((resultData) => {
        setResults(resultData.data); // Store the fetched results in state
        setTotalPages(resultData.pagination.last_visible_page); // Set total pages from the API
        setHasNextPage(resultData.pagination.has_next_page); // Set whether there's a next page
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading in case of error
      });
  }, [data, currentPage]); // Re-fetch when data or currentPage changes

  // Handle page change (previous/next)
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(page);
  };

  // Handle "Next" page
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle "Previous" page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate the page range to show
  const calculatePageRange = () => {
    const visiblePages = 5;
    const halfVisiblePages = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

    // Adjust if we're close to the start or end
    if (currentPage <= halfVisiblePages) {
      endPage = Math.min(visiblePages, totalPages);
    }
    if (currentPage >= totalPages - halfVisiblePages) {
      startPage = Math.max(totalPages - visiblePages + 1, 1);
    }

    // Generate an array of page numbers
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  if (loading) {
    return (
      <div className="justify-content-center text-center mt-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const visiblePages = calculatePageRange();

  return (
    <div className="container justify-content-center mt-2 w-100">
      <h6 className="text-light text-center">
        Search results for: {data.query}
      </h6>
      <div className="container mt-4">
        <div className="row">
          {results.length > 0 ? (
            results.map((anime) => (
              <div className="col-6 col-sm-4 col-md-4 col-lg-2 mb-3" key={anime.mal_id}>
                <div className="card card-mh border border-primary bg-dark cursor-pointer p-1" onClick={() => AnimeInfo(anime.mal_id)}>
                  <img src={anime.images.webp.image_url} className="img-thumbnail img-mh" alt="Anime" />
                  <div className="card-body overflow-hidden">
                    <p className="text-light fs-7 fw-light">{anime.title_english ? anime.title_english : anime.title}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2 className="text-light text-center">No results found.</h2>
          )}
          {results.length > 0 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {/* Page Number Buttons */}
                {visiblePages.map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNextPage} disabled={!hasNextPage}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}


function AnimeInfo(id) {
  console.log(id)
  fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
    .then((response) => response.json())
    .then((resultData) => {
      console.log(resultData)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

const Components = {
  Logo, Search, Results
};

// Export the variable
export default Components;
