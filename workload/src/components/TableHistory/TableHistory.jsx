import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "./Table";
import styles from "./TableWorkload.module.scss";
import {
  filteredWorkload,
  filteredWorkloadHistory,
  funHistoryFix,
} from "./Function";
import DataContext from "../../context";
import { apiCheckedUpdate, apiGetHistory } from "../../api/services/ApiRequest";
import { FilteredSample } from "../../ui/SamplePoints/Function";

function TableHistory(props) {
  const { tabPar, checkPar, visibleDataPar, basicTabData } =
    useContext(DataContext);
  const [contextShow, setContetxShow] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const [historyData, sethistoryData] = useState([]);
  const [orighistoryData, origsethistoryData] = useState([]);

  //! получаем данные с апи по истории
  useEffect(() => {
    basicTabData.funUpdateHistory();
  }, []);

  useEffect(() => {
    console.log("historyData", historyData);
    console.log("orighistoryData", orighistoryData);
  }, [historyData, orighistoryData]);

  //! достаем и локал стореджа состояние фитрации по заголовку
  useEffect(() => {
    const ssIsChecked = JSON.parse(sessionStorage.getItem("isCheckedHistory")); //! сбросить
    if (ssIsChecked && ssIsChecked !== null && ssIsChecked.length > 0) {
      checkPar.setIsChecked(ssIsChecked);
    }
  }, []);

  //! при событии скролл таблицы изменим индекс первого показываемого tr
  const scrollTable = (e) => {
    const maxStartData = historyData.length - visibleDataPar.visibleData;
    visibleDataPar.setStartData(
      Math.max(
        0,
        Math.min(
          Math.floor(e.target.scrollTop / visibleDataPar.heightTd),
          maxStartData
        )
      )
    );
  };

  //! обновляем вертуальный скролл при переходе на другуюс таблицу
  const containertableRef = useRef(null);

  //! фильтрация по поиску
  useEffect(() => {
    const hd = filteredWorkloadHistory(orighistoryData, props.searchTerm);
    sethistoryData(hd);
  }, [props.searchTerm]);

  //! при нажатии правой кнопки мыши на таблицу открывает меню
  const handleContextMenu = (e) => {
    e.preventDefault();
    let plusX = e.pageX + 256 > window.innerWidth ? -256 : 0;
    let plusY = e.pageY + 320 > window.innerHeight ? -320 : 0;
    tabPar.setContextPosition({ x: e.pageX + plusX, y: e.pageY + plusY });
    tabPar.setContextMenuShow(!tabPar.contextMenuShow);
  };

  useEffect(() => {
    apiGetHistory().then((req) => {
      const hd = req?.filter(
        (it) =>
          it.checked === tabPar.perenesenAction &&
          it.department === basicTabData.nameKaf
      );
      //! преобразуем историю для вывода
      const fixHistory = funHistoryFix(hd);
      const ssIsChecked = JSON.parse(
        sessionStorage.getItem("isCheckedHistory")
      );
      const fdfix = FilteredSample(fixHistory, ssIsChecked, "isCheckedHistory");
      sethistoryData(fdfix);
      origsethistoryData(fixHistory);

      visibleDataPar.setStartData(0);
    });
  }, [
    basicTabData.historyChanges,
    tabPar.perenesenAction,
    basicTabData.nameKaf,
  ]);

  //! функция контекстного меню для перекидывания перенесенных нагрузок
  const funPerenos = () => {
    const data = {
      ids: tabPar.selectedTr,
    };
    apiCheckedUpdate(data).then((res) => {
      tabPar.setSelectedTr([]);
      setContetxShow(false);
      basicTabData.funUpdateHistory();
    });
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={styles.tabledisciplinesMain}
      onScroll={scrollTable}
      ref={containertableRef}
    >
      {contextShow && (
        <div
          style={{
            top: `${contextPosition.y}px`,
            left: `${contextPosition.x}px`,
          }}
          className={styles.contextShow}
        >
          <div onClick={funPerenos}>
            {!tabPar.perenesenAction
              ? 'Добавить в "Перенесенные"'
              : 'Вернуть в "Не перенесенные"'}
          </div>
        </div>
      )}

      <Table
        historyData={historyData}
        orighistoryData={orighistoryData}
        origsethistoryData={origsethistoryData}
        sethistoryData={sethistoryData}
        setContetxShow={setContetxShow}
        contextShow={contextShow}
        contextPosition={contextPosition}
        setContextPosition={setContextPosition}
      />
    </div>
  );
}

export default TableHistory;
