import React, { useEffect, useRef, useState } from "react";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";
import TextArea from "../../ui/TextArea/TextArea";
import { apiNotecAddMaterials } from "../../api/services/ApiRequest";
import { useDispatch, useSelector } from "react-redux";

import {
  addAllState,
  onTextareaShow,
  resetStatus,
  setTextAreaValue,
} from "../../store/popup/textareaData.slice";

function TableTd(props) {
  const { tabPar, basicTabData, appData } = React.useContext(DataContext);
  const [onTextArea, setOnTextArea] = useState(false);
  const textareaStor = useSelector((state) => state.textAreaSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (appData.popApCloseSttatus) {
      setOnTextArea(false);
      appData.setPopApCloseSttatus(false);
    }
  }, [appData.popApCloseSttatus]);

  const [textareaTd, setTextareaTd] = useState(
    props.item[props.itemKey.key] || ""
  );

  // useEffect(() => {
  //   if (props.itemKey.key === "notes" || props.itemKey.key === "groups") {
  //     const query = props.item[props.itemKey.key] || "";
  //     dispatch(setTextAreaValue({ value: query }));
  //   }
  // }, []);

  const tdTextAreaRef = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    const handler = (event) => {
      if (
        tdTextAreaRef.current &&
        !tdTextAreaRef.current.contains(event.target)
      ) {
        setOnTextArea(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  // определение каласса td
  const getClassNameTr = () => {
    const changedData = tabPar.changedData[props.itemKey.key];
    let cl = "";

    if (changedData && changedData.find((el) => el === props.item.id)) {
      cl = `${cl} ${styles.tdChanged}`;
    }
    if (props.tabDat.isActual && !props.item.isActual) {
      cl = `${cl} ${styles.tableShaduleTdOld}`;
    }

    return cl;
  };

  const getTextAreaOn = () => {
    if (
      //! проверяем роль
      (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 8) &&
        props.itemKey.key === "notes") ||
      props.itemKey.key === "groups" ||
      props.itemKey.key === "audiences"
    ) {
      return onTextArea;
    } else if (
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 8.1)
    ) {
      return onTextArea;
    }
  };

  const onChangeTextareaTd = (e) => {
    const query = e.target.value;
    if (
      props.itemKey.key === "notes" ||
      props.itemKey.key === "groups" ||
      props.itemKey.key === "audiences"
    ) {
      // setTextareaTd(query);
      dispatch(setTextAreaValue({ value: query }));
    } else {
      if (query === "") {
        setTextareaTd(query);
      } else if (query === "0") {
        setTextareaTd(query);
      } else if (Number(query)) {
        setTextareaTd(query);
      }
    }
  };

  //! при двойном клике на td открываем textarea
  const funDubleClick = () => {
    if (props.tabDat.ssHeader === "headerSchedule" && !onTextArea) {
      // dispatch(setTextAreaValue({ value: props.item[props.itemKey.key] }));
      // dispatch(setOriginalValue({ value: props.item[props.itemKey.key] }));
      // dispatch(onUpdateTable({ fun: props.tabDat.funUpdateTabDat }));
      dispatch(
        addAllState({
          taValue: props.item[props.itemKey.key],
          key: props.itemKey.key,
          itemId: props.item?.id,
        })
      );
    } else {
      // dispatch(setTextAreaValue({ value: "" }));
      // dispatch(setOriginalValue({ value: "" }));
      dispatch(
        addAllState({
          taValue: "",
          key: "",
          itemId: "",
        })
      );
    }
    setOnTextArea(!onTextArea);
  };

  //! при клтике отмена textarea
  const crossClick = (e) => {
    setTextareaTd(props.item[props.itemKey.key]);
    setOnTextArea(false);
  };

  const defineFunction = (action) => {
    if (action === "headerSchedule") {
      onClicNotic(action);
    } else {
      onClickButton();
    }
  };

  //! сохраниени примечаний
  const onClicNotic = (action) => {
    let data = {};
    if (props.itemKey.key === "notes") {
      data = {
        notes: textareaStor.taValue.trim() || "",
        ids: [props.item?.id],
      };
    } else if (props.itemKey.key === "groups") {
      data = {
        groups: textareaStor.taValue.trim() || "",
        ids: [props.item?.id],
      };
    } else if (props.itemKey.key === "audiences") {
      data = {
        audiences: textareaStor.taValue.trim() || "",
        ids: [props.item?.id],
      };
    }
    if (
      props.itemKey.key === "notes" ||
      props.itemKey.key === "groups" ||
      props.itemKey.key === "audiences"
    ) {
      apiNotecAddMaterials(data).then((req) => {
        if (req?.status === 200) {
          setOnTextArea(false);
          props.tabDat.funUpdateTabDat();
        }
      });
    }
  };

  //! при клике применить изменения textArea
  const onClickButton = () => {
    let parsedValue = parseFloat(textareaTd);
    let numberValue = isNaN(parsedValue) ? textareaTd : parsedValue;
    //! параметры запроса на изменение данных
    const data = {
      id: props.item.id,
      key: props.itemKey.key,
      value: numberValue,
    };
    if (numberValue || textareaTd === "0") {
      const updatedArray = props.tabDat.tableDataFix.map((item) => {
        if (item.id === props.item.id) {
          return { ...item, [props.itemKey.key]: numberValue };
        }
        return item;
      });
      props.tabDat.setTableDataFix(updatedArray);
      props.tabDat.setFiltredData(updatedArray);
      const workloadId = data.id;
      //! буфер
      appData.setBufferAction([
        {
          request: "workloadUpdata",
          data: data,
          prevState: props.item[props.itemKey.key],
          workloadId,
        },
        ...appData.bufferAction,
      ]);
      let cd = { ...tabPar.changedData };
      cd[props.itemKey.key] = [...cd[props.itemKey.key], props.item.id];
      tabPar.setChangedData(cd);
      setOnTextArea(false);
    }
    // setTextareaTd(props.item[props.itemKey.key]);
  };

  const [showFullText, setShowFullText] = useState(false); // при наведении на td показывает весь текст ячейки
  const lenSlice =
    props.itemKey.key === "groups" ||
    props.itemKey.key === "notes" ||
    props.itemKey.key === "audiences"
      ? 50
      : 70;
  //! фуункция котороя определяет какой формат текста выводить
  const gettdInnerText = () => {
    if (props.itemKey.key === "createdAt") {
      const originalDate = new Date(props.item[props.itemKey.key]);
      return originalDate.toLocaleString("ru-RU", { timeZone: "UTC" });
    } else if (showFullText) {
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
  // const ClickName = () => {
  //   tabPar.setContextMenuShow(true);
  // };
  //! функция определения класса td для открытия длинного текста в попап со скролом
  const getClassNameTdInner = () => {
    let text = styles.tdInner;
    if (showFullText && props.item[props.itemKey.key]?.length > lenSlice) {
      text = `${text} ${styles.gettdInner}`;
    }
    if (props.item.isSplitArrow === true) {
      text = `${text} ${styles.tdInnerIsSplitArrow}`;
    }
    return text;
  };

  //! функция раскрытие попап
  const onPopupTextArea = () => {
    dispatch(onTextareaShow());
  };

  //! функция которая возвращает значение текстареа
  const getValue = () => {
    if (
      props.tabDat.ssHeader === "headerSchedule" &&
      (props.itemKey.key === "notes" ||
        props.itemKey.key === "groups" ||
        props.itemKey.key === "audiences")
    ) {
      return textareaStor.taValue;
    } else {
      return textareaTd;
    }
  };

  return (
    <td
      onMouseEnter={() => setShowFullText(true)}
      onMouseLeave={!onTextArea ? () => setShowFullText(false) : null}
      name={props.itemKey.key}
      key={props.item.id + "_" + props.itemKey.key + "_" + props.ind}
      className={getClassNameTr()}
      id={
        appData.selectedComponent === "ScheduleMaterials" &&
        (props.itemKey.key === "notes" ||
          props.itemKey.key === "groups" ||
          props.itemKey.key === "audiences")
          ? styles.fihedTd
          : null
      }
      style={
        showFullText && props.item[props.itemKey.key]?.length > lenSlice
          ? props.itemKey.key === "discipline" ||
            props.itemKey.key === "workload" ||
            props.itemKey.key === "notes" ||
            props.itemKey.key === "groups" ||
            props.itemKey.key === "audiences"
            ? { position: "sticky", zIndex: "1" }
            : { position: "relative" }
          : null
      }
    >
      <div
        name={props.itemKey.key}
        key={props.item.id + "div" + props.itemKey.key + "_" + props.ind}
        className={getClassNameTdInner()}
        onDoubleClick={funDubleClick}
        style={
          showFullText && props.item[props.itemKey.key]?.length > lenSlice
            ? {
                position: "absolute",
                backgroundColor: "inherit",
                width: "90%",
                top: "10px",
                padding: "4px",
                boxShadow: "0px 3px 18px rgba(0, 0, 0, 0.15)",
                zIndex: "10",
              }
            : null
        }
      >
        {getTextAreaOn() ? (
          <div ref={tdTextAreaRef} className={styles.textareaContainer}>
            <div className={styles.textareaStyle}>
              <TextArea value={getValue()} onChange={onChangeTextareaTd} />
            </div>
            <div className={styles.svg_textarea}>
              <span onClick={onPopupTextArea}>Раскрыть</span>

              {((textareaTd !== "" && Number(textareaTd) <= 2000) ||
                props.tabDat.ssHeader === "headerSchedule") && (
                <SvgChackmark
                  onClick={() => defineFunction(props.tabDat.ssHeader)}
                  className={styles.SvgChackmark_green}
                />
              )}
              <SvgCross onClick={crossClick} />
            </div>
          </div>
        ) : (
          gettdInnerText()
        )}
      </div>
    </td>
  );
}

export default TableTd;
