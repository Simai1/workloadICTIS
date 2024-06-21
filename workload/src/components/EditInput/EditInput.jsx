import React, { useState, useEffect, useRef } from "react";
import styles from "./EditInput.module.scss";
import arrow from "./../../img/arrow.svg";
// import { useDispatch } from "react-redux";
// import { actions } from "./../../store/filter/filter.slice";
import DataContext from "../../context";
// import { headers as hed } from "../TableDisciplines/Data";

function EditInput({ selectedComponent, originalHeader, ssname }) {
  const { basicTabData } = React.useContext(DataContext);

  const headers = [...basicTabData.tableHeaders];
  const [searchResults, setSearchResults] = useState(headers);
  const [isListOpen, setListOpen] = useState(false);
  const ssUpdatedHeader = JSON.parse(sessionStorage.getItem(ssname));
  // console.log("length", ssUpdatedHeader.length, originalHeader.length);
  const [isAllChecked, setIsAllChecked] = useState(
    originalHeader?.length === ssUpdatedHeader?.length ? true : false
  );
  const [checkedItems, setCheckedItems] = useState(
    Array(originalHeader.slice(3).length).fill(true)
  );
  const [isChecked, setChecked] = useState(
    ssUpdatedHeader
      ? originalHeader
          .map((item) => item.key)
          .filter((el) => {
            if (!ssUpdatedHeader.map((i) => i.key).includes(el)) {
              return el;
            }
          })
      : []
  );

  useEffect(() => {
    const ssuh = JSON.parse(sessionStorage.getItem(ssname));
    const ssuhfix = ssuh?.map((el) => el.key);
    const oh = originalHeader.map((item) => item.key);
    const ohfix = oh.filter((el) => !ssuhfix?.some((e) => e === el));
    console.log("isChecked", isChecked, "oh", oh, "ohfix", ohfix);
    setChecked(ohfix);
    setIsAllChecked(
      originalHeader?.length === ssUpdatedHeader?.length ? true : false
    );
  }, [originalHeader]);

  useEffect(() => {
    setSearchResults(originalHeader.slice(3));
    console.log("originalHeader", originalHeader.slice(3));
  }, [basicTabData.tableHeaders, selectedComponent]);

  //! закрытие модального окна при нажатии вне него
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

  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  //! при нажатии input
  const takeFunction = (index, value) => {
    // handleItemClick(value.key);
    let checked = [...isChecked];
    toggleChecked(index);
    if (checked.some((item) => item === value.key)) {
      checked = checked.filter((item) => item !== value.key);
    } else {
      checked.push(value.key);
    }
    setChecked([...checked]);
    // Фильтрация заголовков
    const filteredHeaders = originalHeader.filter(
      (header) => !checked.includes(header.key)
    );
    basicTabData.setTableHeaders(filteredHeaders);
    sessionStorage.setItem(ssname, JSON.stringify(filteredHeaders));
    if (checked.length === 0) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  };
  const toggleChecked = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  //! поиск
  const handleSearch = (el) => {
    const query = el.target.value;
    setSearchResults(
      headers.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    );
    if (query === "") {
      setSearchResults(headers);
    }
  };

  //! при нажатии все
  function takeFunctionAll() {
    setIsAllChecked(!isAllChecked);
    console.log("isChecked", isChecked);
    if (isChecked.length !== 0) {
      console.log("1");
      setChecked([]);
      basicTabData.setTableHeaders([...originalHeader]);
      sessionStorage.setItem(ssname, JSON.stringify([...originalHeader]));
    } else {
      console.log("2");
      setChecked([...originalHeader.slice(3)].map((el) => el.key));
      basicTabData.setTableHeaders([...originalHeader].slice(0, 3));
      sessionStorage.setItem(
        ssname,
        JSON.stringify([...originalHeader].slice(0, 3))
      );
    }
  }

  // useEffect(() => {
  //   console.log("isChecked", isChecked);
  // }, [isChecked]);

  return (
    <div ref={refLO} className={styles.EditInput}>
      {!isListOpen && (
        <button onClick={toggleList}>
          <p>Редактирование полей</p>
          <img src={arrow} alt="arrow"></img>
        </button>
      )}
      {isListOpen && (
        <div className={`${styles.EditInputOpen} ${styles.fadein}`}>
          <button onClick={toggleList}>
            <p>Редактирование полей</p>
            <img
              src={arrow}
              alt="arrow"
              style={{
                transform: "rotate(-180deg)",
                left: "10px",
                position: "relative",
              }}
            ></img>
          </button>
          <input
            placeholder="Поиск"
            type="text"
            className={styles.edit_input}
            onChange={handleSearch}
            id="search2"
            name="search2"
          />
          <div className={styles.EditInputList}>
            <ul className={styles.fadeinul}>
              <li>
                <input
                  type="checkbox"
                  onChange={takeFunctionAll}
                  checked={isAllChecked}
                  className={styles.customInput}
                  name="search3"
                />
                <p>Все</p>
              </li>
              {searchResults.map((row, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    onChange={() => takeFunction(index, row)}
                    checked={!isChecked.includes(row.key)}
                    className={styles.customInput}
                    id={`search3-${index}`}
                    name="search3"
                  />
                  <p>{row.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditInput;
