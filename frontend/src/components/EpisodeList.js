import React from 'react';
import { Link } from 'react-router-dom';
import { format, fromUnixTime } from 'date-fns';  // 
import '../styles/EpisodeList.css'

function EpisodeList({ episodes, podcastId }) {
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr key={episode.trackId}>
              <td>
                <Link to={`/podcast/${podcastId}/episode/${episode.trackId}`}>{episode.trackName}</Link>
              </td>
              <td>{format(new Date(episode.releaseDate), 'dd/MM/yyyy')}</td>
              <td>{format(fromUnixTime(episode.trackTimeMillis / 1000), 'H:mm:ss')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EpisodeList;