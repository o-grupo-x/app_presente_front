import React from 'react';
import styles from './style.module.css'

export default function Custom500() {
  return (
    <div className={styles.containerError}>
      <h1 className={styles.error404}>500 - Internal Server Error</h1>
    </div>
  );
}