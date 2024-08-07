import React from "react";
import { Link } from "react-router-dom";
import styles from "./Authorization.module.scss";
// http://localhost:3010/auth/loginSfedu
function Authorization() {
  return (
    <main className={styles.Authorization}>
      <div className={styles.Authorization_container}>
        <h2>Авторизация</h2>
        <a
          className={styles.button}
          // href="https://workload.sfedu.ru/auth/loginSfedu"
          href="http://localhost:3002/auth/loginSfedu"
        >
          Войти через сервис Microsoft
        </a>
      </div>
    </main>
  );
}

export default Authorization;
