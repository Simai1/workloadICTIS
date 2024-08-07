import React, { useState } from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";

function TableTd(props) {
  const { tabPar } = React.useContext(DataContext);

  //определение каласса td
  const getClassNameTr = () => {
    let classtext = null;
    const changedData = tabPar.changedData[props.itemKey.key];
    if (!changedData) {
      classtext = null;
    } else {
      if (changedData.find((el) => el === props.item.id)) {
        classtext = `${classtext} ${styles.tdChanged}`;
      }
    }

    return classtext;
  };

  const [showFullText, setShowFullText] = useState(false); // при наведении на td показывает весь текст ячейки
  const lenSlice = props.itemKey.key === "groups" ? 50 : 70;
  //! фуункция котороя определяет какой формат текста выводить
  const gettdInnerText = () => {
    if (showFullText) {
      if (
        props.item[props.itemKey.key] === null ||
        props.item[props.itemKey.key] === undefined ||
        props.item[props.itemKey.key] === ""
      ) {
        return "___";
      }
      if (props.itemKey.key === "id") {
        return props.index + 1;
      } else {
        return props.item[props.itemKey.key];
      }
    } else {
      if (props.itemKey.key === "id") {
        return props.index + 1;
      } else if (
        props.item[props.itemKey.key] === null ||
        props.item[props.itemKey.key] === undefined ||
        props.item[props.itemKey.key] === ""
      ) {
        return "___";
      } else if (
        typeof props.item[props.itemKey.key] === "string" &&
        props.item[props.itemKey.key].length > lenSlice
      ) {
        return props.item[props.itemKey.key].slice(0, lenSlice) + "...";
      } else {
        return props.item[props.itemKey.key];
      }
    }
  };

  //! функция определения класса td для открытия длинного текста в попап со скролом
  const getClassNameTdInner = () => {
    let text = styles.tdInner;
    if (showFullText && props.item[props.itemKey.key]?.length > lenSlice) {
      text = `${text} ${styles.gettdInner}`;
    }
    return text;
  };

  return (
    <td
      onMouseEnter={() => setShowFullText(true)}
      onMouseLeave={() => setShowFullText(false)}
      name={props.itemKey.key}
      key={props.innerKey}
      className={getClassNameTr()}
      style={
        showFullText && props.item[props.itemKey.key]?.length > lenSlice
          ? props.itemKey.key === "discipline" ||
            props.itemKey.key === "workload"
            ? { position: "sticky" }
            : { position: "relative" }
          : null
      }
    >
      <div
        key={props.item.id + "div" + props.itemKey.key}
        className={getClassNameTdInner()}
        style={
          showFullText && props.item[props.itemKey.key]?.length > lenSlice
            ? {
                position: "absolute",
                backgroundColor: "inherit",
                width: "90%",
                top: "10px",
                padding: "4px",
                boxShadow: "0px 3px 18px rgba(0, 0, 0, 0.15)",
                zIndex: "200",
              }
            : null
        }
      >
        <div
          style={
            props.obj?.keys?.some((el) => el === props.itemKey.key)
              ? props.obj.action === "after"
                ? {
                    backgroundColor: "rgba(232, 20, 20, 0.25)",
                    borderRadius: "8px",
                  }
                : {
                    backgroundColor: "rgba(25, 194, 10, 0.25)",
                    borderRadius: "8px",
                  }
              : null
          }
        >
          {gettdInnerText()}
        </div>
      </div>
    </td>
  );
}

export default TableTd;
