import React from 'react'
import './index.css';
import LogoText from './assets/images/logotext.png';

const Logo = () => {
  return (
    <>
      <div className="container text-center pt-5 w-100">
        <img src={LogoText} className="img-fluid h-25 w-25 w-md-50 w-lg-75" alt="Project Logo" />
      </div>
    </>
  )
};

const Components = {
  Logo,
};

// Export the variable
export default Components;
