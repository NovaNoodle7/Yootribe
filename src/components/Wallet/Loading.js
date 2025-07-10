import React from 'react';

export const Loading = ({ loading, token }) => {
  if (loading * 1 <= 0) {
    return null;
  }

  return (
    <div className="wallet-loading">
      <div className="bg" style={{ opacity: loading }}></div>
      <div className="content">
        <div className="loading-spinner" />

        <div className="loading-text">
          <p>Acquiring your datas from the Blockchain... standby</p>

          <p>
            <small>{token}</small>
          </p>
        </div>
      </div>
    </div>
  );
};
