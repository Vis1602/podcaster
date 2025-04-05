import React from 'react';
import "../styles/LoadingSign.css"

function LoadingSign() {
  return (
    <div className="loader-container" data-testid="loader-container">
      <div className="loader" data-testid="loader"></div>
    </div>
  )
}

export default LoadingSign