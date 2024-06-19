import React, { useState, useEffect, useRef } from "react";
import styles from "./TableLks.module.scss";
import ArrowBack from "./../../img/arrow-back.svg";
import DataContext from "../../context";
import { EducatorKard, EducatorLK } from "../../api/services/ApiRequest";
import { headersEducator, tableHeadersLks } from "../TableWorkload/Data";
function TableLks(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [EducatorLkData, setEducatorLkData] = useState([]);
  const [tableData, setTableData] = useState([]);
  // const [colorHours, setColorHours] = useState(null);
  const { appData } = React.useContext(DataContext);
  const [filteredData, setFilteredData] = useState([]);

  // const th = [
  //   { key: "department", label: "Кафедра" },
  //   { key: "discipline", label: "Дисциплина" },
  //   { key: "hoursFirstPeriod", label: "Часы период 1" },
  //   { key: "hoursSecondPeriod", label: "Часы период 2" },
  //   { key: "hoursWithoutPeriod", label: "Дополнительные часы" },
  // ];
  const [tableHeaders, setTableHeaders] = useState(tableHeadersLks);

  // useEffect(()=>{
  //   console.log("EducatorLkData", EducatorLkData)
  //   console.log("EducatorLkData?.position", EducatorLkData.position)
  //   console.log("EducatorLkData?.totalHours", EducatorLkData.totalHours)
  //   console.log("EducatorLkData?.rate", EducatorLkData.rate)
  //   setColorHours(appData.WhyColor(EducatorLkData?.position, EducatorLkData?.totalHours, EducatorLkData?.rate))
  // },[EducatorLkData,])

  //! получаем данные личного кабинета преподавателя
  useEffect(() => {
    console.log(props.educatorIdforLk);
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 41)) {
      EducatorLK(props.educatorIdforLk).then((data) => {
        console.log("EducatorKard ", [data]);
        setEducatorLkData(data);
        setTableData([data]);
        setTableHeaders(headersEducator);
      });
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 40)) {
      EducatorKard(props.educatorIdforLk).then((data) => {
        console.log("EducatorKard ", data);
        setEducatorLkData(data);
        setTableData(data.workloads[0]);
        setTableHeaders(tableHeadersLks);
      });
    }
  }, [props.educatorIdforLk]);

  //! то что введено в поисковую строку, обновляет данные компонента
  useEffect(() => {
    setSearchTerm(props.searchTerm);
  }, [props.searchTerm]);

  //! клик на стрелку назад
  const handleNameClick = () => {
    props.setEducatorIdforLk("");
    props.changeInput();
  };

  useEffect(() => {
    const fd = tableData.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(fd);
  }, [tableData, searchTerm]);

  // Функция для определения цвета фона
  const [showFullText, setShowFullText] = useState(false);
  // useEffect(()=>{
  //   console.log("showFullText", showFullText)
  // },[showFullText])
  const lenSlice = 100;
  const gettdInnerText = (key, item, index) => {
    if (showFullText === index) {
      if (item === null || item === undefined || item === "") {
        return "___";
      }
      if (key === "id") {
        return index + 1;
      } else {
        return item;
      }
    } else {
      if (key === "id") {
        return index + 1;
      } else if (item === null || item === undefined || item === "") {
        return "___";
      } else if (typeof item === "string" && item.length > lenSlice) {
        return item.slice(0, lenSlice) + "...";
      } else {
        return item;
      }
    }
  };

  //! функция определения класса td для открытия длинного текста в попап со скролом
  const getClaasNametdInner = (index, row) => {
    let text = styles.notdatadiv;
    if (showFullText === index && row?.length > lenSlice) {
      text = `${text} ${styles.gettdInner}`;
    }
    return text;
  };

  return (
    <div className={styles.TableLks}>
      {appData.metodRole[appData.myProfile?.role]?.some((el) => el === 16) && (
        <button className={styles.buttonBack} onClick={handleNameClick}>
          <img src={ArrowBack} alt="arrow"></img>
          <p>Назад</p>
        </button>
      )}
      <div className={styles.DataLks}>
        <div className={styles.DataLksInner}>
          <div className={styles.DataLksHead}>
            <h1>{EducatorLkData?.name}</h1>
            <div
              className={styles.DataLksHeadSchet}
              style={
                EducatorLkData
                  ? {
                      backgroundColor: appData.WhyColor(
                        EducatorLkData?.position,
                        EducatorLkData?.totalHours,
                        EducatorLkData?.rate
                      ),
                    }
                  : null
              }
            >
              <p>
                <span>{EducatorLkData?.totalHours}</span>/
                <span>{900 * EducatorLkData?.rate}</span>
              </p>
            </div>
          </div>

          <p>Кафедра: {EducatorLkData?.department}</p>
          <p>Должность: {EducatorLkData?.position}</p>
          <p>Ставка: {EducatorLkData?.rate}</p>
        </div>
      
      </div>

      {filteredData.length > 0 ? (
        <div
          className={styles.TableLks__inner}
          style={
            filteredData.length === 1
              ? { overflowY: "hidden" }
              : filteredData.length < 5
              ? { height: `${150 * (filteredData.length + 1)}px` }
              : null
          }
        >
          <table
            className={styles.TableLks}
            style={
              filteredData.length < 5
                ? { height: `${150 * (filteredData.length + 1)}px` }
                : null
            }
          >
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th name={header.key} key={header.key}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
                  {tableHeaders.map((key) => {
                    return (
                      <td
                        name={key.key}
                        key={key.key}
                        className={styles.tdspecialtyTd}
                      >
                        <div
                          onMouseEnter={
                            row[key.key]?.length > lenSlice
                              ? () => setShowFullText(index)
                              : null
                          }
                          onMouseLeave={() => setShowFullText(null)}
                          className={styles.tdInner}
                        >
                          <div
                            className={getClaasNametdInner(index, row[key.key])}
                            style={
                              showFullText === index &&
                              row[key.key]?.length > lenSlice
                                ? {
                                    position: "absolute",
                                    backgroundColor: "#fff",
                                    width: "100%",
                                    padding: "4px",
                                    top: "-45px",
                                    boxShadow:
                                      "0px 3px 18px rgba(0, 0, 0, 0.15)",
                                    zIndex: "200",
                                  }
                                : null
                            }
                          >
                            {gettdInnerText(key.key, row[key.key], index)}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.notData}>
          <h2>Нет данных</h2>
        </div>
      )}
    </div>
  );
}

export default TableLks;
