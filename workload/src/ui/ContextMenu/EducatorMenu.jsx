import React, { useEffect, useState } from "react";
import styles from "./ContextMenu.module.scss";
import { Educator } from "../../api/services/ApiRequest";

export function EducatorMenu(props) {
  const [educator, setEductor] = useState([]); //преподы с бд
  const [filtredData, setFiltredData] = useState(educator);

  useEffect(() => {
    Educator().then((data) => {
      setEductor(data);
      setFiltredData(data);
    });
  }, []);

  //! поиск
  const handleSearch = (el) => {
    const fd = educator.filter((item) =>
      item.name.toLowerCase().includes(el.target.value.toLowerCase())
    );
    setFiltredData(fd);
  };

  return (
    <div
      className={styles.EducatorMenu}
      style={
        props.menuPosition.x + 280 + 180 > window.innerWidth
          ? {
              position: "fixed",
              top: props.menuPosition.y,
              left: props.menuPosition.x - 200,
            }
          : {
              position: "fixed",
              top: props.menuPosition.y,
              left: props.menuPosition.x + 280,
            }
      }
    >
      <input
        type="text"
        placeholder="Поиск"
        className={styles.educator_search}
        onChange={handleSearch}
      />
      <ul className={styles.educator_ul}>
        {filtredData.map((el, index) => (
          <li key={index} className={styles.educator_li}>
            <p
              className={styles.educator}
              onClick={() => props.selectedEducator(el.id)}
            >
              {el.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
