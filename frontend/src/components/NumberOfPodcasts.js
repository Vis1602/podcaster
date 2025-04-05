import React from 'react';
import "../styles/NumberOfPodcasts.css"

const NumberOfPodcasts = ({ podcastsCount }) => {
  return <div className='numberofpodcasts-container' data-testid='numberofpodcasts-container'>{podcastsCount}</div>;
};

export default NumberOfPodcasts;