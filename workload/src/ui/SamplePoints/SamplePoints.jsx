import React, { useEffect, useRef, useState } from "react";
import styles from "./SamplePoints.module.scss";
import DataContext from "../../context";
import { FilteredSample } from "./Function";

export function SamplePoints(props) {
  const { tabPar, checkPar, basicTabData } = React.useContext(DataContext);
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  //! чтобы SamplePoints не выходил за пределы таблицы
  const spRef = useRef(null);
  useEffect(() => {
    if (spRef.current) {
      const divRect = spRef.current.getBoundingClientRect();
      if (divRect.x + 300 > window.innerWidth) {
        spRef.current.style.left = "-100px";
      }
    }
  }, [spRef]);

  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (spRef.current && !spRef.current.contains(event.target)) {
        tabPar.setSpShow("");
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const filteredData = [
    ...new Set(
      tabPar.isSamplePointsData.filter((el) => {
        // Преобразовываем el в строку, если он является числом
        const elString = typeof el === "number" ? el.toString() : el;
        return elString?.toLowerCase().includes(searchText?.toLowerCase());
      })
    ),
  ].sort((a, b) => {
    // Сортируем отфильтрованные данные по возрастанию
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  //! при нажатии на Input All
  const onAllChecked = () => {
    console.log("checkPar.isAllChecked", checkPar.isAllChecked);

    let checked = [...checkPar.isChecked];
    if (
      [...checkPar.isChecked].filter((el) => el.itemKey === props.itemKey)
        .length > 0
    ) {
      checked = checked.filter((el) => el.itemKey !== props.itemKey);
    } else {
      [...tabPar.isSamplePointsData].map((item) => {
        checked.push({ value: item, itemKey: props.itemKey });
      });
    }
    checkPar.setIsChecked(checked);
    sessionStorage.setItem("isCheckedWorkload", JSON.stringify([...checked]));

    // Фильтруем данные
    const fdfix = FilteredSample(
      basicTabData.workloadData,
      checked,
      props.itemKey
    );
    basicTabData.setWorkloadDataFix(fdfix);
    console.log("checkPar.isAllChecked", checkPar.isAllChecked);
  };

  //! при нажатии на Input
  const onChecked = (el) => {
    let checked = [...checkPar.isChecked]; // основной массив
    if (checked.some((item) => item.value === el)) {
      checked = checked.filter((item) => item.value !== el);
    } else {
      checked.push({ value: el, itemKey: props.itemKey });
    }
    checkPar.setIsChecked(checked);
    sessionStorage.setItem("isCheckedWorkload", JSON.stringify([...checked]));
    // Фильтруем данные
    const fdfix = FilteredSample(basicTabData.workloadData, checked);
    basicTabData.setWorkloadDataFix(fdfix);
    console.log("checkPar.isChecked", checkPar.isChecked);
  };

  useEffect(() => {
    console.log("вот я да");
  }, []);

  return (
    <main className={styles.SamplePoints} ref={spRef}>
      <div className={styles.container}>
        <div>
          <input
            className={styles.search}
            type="text"
            placeholder="Поиск"
            value={searchText}
            onChange={handleInputChange}
          />
          <div className={styles.points}>
            <div htmlFor="allCheckbox">
              <input
                id="allCheckbox"
                type="checkbox"
                onChange={onAllChecked}
                checked={
                  ![...checkPar.isChecked].filter(
                    (el) => el.itemKey === props.itemKey
                  ).length > 0
                }
              />
              <p>Все</p>
            </div>
            {filteredData.map((el, index) => {
              return (
                <div key={index} htmlFor={`checkbox-${index}`}>
                  <input
                    id={`checkbox-${index}`}
                    type="checkbox"
                    onChange={() => onChecked(el)}
                    checked={
                      !checkPar.isChecked.some((item) => item.value === el)
                    }
                  />
                  <p>{props.index === 0 ? index + 1 : el === "" ? "__" : el}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
