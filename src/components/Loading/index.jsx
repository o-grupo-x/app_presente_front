// LoadingBar.js
import React from "react";
import styles from "./style.module.css";

const LoadingBar = ({ progress }) => {
  return (
    <div className={styles.loadingBar}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default LoadingBar;
