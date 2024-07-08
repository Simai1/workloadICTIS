import React, { useEffect, useRef, useState } from "react";
import styles from "./../ContextMenu.module.scss";
import DataContext from "../../../context";
import {
  addСhangedData,
  getStylePosition,
  splitWorkloadCount,
} from "../Function";

export function SubMenu(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);

  //! разделение нагрузки на count
  const handleSplitWorkload = (cou) => {
    const count = Number(cou);
    const dataSel = {
      ids: tabPar.selectedTr,
      n: count,
    };

    const prev = basicTabData.workloadDataFix.filter((item) =>
      tabPar.selectedTr.some((el) => el === item.id)
    );

    // Создаем новый массив для измененных данных
    let updatedData = [...basicTabData.workloadDataFix];
    const funData = splitWorkloadCount(updatedData, tabPar.selectedTr, count);
    basicTabData.setWorkloadDataFix(funData.updatedData);
    console.log(funData.blocked);
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "split", funData.blocked)
    );

    console.log("funData", funData);
    //! буфер
    appData.setBufferAction([
      {
        id: appData.bufferAction.length,
        request: "splitWorkload",
        data: dataSel,
        prevState: [...prev],
        newState: funData.newState,
        newIds: [...funData.newIds],
        hoursData: funData.hoursData,
      },
      ...appData.bufferAction,
    ]);
    //! занесем id измененнных данных в состояние
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "split", funData.newIds)
    );
    tabPar.setSelectedTr([]);
    tabPar.setContextMenuShow(false);
    props.setMenuShow("");
  };

  //! переменная которая хранит ширину данного меню
  const [menuWidth, setMenuWidth] = useState(136);
  const menuRef = useRef(null);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth);
    }
  }, [menuRef.current]);

  return (
    <div
      ref={menuRef}
      className={styles.blockMenuRight}
      style={getStylePosition(
        tabPar.contextPosition,
        window.innerWidth,
        menuWidth,
        props.conxextMenuRef
      )}
    >
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => handleSplitWorkload("2")}
        >
          На 2 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => handleSplitWorkload("3")}
        >
          На 3 потока
        </button>
      </div>
      <div>
        <button
          className={styles.activeStylePointer}
          onClick={() => handleSplitWorkload("4")}
        >
          На 4 потока
        </button>
      </div>
    </div>
  );
}
