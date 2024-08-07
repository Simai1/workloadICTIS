import React, { useEffect, useRef, useState } from "react";
import styles from "./SamplePoints.module.scss";
import DataContext from "../../../context";
import { FilteredSample } from "./Function";

export function SamplePoints(props) {
  const { tabPar, basicTabData } = React.useContext(DataContext);
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
        props.setSampleShow("");
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const filteredData = [
    ...new Set(
      props.isSamplePointsData.filter((el) => {
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
    let checked = [...props.checkPar.isChecked];
    if (
      [...props.checkPar.isChecked].filter((el) => el.itemKey === props.itemKey)
        .length > 0
    ) {
      checked = checked.filter((el) => el.itemKey !== props.itemKey);
    } else {
      [...props.isSamplePointsData].map((item) => {
        checked.push({ value: item, itemKey: props.itemKey });
      });
    }
    props.checkPar.setIsChecked(checked);
    sessionStorage.setItem("isCheckedTeachers", JSON.stringify([...checked]));

    // Фильтруем данные
    const fdfix = FilteredSample(props.updatedData, checked, props.itemKey);
    props.setFiltredData(fdfix);

    console.log("checkPar.isAllChecked", props.checkPar.isAllChecked);
  };

  //! при нажатии на Input
  const onChecked = (el) => {
    let checked = [...props.checkPar.isChecked];
    if (checked.some((item) => item.value === el)) {
      checked = checked.filter((item) => item.value !== el);
    } else {
      checked.push({ value: el, itemKey: props.itemKey });
    }
    props.checkPar.setIsChecked(checked);
    sessionStorage.setItem("isCheckedTeachers", JSON.stringify([...checked]));

    // Фильтруем данные
    const fdfix = FilteredSample(props.updatedData, checked); // функция фильтрации
    props.setFiltredData(fdfix); // это в тааблице выводится
    const allChecked = checked.length === 0;
    props.checkPar.setAllChecked(allChecked);
  };

  return (
    <main className={styles.SamplePoints} ref={spRef}>
      <div className={styles.container}>
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
                ![...props.checkPar.isChecked].filter(
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
                    !props.checkPar.isChecked.some((item) => item.value === el)
                  }
                />
                <p>{props.index === 0 ? index + 1 : el}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
