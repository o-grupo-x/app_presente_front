import React from 'react';
import styles from './style.module.css'

export default function Custom404() {
  return (
    <div className={styles.containerError}>
      <h1 className={styles.error404}>404 - Page Not Found </h1>
      <h2 className={styles.error404}>Pagina errada fiote, vai tomar no cu </h2>       
    </div>
  );
}
