import React, { useEffect, useRef } from "react";

import styles from "./UnlockDepartment.module.scss";
import DataContext from "../../context";
const UnlockDepartment = (props) => {
  const { basicTabData, appData } = React.useContext(DataContext);
  const refSave = useRef(null);

    //! функция разблокирования таблицы
    const UnblockTable = () =>{
        if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 48)){
            const idTableUnlock = basicTabData?.tableDepartment.find((el)=>el.name === basicTabData?.nameKaf).id
            console.log("idTableUnlock", idTableUnlock)
            props.denyClick()
            basicTabData.funUpdateTable(
                basicTabData.tableDepartment.find(
                  (el) => el.name === basicTabData?.nameKaf
                )?.id
              );
        }else{
            const idTableUnlock = appData.myProfile.educator.departmentId
            console.log("idTableUnlock", idTableUnlock)
            props.denyClick()
            basicTabData.funUpdateTable(
                basicTabData.tableDepartment.find(
                  (el) => el.name === basicTabData?.nameKaf
                )?.id
              );
        }
    }

   //! сброс состояния при клике на другую область
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (refSave.current && !refSave.current.contains(event.target)) {
            props.denyClick();
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);


  return (
    <div className={styles.UnlockDepartment} ref={refSave}>
           <div className={styles.trangle}></div>
      <div>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.btnBox}>
          <button onClick={() => props.denyClick()}>Нет</button>
          <button onClick={UnblockTable}>Да</button>
        </div>
      </div>

    </div>
  );
};

export default UnlockDepartment;
