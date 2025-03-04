import styles from "./fundo.module.css";

export const Fundo = (props) => {
  return (
    <div className={styles.conteiner}>
      <div className={styles.conteiner_login}>
        <div className={styles.wrap_login}>
          {props.children}</div>
      </div>
    </div>
  );
};
