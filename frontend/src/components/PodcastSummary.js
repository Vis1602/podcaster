import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PodcastSummary.css';

function PodcastSummary({ podcast }) {
  const title = podcast?.title?.label?.split(' - ')[0];
  const imageUrl = podcast?.['im:image']?.[2]?.label;
  const artist = podcast?.['im:artist']?.label;
  const summary = podcast?.summary?.label;
  const podcastId = podcast?.id?.attributes?.['im:id'];

  //I didn't find a way to set the "text decoration none" correctly in the CSS so for now, its inline
  return (
    <div className="podcast-summary-container">
      <Link to={`/podcast/${podcastId}`} style={{ textDecoration: 'none' }}>
        <img src={imageUrl} alt={title} />
      </Link>
      <div className="podcast-details">
        <Link to={`/podcast/${podcastId}`} style={{ textDecoration: 'none' }}>
          <h3>{title}</h3>
        </Link>
        <p>by {artist}</p>
      </div>
      <div className="podcast-description">
        <h4>Description:</h4>
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default PodcastSummary;