import React from 'react';
import '../styles/EpisodeCount.css'

function EpisodeCount({ count }) {
  return (
    <div className='episode-count-container'>
      <h2>Episodes: {count}</h2>
    </div>
  )
}

export default EpisodeCount;