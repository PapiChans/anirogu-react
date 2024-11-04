import React from 'react';
import './index.css';
import LogoText from './assets/images/logotext.png';

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
    console.log(data);
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
  return (
    <div className="container justify-content-center text-center mt-4 w-100 bg-danger">
      <h1>{data ? data : "No results yet"}</h1>
    </div>
  );
}

const Components = {
  Logo, Search, Results
};

// Export the variable
export default Components;
