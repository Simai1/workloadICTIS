import React from "react";
import styles from "./PopUpGoodMessage.module.scss";
import DataContext from "../../context";
const PopUpGoodMessage = (props) => {
  const { appData } = React.useContext(DataContext);

  return (
    <div className={styles.mainPopGood}>
      <div className={styles.mainPop__inner}>
        <div className={styles.x}>
          <img
            src="./img/x.svg"
            alt="x"
            onClick={() => {
              appData.setgodPopUp(false);
              appData.setPopupGoodText("")
              }}
          />
        </div>

        <div className={styles.mainPop__inner__inner}>
          <img src="./img/goodOk.svg" />
        </div>
        <div className={styles.text}><p>{appData.popupGoodText != "" ?  appData.popupGoodText : "Готово!"}</p></div>
      </div>
    </div>
  );
};

export default PopUpGoodMessage;
