import React from 'react';
import styles from './style.module.css';

export default function Custom404() {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Page Not Found</h2>
      <p className={styles.description}>
        Oops! It looks like you're lost in space. The page you're looking for doesn't exist.
      </p>
      <a href="/" className={styles.homeLink}>
        Return to Home
      </a>
    </div>
  );
}