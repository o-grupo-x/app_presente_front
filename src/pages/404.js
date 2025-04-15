import React from 'react';
import styles from './style.module.css';

export default function Custom404() {
  return (
    <main className={styles.containerError}>
      <h1 className={styles.error404}>404</h1>
      <h2 className={styles.message}>Página não encontrada</h2>
      <p className={styles.description}>
        Desculpe, a página que você procura não existe ou foi movida.
      </p>
    </main>
  );
}
