import React, { useEffect, useRef, useState } from "react";
import styles from "./Warnings.module.scss";
import WarningMessage from "../../ui/WarningMessage/WarningMessage";
import socketConnect from "../../api/services/socket";
import DataContext from "../../context";
import { ReactComponent as SvgNotification } from "./../../img/notification.svg";
import { Educator } from "../../api/services/ApiRequest";
import { getAllWarnin } from "../../api/services/AssignApiData";
function Warnings(props) {
  const { appData } = React.useContext(DataContext);

  const [isListOpen, setListOpen] = useState(false);
  // const [arrMessage, setMessage] = useState(appData.allWarningMessage);
  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  //! клина на предупреждение
  const directLks = (index) => {
    props.setSelectedComponent("Teachers"); // переходим к компоненту с преподавателями
    props.handleNameChange(
      appData.allWarningMessage[index - 1].Educator.name,
      "postTeacher",
      "betTeacher"
    );
    props.setEducatorData(appData.allWarningMessage[index - 1].Educator);
  };

  useEffect(() => {
    socketConnect().then((data) => {
      // data && setMessage(data.existingNotification); //!!! исправить
      console.log("socketConnect", data);
      getAllWarnin(appData.setAllWarningMessage);
    });
  }, []);

  // закрытие модального окна при нажатии вне него
  const refLO = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (refLO.current && !refLO.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);
  return (
    <div ref={refLO} className={styles.Warnings}>
      <div onClick={toggleList} className={styles.WarningsButton}>
        {appData.allWarningMessage.length > 0 && (
          <div className={styles.red_circle}></div>
        )}
        <SvgNotification className={styles.svg_notice} />
      </div>
      {isListOpen && (
        <div className={styles.WarningsOpen}>
          <div className={styles.triangle}></div>
          <div className={styles.WarningsButtonOpen}>
            <p className={styles.circlesbuttonWarn}>
              <span className={styles.span_length}>
                {appData.allWarningMessage?.length}
              </span>
            </p>
            <p>Предупреждения</p>
          </div>
          <div className={styles.WarningsList}>
            <ul>
              {appData.allWarningMessage?.map((el, index) => {
                return (
                  <WarningMessage
                    name={appData.allWarningMessage[index].Educator.name}
                    key={el.id}
                    arrMessage={el}
                    id={index + 1}
                    directLks={directLks}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warnings;
