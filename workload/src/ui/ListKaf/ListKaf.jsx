import React, { useEffect, useRef, useState } from "react";
import styles from "./ListKaf.module.scss";
import DataContext from "../../context";
import arrowWhite from "./../../img/arrow-White.svg";
import arrowBlack from "./../../img/arrow_down.svg";
import { apiGetHistory } from "../../api/services/ApiRequest";

function ListKaf({
  dataList,
  Textlabel,
  defaultValue,
  name,
  setTableMode,
  setisBlocked,
}) {
  const { tabPar, appData, basicTabData } = React.useContext(DataContext);
  const [activeList, setactiveList] = useState(false);
  const [openLists, setopenLists] = useState("");
  const setopenList = (index) => {
    if (index === openLists) {
      setopenLists("");
    } else {
      setopenLists(index);
    }
  };
  const addKafedra = (el) => {
    if (el.name === "ОИД") {
      basicTabData.setselectISOid(true);
    } else {
      basicTabData.setselectISOid(false);
    }
    basicTabData.funUpdateTable(el.id);
    basicTabData.setnameKaf(el.name);
    setactiveList(!activeList);
    setopenLists("");
    setTableMode("cathedrals");
    tabPar.setSelectedFilter("Все Дисциплины");
    if (appData.selectedComponent !== "ScheduleMaterials") {
      appData.setSelectedComponent("Disciplines");
    }
  };

  const refDiv = useRef(null);
  //! закрытие модального окна при нажати вне него
  useEffect(() => {
    setopenLists("");
    const handler = (event) => {
      if (refDiv.current && !refDiv.current.contains(event.target)) {
        setactiveList(false);
        setopenLists("");
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  //! функция при клике на история
  const clickHistory = (item) => {
    setactiveList(false);
    setopenLists("");
    tabPar.setSelectedFilter("Все Дисциплины");
    basicTabData.setnameKaf(item.name);
    appData.setSelectedComponent("History");
  };

  //! функция определения показывать ли общеинститутские и кафедральные слово
  const funGetAction = () => {
    if (
      appData.myProfile.institutionalAffiliation === "ИКТИБ" ||
      appData.myProfile?.role === "METHODIST" ||
      appData.myProfile?.role === "GIGA_ADMIN"
    ) {
      return true;
    } else return false;
  };

  return (
    <div ref={refDiv} className={styles.List}>
      <div>
        {Textlabel && (
          <div>
            <label>{Textlabel}</label>
          </div>
        )}

        <div className={styles.ListCont}>
          <input
            readOnly
            style={{
              backgroundColor: !activeList ? "#0040E5" : "#fff",
              color: !activeList ? "#fff" : "#000",
            }}
            onClick={() => setactiveList(!activeList)}
            value={basicTabData.nameKaf ? basicTabData.nameKaf : ""}
            placeholder={defaultValue}
            className={styles.inputList}
          />
          <span
            onClick={() => setactiveList(!activeList)}
            className={styles.arrowBot}
          >
            {!activeList && (
              <img
                src={arrowWhite}
                style={{
                  transform: "rotate(0deg)",
                }}
              />
            )}
            {activeList && (
              <img
                src={arrowBlack}
                style={{
                  transform: "rotate(-180deg)",
                  paddingBottom: "4px",
                }}
              />
            )}
          </span>
        </div>
        {activeList && basicTabData.tableDepartment.length !== 1 && (
          <div className={styles.ListData}>
            {dataList.length > 1 ? (
              <>
                {!appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 42
                ) &&
                  funGetAction() &&
                  dataList[1]?.name === "ОИД" && (
                    <p className={styles.NameForList}>Общеинститутские</p>
                  )}
                <div key={"ОИД"} className={styles.ListDatas}>
                  {dataList[1]?.name === "ОИД" && (
                    <p
                      className={styles.NameForListSecond}
                      onClick={() => {
                        if (dataList[1]?.blocked) {
                          if (
                            appData.metodRole[appData.myProfile?.role]?.some(
                              (el) => el === 28
                            )
                          ) {
                            setopenList(0);
                          }
                        } else {
                          addKafedra(dataList[1]);
                        }
                      }}
                      style={dataList[1]?.blocked ? { color: "#E81414" } : null}
                    >
                      {dataList[1]?.name}
                    </p>
                  )}
                  {dataList[1]?.blocked && openLists === 0 && (
                    <div className={styles.ListVRot}>
                      <p
                        className={styles.NameForList}
                        onClick={() => addKafedra(dataList[1])}
                      >
                        Нагрузка
                      </p>
                      {appData.metodRole[appData.myProfile?.role]?.some(
                        (el) => el === 29
                      ) && (
                        <p
                          className={styles.NameForList}
                          onClick={() => clickHistory(dataList[1])}
                        >
                          История
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {funGetAction() && (
                  <p className={styles.NameForList}>Кафедральные</p>
                )}
                <div className={styles.inner_scroll}>
                  {dataList.map((item, index) => (
                    <div key={index} className={styles.ListDatas}>
                      {item.name !== "ОИД" && (
                        <p
                          className={styles.NameForListSecond}
                          onClick={() => {
                            if (item.blocked) {
                              if (
                                appData.metodRole[
                                  appData.myProfile?.role
                                ]?.some((el) => el === 28)
                              ) {
                                setopenList(index);
                              }
                            } else {
                              addKafedra(item);
                            }
                          }}
                          style={item.blocked ? { color: "#E81414" } : null}
                        >
                          {item.name}
                        </p>
                      )}
                      {item.blocked && openLists === index && (
                        <div className={styles.ListVRot}>
                          <p
                            className={styles.NameForList}
                            onClick={() => addKafedra(item)}
                          >
                            Нагрузка
                          </p>
                          {appData.metodRole[appData.myProfile?.role]?.some(
                            (el) => el === 29
                          ) && (
                            <p
                              className={styles.NameForList}
                              onClick={() => clickHistory(item)}
                            >
                              История
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>Нет данных</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListKaf;
