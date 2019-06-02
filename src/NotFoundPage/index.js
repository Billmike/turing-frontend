import React from 'react';
import './styles.scss';

const NotFoundPage = ({ history }) => (
  <div>
    <div className="not-found-container">
      <p className="pnf">Page not found</p>
      <button onClick={() => history.push('/')} className="back-to-page">
        Go back
      </button>
    </div>
  </div>
);

export default NotFoundPage;
