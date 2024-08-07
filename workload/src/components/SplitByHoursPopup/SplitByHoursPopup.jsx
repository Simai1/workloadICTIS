import React from "react";
import { addСhangedData } from "./../../ui/ContextMenu/Function";
import styles from "./SplitByHoursPopup.module.scss";
import DataContext from "../../context";

function SplitByHoursPopup(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);

  //! вводим в инпут часы и записываем в состояние
  const changeHours = (e, index) => {
    if (e.target.value >= 0) {
      let prevVal = [...tabPar.inputEditValue];
      prevVal[index] = e.target.value;
      tabPar.setInputEditValue(prevVal);
    }
  };

  //! функция для разделения строк при нажатии сохранить
  const handleSplitWorkload = (bufdat, inpValueHoursPopup) => {
    console.log("bufdat", bufdat);
    let updatedData = [];

    if (props.component === "MyWorkload") {
      updatedData = [...tabPar.tableDataMyWorkload];
    } else {
      updatedData = [...basicTabData.workloadDataFix];
    }
    //! находим индекс строки которую будем делить
    const indexWorkload = updatedData.findIndex(
      (el) => el.id === bufdat.workloadId
    );

    //! создадим массив который необходимо вставить в существующий
    const newValue = [];
    for (let i = 0; i < Number(inpValueHoursPopup); i++) {
      const origHours = {
        ...updatedData[indexWorkload],
        ...bufdat.data.hoursData[i],
        id: updatedData[indexWorkload].id + (i + 1),
        isMerged: false,
        isSplit: true,
        educator: "___",
      };
      newValue.push(origHours);
    }

    //! вставляем в массив новые данные
    updatedData = [
      ...updatedData.slice(0, indexWorkload),
      {
        ...updatedData[indexWorkload],
        id: updatedData[indexWorkload].id + 0,
        isSplit: false,
        isSplitArrow: true,
        isMerged: false,
      },
      ...newValue,
      ...updatedData.slice(indexWorkload + 1),
    ];
    if (props.component === "MyWorkload") {
      tabPar.setTableDataMyWorkload(updatedData);
    } else {
      basicTabData.setWorkloadDataFix(updatedData);
    }
    tabPar.setChangedData(
      addСhangedData(tabPar.changedData, "split", bufdat.newIds)
    );
    //! буфер
    appData.setBufferAction([bufdat, ...appData.bufferAction]);
  };

  //! при клике на отмена
  const censelclick = () => {
    tabPar.setSelectedTr("");
    tabPar.setTableDataHoursPopup(null);
    tabPar.setInpValueHoursPopup(2);
    tabPar.setInputEditValue([]);
    tabPar.setBuffDataHoursPopup(null);
    tabPar.setPopupShareShow(false);
    tabPar.setTypeSplit("");
  };

  //! сохранить введенные изменения кнопка сохранить
  const saveClickShare = () => {
    // tabPar.setContextMenuShow(false);
    //! расчитаем часы для буффера
    let hoursData = [];
    console.log(tabPar.tableDataHoursPopup);
    for (let i = 0; i < Number(tabPar.inpValueHoursPopup); i++) {
      const origHours = {
        numberOfStudents:
          tabPar.typeSplit === ""
            ? tabPar.tableDataHoursPopup?.numberOfStudents
            : Number(tabPar.inputEditValue[i]),
        hours: Number(funCalculationHours(i)),
        audienceHours:
          tabPar.typeSplit === "" ? Number(tabPar.inputEditValue[i]) : 0,
        ratingControlHours: Number(funCalculationRatingControlHours(i)),
      };
      hoursData.push(origHours);
    }
    //! расчитаем новые id
    const newIds = Array.from(
      { length: Number(tabPar.inpValueHoursPopup) + 1 },
      (_, index) => tabPar.buffDataHoursPopup.workloadId + index
    );
    const data = {
      ids: [tabPar.buffDataHoursPopup.workloadId],
      hoursData,
      n: Number(tabPar.inpValueHoursPopup) + 1,
    };
    const bufdat = {
      ...tabPar.buffDataHoursPopup,
      data,
      newIds: newIds,
      id: appData.bufferAction.length,
      typeSplit: tabPar.typeSplit,
    };
    tabPar.setBuffDataHoursPopup(bufdat);
    //! вызываем функцию для разделения строк на бэке
    handleSplitWorkload(bufdat, tabPar.inpValueHoursPopup);
    tabPar.setSelectedTr("");
    tabPar.setTableDataHoursPopup(null);
    tabPar.setInpValueHoursPopup(2);
    tabPar.setInputEditValue([]);
    tabPar.setPopupShareShow(false);
    tabPar.setBuffDataHoursPopup(null);
    tabPar.setTypeSplit("");
  };

  //! функция расчета часов
  const funCalculationHours = (index) => {
    let value = 0;
    if (tabPar.typeSplit === "") {
      if (tabPar.inputEditValue[index]) {
        value =
          (Number(tabPar.inputEditValue[index]) /
            tabPar.tableDataHoursPopup.audienceHours) *
          tabPar.tableDataHoursPopup.hours;
      }
    } else {
      if (Number(tabPar.inputEditValue[index])) {
        value =
          Number(tabPar.inputEditValue[index]) * Number(tabPar.typeSplit.hors);
      }
    }
    return value.toFixed(2);
  };

  //! функция расчета часов рейтинг-констроль
  const funCalculationRatingControlHours = (index) => {
    let value = 0;
    if (tabPar.typeSplit === "") {
      if (Number(tabPar.inputEditValue[index])) {
        value =
          (Number(tabPar.inputEditValue[index]) /
            tabPar.tableDataHoursPopup.audienceHours) *
          tabPar.tableDataHoursPopup.ratingControlHours;
      }
    } else {
      if (Number(tabPar.inputEditValue[index])) {
        value =
          Number(tabPar.inputEditValue[index]) * Number(tabPar.typeSplit.hors);
      }
    }
    return value.toFixed(2);
  };

  //! функция для расчета совпадает ли сумма введенных данных с исходными
  const funCalcInputHours = () => {
    const sum = tabPar.inputEditValue?.reduce(
      (accumulator, currentValue) => Number(accumulator) + Number(currentValue),
      0
    );
    if (tabPar.typeSplit === "") {
      return !(tabPar.tableDataHoursPopup.audienceHours === sum);
    } else {
      return !(tabPar.tableDataHoursPopup.numberOfStudents === sum);
    }
  };

  return (
    <div className={styles.popupToShare}>
      <div className={styles.popupToShare_inner}>
        <h2>Расчёт часов</h2>
        <div className={styles.popupToShare_body}>
          <table>
            <thead>
              <tr>
                <th>
                  {tabPar.typeSplit === ""
                    ? "Аудиторные часы"
                    : "Количество студентов"}
                </th>
                <th>Часы рейтинг-контроль</th>
                <th>Часы</th>
              </tr>
              <tr className={styles.trtop}></tr>
            </thead>
            <tbody>
              <tr className={styles.origData}>
                <td>
                  {tabPar.typeSplit === ""
                    ? tabPar.tableDataHoursPopup?.audienceHours
                    : tabPar.tableDataHoursPopup?.numberOfStudents}
                </td>
                <td>{tabPar.tableDataHoursPopup?.ratingControlHours}</td>
                <td>{tabPar.tableDataHoursPopup?.hours}</td>
              </tr>
              {Array.from(
                { length: Number(tabPar.inpValueHoursPopup) },
                (_, index) => (
                  <tr key={index + "tr"}>
                    <td className={styles.inputTd}>
                      <input
                        style={
                          funCalcInputHours()
                            ? {
                                borderColor: "red",
                                transition: "all 0.15s ease",
                              }
                            : null
                        }
                        className={styles.errorBorder}
                        placeholder="0"
                        value={tabPar.inputEditValue[index]}
                        type="number"
                        min="0"
                        onChange={(e) => changeHours(e, index)}
                      />
                    </td>
                    <td>{funCalculationRatingControlHours(index)}</td>
                    <td>{funCalculationHours(index)}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.errortext}>
          {funCalcInputHours() && (
            <span>
              Сумма введенных {tabPar.typeSplit === "" ? "часов" : "студентов"}{" "}
              должна равняться исходному значению!
            </span>
          )}
        </div>

        <div className={styles.button}>
          <div className={styles.buttonlft}>
            <button onClick={censelclick}>Отменить</button>
          </div>
          <div className={styles.buttonrig}>
            <button
              style={
                funCalcInputHours() ? { backgroundColor: "#757575" } : null
              }
              onClick={!funCalcInputHours() ? saveClickShare : null}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplitByHoursPopup;
