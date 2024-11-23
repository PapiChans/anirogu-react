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

function Results({ data, onAnimeClick }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (!data || !data.query) return;

    let api;
    setLoading(true);

    if (data.animeType === 'anime') {
      api = `https://api.jikan.moe/v4/anime?q=${data.query}&sfw&page=${currentPage}`;
    } else {
      api = `https://api.jikan.moe/v4/anime?q=${data.query}&rating=rx&page=${currentPage}`;
    }

    fetch(api)
      .then((response) => response.json())
      .then((resultData) => {
        setResults(resultData.data);
        setTotalPages(resultData.pagination.last_visible_page);
        setHasNextPage(resultData.pagination.has_next_page);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [data, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculatePageRange = () => {
    const visiblePages = 5;
    const halfVisiblePages = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

    if (currentPage <= halfVisiblePages) {
      endPage = Math.min(visiblePages, totalPages);
    }
    if (currentPage >= totalPages - halfVisiblePages) {
      startPage = Math.max(totalPages - visiblePages + 1, 1);
    }

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
      <h6 className="text-light text-center">Search results for: {data.query}</h6>
      <div className="container mt-4">
        <div className="row">
          {results.length > 0 ? (
            results.map((anime) => (
              <div className="col-6 col-sm-4 col-md-4 col-lg-2 mb-3" key={anime.mal_id}>
                <div className="card card-mh border border-primary bg-dark cursor-pointer p-1" onClick={() => onAnimeClick(anime.mal_id)}>
                  <img src={anime.images.webp.image_url} className="img-thumbnail img-mh" alt="Anime" />
                  <div className="card-body overflow-hidden">
                    <p className="text-light fs-7 fw-light">{anime.title_english || anime.title}</p>
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
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {visiblePages.map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}

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



function AnimeInfo({ id, setId }) {
  const [animeDetails, setAnimeDetails] = useState(null);
  const [animeCharacters, setAnimeCharacters] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Create an async function to fetch both API calls sequentially
    const fetchAnimeData = async () => {
      try {
        // Fetch anime details
        const animeDetailsResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        const animeDetailsData = await animeDetailsResponse.json();
        setAnimeDetails(animeDetailsData.data);

        // Fetch anime characters
        const animeCharactersResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
        const animeCharactersData = await animeCharactersResponse.json();
        setAnimeCharacters(animeCharactersData.data);

      } catch (error) {
        console.error('Error fetching anime info or characters:', error);
      }
    };

    // Call the function to fetch the data
    fetchAnimeData();
  }, [id]);

  if (!animeDetails || !animeCharacters) {
    return (
      <div className="text-white text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
      <h4 className="text-light">Anime Full Details</h4>
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-12 justify-content-center d-flex h-100">
            <img src={animeDetails.images.webp.large_image_url} className="img-fluid img-res rounded" alt="Anime" />
          </div>
          <div className="col-lg-8 col-md-8 col-sm-12 mt-2">
            <h5 className="text-light">{animeDetails.title_english || animeDetails.title}</h5>
            <p className="text-light mt-1">Other Names: <span className="text-white-50">{animeDetails.title_english && animeDetails.title_english + " | "} {animeDetails.title || ''} {animeDetails.title_japanese && " | " + animeDetails.title_japanese}</span></p>
            <div className="row">
              <div className="col-4">
                <p className="text-light mt-1">Type: <span className="text-white-50">{animeDetails.type}</span></p>
              </div>
              <div className="col-4">
                <p className="text-light mt-1">Source: <span className="text-white-50">{animeDetails.source}</span></p>
              </div>
              <div className="col-4">
                <p className="text-light mt-1">Total Episodes: <span className="text-white-50">{animeDetails.episodes}</span></p>
              </div>
            </div>
            <p className="text-light mt-1">Status: <span className="text-white-50">{animeDetails.status}</span></p>
            <p className="text-light mt-1">Aired: <span className="text-white-50">{animeDetails.aired.string}</span></p>
            <p className="text-light mt-1">Rating: <span className="text-white-50">{animeDetails.rating}</span></p>
            <p className="text-light mt-1">Season: <span className="text-white-50 text-capitalize">{animeDetails.season} - {animeDetails.year}</span></p>
            <p className="text-light mt-1">Producers: 
            {animeDetails.producers.length > 0 ? (
              animeDetails.producers.map((producer, index) => (
                <React.Fragment key={producer.mal_id}>
                  <span className="text-white-50"> {producer.name}</span>
                  {index < animeDetails.producers.length - 1 && " | "} {}
                </React.Fragment>
              ))
            ) : (
              <span className="text-white-50"> No producers available</span>
            )}
            </p>
            <p className="text-light mt-1">Studios: 
            {animeDetails.studios.length > 0 ? (
              animeDetails.studios.map((studio, index) => (
                <React.Fragment key={studio.mal_id}>
                  <span className="text-white-50"> {studio.name}</span>
                  {index < animeDetails.studios.length - 1 && " | "} {}
                </React.Fragment>
              ))
            ) : (
              <span className="text-white-50"> No studios available</span>
            )}
            </p>
            <p className="text-light mt-1">Genres: 
            {animeDetails.genres.length > 0 ? (
              animeDetails.genres.map((genre, index) => (
                <React.Fragment key={genre.mal_id}>
                  <div className="badge badge-info bg-info mx-1"> {genre.name}</div>
                  {index < animeDetails.genres.length - 1 && " "} {}
                </React.Fragment>
              ))
            ) : (
              <span className="text-white-50"> No Genres available</span>
            )}
            </p>
            <p className="text-light mt-1">Themes: 
            {animeDetails.themes.length > 0 ? (
              animeDetails.themes.map((theme, index) => (
                <React.Fragment key={theme.mal_id}>
                  <div className="badge badge-info bg-info mx-1"> {theme.name}</div>
                  {index < animeDetails.themes.length - 1 && " "} {}
                </React.Fragment>
              ))
            ) : (
              <span className="text-white-50"> No Themes available</span>
            )}
            </p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-6 col-md-6 col-md-12">
            <h4 className="text-light">Synopsis</h4>
            <p className="text-white-50">{animeDetails.synopsis ? animeDetails.synopsis : "No synopsis available"}</p>
          </div>
          <div className="col-lg-6 col-md-6 col-md-12">
          <h4 className="text-light">Relations</h4>
            {animeDetails.relations.length > 0 ? (
                animeDetails.relations.map((relation, index) => (
                  <React.Fragment key={relation.mal_id}>

                      {relation.entry.map((entryItem, entryIndex) => {

                        return (
                          <div className="card mb-2 rounded border border-secondary bg-dark cursor-pointer p-3" onClick={() => setId(entryItem.mal_id)}>
                            <p className="text-light">{relation.relation}</p>
                            <div key={entryItem.mal_id}>
                              <p className="text-white-50">{entryItem.name}</p>
                            </div>
                          </div>
                        );
                      })}

                    {index < animeDetails.relations.length - 1 && " "} {}
                  </React.Fragment>
                ))
              ) : (
                <span className="text-white-50"> No Relations available</span>
              )}
          </div>
        </div>
        <div className="mt-1">
          <h4 className="text-light">Characters</h4>
          <div className="row justify-content-center">
            {animeCharacters === null ? (
                <span className="text-white-50">Loading characters...</span>
              ) : (
                animeCharacters.length > 0 ? (
                  animeCharacters.map((character) => (
                    <div key={character.character.mal_id} className="card mb-2 rounded border border-secondary bg-dark cursor-pointer p-3 col-lg-5 col-md-5 col-sm-5 mx-1">
                      <div className="row align-content-center align-items-center">
                        <div className="col-lg-4 col-md-4 col-sm-12">
                          <div className="d-flex justify-content-center">
                            <img src={character.character.images.jpg.image_url} className="img-fluid rel-img align-content-center justify-content-center" alt="Char pic" />
                          </div>
                        <p className="text-light text-center">{character.character.name}</p>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12">
                          <p className="text-light">Voice Casts:</p>
                          {character.voice_actors && character.voice_actors.length > 0 ? (
                            character.voice_actors.map((voice_actor, index) => (
                              <div key={voice_actor.person.mal_id}>
                                <p className="text-white-50">{voice_actor.person.name} ({voice_actor.language})</p>
                              </div>
                            ))
                          ) : (
                            <span className="text-white-50">No voice actors available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-white-50">No characters available</span>
                )
              )}
          </div>
        </div>
      </div>
    </>
  );
}


const Components = {
  Logo, Search, Results, AnimeInfo
};

// Export the variable
export default Components;
