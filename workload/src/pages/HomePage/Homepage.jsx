import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import TableTeachers from "../../components/TableTeachers/TableTeachers";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import Warnings from "../../components/Warnings/Warnings";
import TableLks from "../../components/TableLks/TableLks";
import Profile from "../../components/Profile/Profile";
import EditInput from "../../components/EditInput/EditInput";
import DataContext from "../../context";
// import { bufferRequestToApi } from "../../bufferFunction";
import FiltredRows from "../../ui/FiltredRows/FiltredRows";
import TableWorkload from "../../components/TableWorkload/TableWorkload";
import {
  headers,
  headersEducator,
  scheduleHead,
  tableHeadersLks,
} from "../../components/TableWorkload/Data";
import { PopUpFile } from "../../ui/PopUpFile/PopUpFile";
import { PopUpError } from "../../ui/PopUpError/PopUpError";
// import List from "../../ui/List/List";
import ListKaf from "../../ui/ListKaf/ListKaf";
import { PopUpCreateEmploy } from "../../ui/PopUpCreateEmploy/PopUpCreateEmploy";
import {
  GetDepartment,
  GetDepartmentsMaterials,
  SyncTable,
  Workload,
  WorkloadBlocked,
  apiBlockMaterials,
  apiGetUser,
  apiUnblockMaterials,
  getAllWarningMessage,
  getSchedule,
} from "../../api/services/ApiRequest";
import ConfirmSaving from "../../ui/ConfirmSaving/ConfirmSaving";
import socketConnect from "../../api/services/socket";
import PopUpGoodMessage from "../../ui/PopUpGoodMessage/PopUpGoodMessage";
import TableHistory from "../../components/TableHistory/TableHistory";
import ErrorHelper from "../../components/ErrorHelper/ErrorHelper";
import { Link } from "react-router-dom";
import UnlockDepartment from "../../ui/UnlockDepartment/UnlockDepartment";

import SplitByHoursPopup from "../../components/SplitByHoursPopup/SplitByHoursPopup";
// import { UniversalPopup } from "../../ui/UniversalPopup/UniversalPopup";
import TableSchedule from "../../components/TableSchedule/TableSchedule";
import MyWorkload from "../../components/MyWorkload/MyWorkload";
import ListSchedule from "../../ui/ListSchedule/ListSchedule";
import PopupTextArea from "../../components/PopupTextArea/PopupTextArea";
import { useDispatch, useSelector } from "react-redux";
import PopUpTextAreaMore from "../../components/PopUpTextAreaMore/PopUpTextAreaMore";
import { generateAndDownloadExcel } from "./functionHomePage";
import BlockingTables from "../../components/BlockingTables/BlockingTables";
import { resetStatus } from "../../store/popup/textareaData.slice";
import ScheduleListFilter from "../../components/ScheduleListFilter/ScheduleListFilter";
function HomePage() {
  const { appData, tabPar, visibleDataPar, basicTabData } =
    React.useContext(DataContext);

  const textareaStor = useSelector((state) => state.textAreaSlice);
  //! заголовки таблиц
  const workloadTableHeaders = headers; // заголовок таблицы на главной странице
  const educatorTableHeaders = headersEducator; // заголовок таблтиц преподавателей
  const educatorLkHeaders = tableHeadersLks; // заголовок страницы личного кабинета
  const scheduleHeaders = scheduleHead;
  // const [tableHeaders, setTableHeaders] = useState(workloadTableHeaders);
  const [filePopUp, setfilePopUp] = useState(false);
  // const [appData.selectedComponent, appData.setSelectedComponent] = useState("Disciplines");
  const [tableMode, setTableMode] = useState("cathedrals"); //выбранный компонент
  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const [onenModalWind, setOpenModalWind] = useState(false); // переменная закрытия модального окна профиля
  const refProfile = React.useRef(null); // ссылка на модальное окно профиля
  const [educatorIdforLk, setEducatorIdforLk] = useState(""); // id для вывода LK, если пустое то LK не отображается
  const [popupSaveAll, setPopupSaveAll] = useState(false); // открыть/закрыть попап подтверждения сохранения
  const [popupUnblockTable, setPopupUnblockTable] = useState(false);
  const [popupExport, setPopupExport] = useState(false); // открыть/закрыть попап подтверждения блокировки таблицы
  const [departments, setdepartments] = useState([]);
  const [departmentsMaterials, setDepartmentsMaterials] = useState([]);
  const dispatch = useDispatch();
  // const [kafedralIsOpen, setKafedralIsOpen] = useState(false);
  // const [cafedral, setCafedral] = useState(false);
  const [blockTable, setBlockTable] = useState(false);
  const handleButtonClick = () => {
    setEducatorIdforLk("");
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 28)) {
      basicTabData.funUpdateTable(
        basicTabData.tableDepartment.find(
          (el) => el.name === basicTabData?.nameKaf
        )?.id
      );
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 42)) {
      basicTabData.funUpdateTable(
        basicTabData.tableDepartment.find(
          (el) => el.name === basicTabData?.nameKaf
        )?.id
      );
    }
    tabPar.setSelectedFilter("Все дисциплины");
  };

  //! связь с сокетом
  useEffect(() => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 23)) {
      socketConnect();
      getAllWarningMessage().then((res) => {
        appData.setAllWarningMessage(res);
      });
    }
  }, [basicTabData.tableDepartment]);

  useEffect(() => {
    GetDepartment().then((response) => {
      setdepartments([{ id: 99, name: "Все" }, ...response.data]);
    });
  }, [basicTabData.tableDepartment]);

  //! получаем и записываем данные usera
  useEffect(() => {
    apiGetUser().then((data) => {
      appData.setMyProfile(data);
    });
    GetDepartmentsMaterials().then((resp) => {
      setDepartmentsMaterials([{ id: 99, name: "Все" }, ...resp.data]);
    });
  }, []);

  const handleComponentChange = (component) => {
    appData.setSelectedComponent(component);
    tabPar.setSelectedTable(component);
    if (component === "Disciplines" || component === "MyWorkload") {
      basicTabData.setTableHeaders(workloadTableHeaders);
    } else if (component === "History") {
      basicTabData.setTableHeaders(workloadTableHeaders);
    } else if (component === "Teachers") {
      basicTabData.setTableHeaders(educatorTableHeaders);
    } else if (component === "ScheduleMaterials") {
      basicTabData.setTableHeaders(scheduleHeaders);
    } else {
      basicTabData.setTableHeaders(educatorLkHeaders);
    }
  };

  const changeInput = () => {
    basicTabData.setTableHeaders(educatorTableHeaders);
  };

  const handleSearch = (event) => {
    basicTabData.setSearchTerm(event.target.value);
  };

  useEffect(() => {
    basicTabData.funGetDepartment();
  }, []);

  //! открыть попап
  const onSaveClick = () => {
    setPopupSaveAll(!popupSaveAll);
    popupExport === true && setPopupExport(false);
  };
  //! открыть попап
  const onUnblockClick = () => {
    setPopupUnblockTable(!popupUnblockTable);
    appData.setPopupGoodText("Запрос успешно отправлен!");
  };
  //! открыть попап
  const onExportClick = () => {
    setPopupExport(!popupExport);
    popupSaveAll === true && setPopupSaveAll(false);
  };

  //! при нажатии на подтвердить сохранение изменений
  const confirmClick = (action) => {
    if (action) {
      appData.funSaveAllData();
    } else {
      setPopupSaveAll(false);
    }
  };
  const [confirmationSave, setConfirmationSave] = useState(false); // флаг открывается если не сохранили данные и блокируем

  //! при клике на подтверждение блокировки таблицы
  const exportClick = (action) => {
    if (appData.bufferAction.length === 0) {
      if (action) {
        if (
          appData.metodRole[appData.myProfile?.role]?.some((el) => el === 33)
        ) {
          const id = appData.myProfile.educator.departmentId;
          WorkloadBlocked(id).then((resp) => {
            if (resp?.status === 200) {
              basicTabData.funUpdateTable(99);
              appData.setgodPopUp(true);
            }
          });
        } else {
          const idTable = basicTabData?.tableDepartment.find(
            (el) => el.name === basicTabData?.nameKaf
          ).id;
          WorkloadBlocked(idTable).then((resp) => {
            if (resp?.status === 200) {
              basicTabData.funUpdateTable(idTable);
              appData.setgodPopUp(true);
              basicTabData.funGetDepartment();
            }
          });
        }
      } else {
        setPopupExport(false);
      }
    } else {
      setPopupExport(false);
      setConfirmationSave(true);
    }
  };

  //! функция при клике блокировки в расписании
  const confirmClickSchedule = () => {
    const idTable = departmentsMaterials.find(
      (el) => el.name === basicTabData?.selectTableSchedle
    ).id;
    apiBlockMaterials(idTable).then((res) => {
      if (res?.status === 200) {
        setPopupExport(false);
        dispatch(resetStatus({ value: 200 }));
        GetDepartmentsMaterials().then((resp) => {
          setDepartmentsMaterials([{ id: 99, name: "Все" }, ...resp.data]);
        });
      }
    });
  };

  //! функция при клике разблокировки в расписании
  const confirmClickScheduleUnBlocked = () => {
    const idTable = departmentsMaterials.find(
      (el) => el.name === basicTabData?.selectTableSchedle
    ).id;
    apiUnblockMaterials(idTable).then((res) => {
      if (res?.status === 200) {
        setPopupExport(false);
        dispatch(resetStatus({ value: 200 }));

        GetDepartmentsMaterials().then((resp) => {
          setDepartmentsMaterials([{ id: 99, name: "Все" }, ...resp.data]);
        });
      }
    });
  };

  //! функции для импорта файла
  const OpenPoPUpFile = () => {
    setfilePopUp(!filePopUp);
  };

  //! при нажатии на ракету
  const raketClick = () => {
    visibleDataPar.setStartData(0);
    const table = document.querySelector("table");
    table.scrollIntoView(true);
    visibleDataPar.setStartData(0);
    if (tabPar.tableRefWorkload.current) {
      tabPar.tableRefWorkload.current.scrollTo(0, 0);
    }
  };

  //! ФУНКЦИЯ ПРОВЕРКИ НА БЛОКИРОВАННЫЕ
  const checkBlocked = () => {
    let blocked = false;
    if (
      appData.selectedComponent === "History" ||
      appData.selectedComponent === "Teachers" ||
      appData.selectedComponent === "ScheduleMaterials" ||
      appData.selectedComponent === "MyWorkload"
    ) {
      return false;
    }
    if (
      appData.selectedComponent !== "History" ||
      appData.selectedComponent !== "Teachers" ||
      appData.selectedComponent === "ScheduleMaterials" ||
      appData.selectedComponent !== "MyWorkload"
    ) {
      basicTabData.filtredData.every((el) =>
        el.isBlocked === true ? (blocked = true) : (blocked = false)
      );
      return blocked;
    }
  };
  //!Функция экспорта файла
  const exportFile = () => {
    let idTableUnlock = 0;
    let url = ``;
    let nameDepartment = "";
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 51)) {
      idTableUnlock = appData.myProfile.educator.departmentId;
      nameDepartment = appData.myProfile.educator.department;
    } else {
      idTableUnlock = basicTabData?.tableDepartment.find(
        (el) => el.name === basicTabData?.nameKaf
      ).id;
      nameDepartment = basicTabData?.nameKaf;
    }

    if (basicTabData.nameKaf === "Все") {
      url = ``;
    } else if (basicTabData.nameKaf === "ОИД") {
      url = "?isOid=true";
    } else {
      url = `?department=${idTableUnlock}`;
    }
    Workload(url).then((resp) => {
      generateAndDownloadExcel(resp, nameDepartment, "workload");
    });
  };

  //!Функция экспорта расписания
  const exportSchedulefunc = () => {
    let url = "";
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 55)) {
      if (basicTabData.selectTableSchedle != "Все") {
        const depart = basicTabData.tableDepartment.find(
          (el) => el.name === basicTabData.selectTableSchedle
        )?.id;
        url = `?departments=${depart}`;
      } else if (basicTabData.selectTableSchedle === "Все") {
        url = "";
      }
    } else {
      url = "";
    }
    const nameDepartment = basicTabData.selectTableSchedle;
    getSchedule(url).then((resp) => {
      generateAndDownloadExcel(resp.data, nameDepartment, "schedule");
    });
  };

  useEffect(() => {
    setBlockTable(checkBlocked());
  }, [
    basicTabData.tableDepartment,
    basicTabData.filtredData,
    appData.selectedComponent,
    tabPar.setSelectedFilter,
  ]);

  //! при переходе на другую таблицу то сбрасываем поиск
  useEffect(() => {
    basicTabData.setSearchTerm("");
  }, [appData.selectedComponent]);

  const sync = () => {
    appData.setLoaderAction(1);
    SyncTable().then((resp) => {
      if (resp.status === 200) {
        appData.setLoaderAction(0);
        appData.setDataUpdated(true);
        appData.setgodPopUp(true);
      }
    });
  };
  //! функция определения выводить ли посик
  const funGetSherch = () => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 41)) {
      if (appData.selectedComponent === "Teachers" && educatorIdforLk !== "") {
        return false;
      } else return true;
    } else {
      return true;
    }
  };

  //! параметр для фильтрации меняем
  const setParam = () => {
    if (tabPar.parametrFilter === "?") {
      tabPar.setParametrFilter("?type=final&");
    } else {
      tabPar.setParametrFilter("?");
    }
  };

  //! функция которая отпределяет что выбранная кафедра в рассписании заблокированна
  const getBlockedSchadule = () => {
    return departmentsMaterials.find(
      (el) => el.name === basicTabData?.selectTableSchedle
    )?.isBlocked;
  };

  //!Функция экспорта преподователей
  const funExportTeacher = () => {
    generateAndDownloadExcel(appData.educator, "Преподаватели", "Teacher");
  };

  return (
    <Layout>
      <div className={styles.HomePage}>
        {confirmationSave && (
          <div className={styles.nosavedData}>
            <div className={styles.nosavedDataInner}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                У вас есть несохраненные данные
              </div>
              <button
                style={{ marginTop: "25px", width: "150px" }}
                onClick={() => setConfirmationSave(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
        {appData.loaderAction === 1 && (
          <div className={styles.nosavedData}>
            <div className={styles.nosavedDataInner}>
              <div className={styles.loader}>
                <span className={styles.loaderInner}></span>
              </div>
              <span>Загружаем данные...</span>
            </div>
          </div>
        )}
        <div className={styles.header}>
          <div className={styles.header_top}>
            <div className={styles.header_top_save_search}>
              <div className={styles.saveBuffre}>
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) =>
                    el === 25 &&
                    appData.selectedComponent !== "Teachers" &&
                    appData.selectedComponent !== "ScheduleMaterials"
                ) && (
                  <div
                    title="Отмена действия"
                    className={styles.btnMenuBox}
                    onClick={appData.backBuffer}
                  >
                    <div className={styles.text}>Отменить</div>

                    <img src="./img/backBuffer.svg" alt="i" />
                  </div>
                )}
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 26
                ) &&
                  appData.selectedComponent === "Disciplines" &&
                  !blockTable && (
                    <div
                      className={styles.btnMenuBox}
                      onClick={onSaveClick}
                      title="Сохранение изменений"
                    >
                      <img
                        className={styles.btnLeft}
                        src="./img/saveButton.svg"
                        alt="i"
                      />
                      {popupSaveAll && (
                        <ConfirmSaving
                          title={"Вы уверены, что хотите сохранить изменения?"}
                          confirmClick={confirmClick}
                          setShow={setPopupSaveAll}
                        />
                      )}
                    </div>
                  )}
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 48
                ) &&
                  appData.selectedComponent === "Disciplines" &&
                  basicTabData.nameKaf !== "Все" &&
                  blockTable && (
                    <div
                      className={styles.btnMenuBox}
                      onClick={onUnblockClick}
                      title="Разблокировать таблицу"
                    >
                      <img
                        className={styles.btnLeft}
                        src="./img/unblock.svg"
                        alt="i"
                      />
                      {popupUnblockTable && (
                        <UnlockDepartment
                          title={`Вы уверены, что хотите разблокировать таблицу ${basicTabData.nameKaf} ?`}
                          denyClick={onUnblockClick}
                        />
                      )}
                    </div>
                  )}
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 49
                ) &&
                  appData.selectedComponent === "Disciplines" &&
                  blockTable && (
                    <div
                      className={styles.btnMenuBox}
                      onClick={onUnblockClick}
                      title="Попросить разблокировать таблицу"
                    >
                      <img
                        className={styles.btnLeft}
                        src="./img/unblock.svg"
                        alt="i"
                      />
                      {popupUnblockTable && (
                        <UnlockDepartment
                          title={"Попросить разблокировать таблицу?"}
                          denyClick={onUnblockClick}
                        />
                      )}
                    </div>
                  )}

                {((appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 27
                ) &&
                  basicTabData.nameKaf !== "Все" &&
                  !blockTable &&
                  appData.selectedComponent === "Disciplines") ||
                  (appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 33
                  ) &&
                    appData.selectedComponent === "Disciplines" &&
                    !blockTable)) && (
                  <div
                    style={{ marginRight: "15px" }}
                    className={styles.btnMenuBox}
                    onClick={onExportClick}
                    title="Выгрузка таблицы для методистов"
                  >
                    <img
                      className={styles.btnLeft}
                      src="./img/export.svg"
                      alt="i"
                    />
                    {popupExport && (
                      <ConfirmSaving
                        title={`Вы уверены, что хотите отправить таблицу ${basicTabData.nameKaf}?`}
                        confirmClick={exportClick}
                        setShow={setPopupExport}
                      />
                    )}
                  </div>
                )}
                {appData.selectedComponent === "ScheduleMaterials" &&
                  appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 27
                  ) &&
                  getBlockedSchadule() && (
                    <BlockingTables
                      imgUrl={"./img/unblock.svg"}
                      title={"Разблокировать материалы к расписанию"}
                      confirmSavingTitle={`Разблокировать материалы к расписанию ${basicTabData.selectTableSchedle}?`}
                      popupExport={popupExport}
                      clickFun={onExportClick}
                      nameKaf={basicTabData.selectTableSchedle}
                      confirmClick={confirmClickScheduleUnBlocked}
                      setShow={setPopupExport}
                    />
                  )}
                {appData.selectedComponent === "ScheduleMaterials" &&
                  appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 27
                  ) &&
                  !getBlockedSchadule() && (
                    <BlockingTables
                      imgUrl={"./img/export.svg"}
                      title={
                        "Завершение редактирования материалов к расписанию"
                      }
                      confirmSavingTitle={`Завершить редактирование материалов к расписанию ${basicTabData.selectTableSchedle}?`}
                      popupExport={popupExport}
                      clickFun={onExportClick}
                      nameKaf={basicTabData.selectTableSchedle}
                      confirmClick={confirmClickSchedule}
                      setShow={setPopupExport}
                    />
                  )}
              </div>
              {funGetSherch() && (
                <div
                  className={styles.header_search}
                  style={
                    basicTabData?.searchTerm
                      ? { backgroundColor: "#fff", border: "none" }
                      : null
                  }
                >
                  <input
                    type="text"
                    placeholder="Поиск..."
                    id="search"
                    name="search"
                    onChange={handleSearch}
                    value={basicTabData?.searchTerm}
                    className={styles.hedaer_search_inner}
                    style={
                      basicTabData?.searchTerm
                        ? { backgroundColor: "#fff" }
                        : null
                    }
                  />
                  <img src="./img/search.svg" alt="i" />
                </div>
              )}
            </div>

            <div className={styles.header_button}>
              <Button
                Bg={
                  appData.selectedComponent === "Disciplines" ||
                  appData.selectedComponent === "History"
                    ? "#0040E5"
                    : "#efedf3"
                }
                textColot={
                  appData.selectedComponent === "Disciplines" ||
                  appData.selectedComponent === "History"
                    ? "#efedf3"
                    : "#000000"
                }
                onClick={() => {
                  handleComponentChange("Disciplines");
                  handleButtonClick();
                  basicTabData.setselectISOid(true);
                }}
                text="Дисциплины"
              />
              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 56
              ) && (
                <Button
                  Bg={
                    appData.selectedComponent === "MyWorkload"
                      ? "#0040E5"
                      : "#efedf3"
                  }
                  textColot={
                    appData.selectedComponent !== "MyWorkload"
                      ? "#000000"
                      : "#efedf3"
                  }
                  onClick={() => {
                    handleComponentChange("MyWorkload");
                    // handleButtonClick();
                    // basicTabData.setselectISOid(false);
                  }}
                  text="Моя нагрузка"
                />
              )}

              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 3
              ) && (
                <Button
                  Bg={
                    appData.selectedComponent === "Teachers"
                      ? "#0040E5"
                      : "#efedf3"
                  }
                  textColot={
                    appData.selectedComponent !== "Teachers"
                      ? "#000000"
                      : "#efedf3"
                  }
                  onClick={() => {
                    handleComponentChange("Teachers");
                    basicTabData.setselectISOid(false);
                  }}
                  text="Преподаватели"
                />
              )}

              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 24
              ) && (
                <Button
                  text="Моя нагрузка"
                  onClick={() => {
                    setEducatorIdforLk(appData.myProfile.educator.id);
                    appData.setSelectedComponent("Teachers");
                  }}
                  Bg={educatorIdforLk.length !== 0 ? "#0040E5" : "#efedf3"}
                  textColot={
                    educatorIdforLk.length === 0 ? "#000000" : "#efedf3"
                  }
                />
              )}

              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 54
              ) && (
                <Button
                  Bg={
                    appData.selectedComponent === "ScheduleMaterials"
                      ? "#0040E5"
                      : "#efedf3"
                  }
                  textColot={
                    appData.selectedComponent !== "ScheduleMaterials"
                      ? "#000000"
                      : "#efedf3"
                  }
                  onClick={() => {
                    handleComponentChange("ScheduleMaterials");
                    setEducatorIdforLk("");
                    // handleButtonClick();
                    // basicTabData.setselectISOid(true);
                  }}
                  text="Расписание"
                />
              )}
              {appData.myProfile?.role === "GOD" && (
                <Link to="../Admin">
                  <Button text="Админ панель" />
                </Link>
              )}
            </div>
            <div className={styles.header_left_component}>
              <ErrorHelper />
              {appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 30
              ) && (
                <div title="Уведомления">
                  <Warnings
                    setEducatorIdforLk={setEducatorIdforLk}
                    educatorIdforLk={educatorIdforLk}
                    className={styles.Warnings}
                    setSelectedComponent={appData.setSelectedComponent}
                    setEducatorData={setEducatorData}
                  />
                </div>
              )}
              <Profile
                className={styles.Profile}
                setOpenModalWind={setOpenModalWind}
                onenModalWind={onenModalWind}
                refProfile={refProfile}
              />
            </div>
          </div>
          {(blockTable ||
            (appData.selectedComponent === "ScheduleMaterials" &&
              departmentsMaterials.find(
                (el) => el.name === basicTabData?.selectTableSchedle
              )?.isBlocked)) && (
            <div className={styles.blockedTextTable}>
              <div>
                <img src="./img/errorTreangle.svg" alt="i" />
              </div>
              <div>
                <p>
                  Таблица находится в состоянии "Блокировки", редактирование
                  временно отключено!
                </p>
              </div>
            </div>
          )}

          {educatorIdforLk === "" && (
            <div className={styles.header_bottom}>
              <div className={styles.header_bottom_button}>
                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 28 || el === 57 || el === 58
                ) &&
                  (appData.selectedComponent === "Disciplines" ||
                    appData.selectedComponent === "History" ||
                    appData.selectedComponent === "ScheduleMaterials") && (
                    <>
                      {appData.selectedComponent !== "ScheduleMaterials" ? (
                        <ListKaf
                          dataList={departments}
                          setTableMode={setTableMode}
                        />
                      ) : (
                        <>
                          {appData.metodRole[appData.myProfile?.role]?.some(
                            (el) => el === 55
                          ) && <ListSchedule dataList={departmentsMaterials} />}
                          <div className={styles.exportSchedule}>
                            <div className={styles.exportScheduleButton}>
                              <button
                                onClick={sync}
                                className={styles.buttonSync}
                              >
                                Синхронизация
                              </button>
                              <ScheduleListFilter />
                            </div>
                            {/* <div className={styles.import}>
                              <button onClick={exportSchedulefunc}>
                                <img
                                  src="./img/import.svg"
                                  alt=">"
                                  className={styles.export__img}
                                ></img>
                                <p>Экспорт таблицы</p>
                              </button>
                            </div> */}
                          </div>
                        </>
                      )}

                      {appData.selectedComponent === "History" && (
                        <div className={styles.perenesen}>
                          <button
                            onClick={() => {
                              tabPar.setPerenesenAction(
                                !tabPar.perenesenAction
                              );
                            }}
                          >
                            {!tabPar.perenesenAction
                              ? "Не перенесенные"
                              : "Перенесенные"}
                          </button>

                          <button
                            className={styles.histParRig}
                            onClick={setParam}
                          >
                            {tabPar.parametrFilter === "?"
                              ? "Показать последние изменения"
                              : "Показать все"}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                {appData.selectedComponent === "Disciplines" &&
                  appData.selectedComponent !== "History" && <FiltredRows />}
              </div>

              <div className={styles.right_button}>
                <div className={styles.EditInput}>
                  {educatorIdforLk === "" && (
                    <EditInput
                      selectedComponent={appData.selectedComponent}
                      originalHeader={
                        appData.selectedComponent === "Disciplines" ||
                        appData.selectedComponent === "History" ||
                        appData.selectedComponent === "MyWorkload"
                          ? workloadTableHeaders
                          : appData.selectedComponent === "Teachers"
                          ? educatorTableHeaders
                          : appData.selectedComponent === "ScheduleMaterials" &&
                            scheduleHeaders
                      }
                      ssname={
                        appData.selectedComponent === "Disciplines"
                          ? "headerWorkload"
                          : appData.selectedComponent === "History"
                          ? "headerHistory"
                          : appData.selectedComponent === "Teachers"
                          ? "headerTeachers"
                          : appData.selectedComponent === "ScheduleMaterials"
                          ? "headerSchedule"
                          : appData.selectedComponent === "MyWorkload" &&
                            "headerMyWorkload"
                      }
                    />
                  )}
                </div>

                {appData.selectedComponent === "Disciplines" &&
                  appData.metodRole[appData.myProfile?.role]?.some(
                    (el) => el === 35
                  ) && (
                    <div className={styles.import}>
                      <button onClick={OpenPoPUpFile}>
                        <p>Импорт файла</p>
                        <img src="./img/import.svg" alt=">"></img>
                      </button>
                    </div>
                  )}

                {appData.metodRole[appData.myProfile?.role]?.some(
                  (el) => el === 50
                ) &&
                  appData.selectedComponent === "Disciplines" && (
                    <div className={styles.import}>
                      <button onClick={exportFile}>
                        <img
                          src="./img/exportTable.svg"
                          alt=">"
                          className={styles.export__img}
                        ></img>
                        <p>Экспорт таблицы</p>
                      </button>
                    </div>
                  )}
                {appData.selectedComponent === "ScheduleMaterials" && (
                  <div className={styles.import}>
                    <button onClick={exportSchedulefunc}>
                      <img
                        src="./img/exportTable.svg"
                        alt=">"
                        className={styles.export__img}
                      ></img>
                      <p>Экспорт таблицы</p>
                    </button>
                  </div>
                )}
                {appData.selectedComponent === "Teachers" && (
                  <div style={{ zIndex: "200" }} className={styles.import}>
                    <button onClick={funExportTeacher}>
                      <img
                        src="./img/exportTable.svg"
                        alt=">"
                        className={styles.export__img}
                      ></img>
                      <p>Экспорт таблицы</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.Block__tables}>
          {appData.selectedComponent === "Disciplines" ? (
            <TableWorkload
              tableMode={tableMode}
              tableHeaders={basicTabData.tableHeaders}
              setTableHeaders={basicTabData.setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : appData.selectedComponent === "Teachers" &&
            educatorIdforLk === "" ? (
            <TableTeachers
              setEducatorIdforLk={setEducatorIdforLk}
              changeInput={changeInput}
              tableHeaders={basicTabData.tableHeaders}
              setTableHeaders={basicTabData.setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              setEducatorData={setEducatorData}
            />
          ) : appData.selectedComponent === "Teachers" &&
            educatorIdforLk !== "" ? (
            <TableLks
              setEducatorIdforLk={setEducatorIdforLk}
              educatorIdforLk={educatorIdforLk}
              changeInput={changeInput}
              setTableHeaders={basicTabData.setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              educatorData={educatorData}
            />
          ) : appData.selectedComponent === "History" ? (
            <TableHistory
              tableMode={tableMode}
              tableHeaders={basicTabData.tableHeaders}
              setTableHeaders={basicTabData.setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : appData.selectedComponent === "ScheduleMaterials" ? (
            <TableSchedule
              tableMode={tableMode}
              // tableHeaders={tableHeaders}
              tableHeaders={basicTabData.tableHeaders}
              setTableHeaders={basicTabData.setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : appData.selectedComponent === "MyWorkload" ? (
            <MyWorkload
              tableMode={tableMode}
              tableHeaders={basicTabData.tableHeaders}
              setTableHeaders={basicTabData.setTableHeaders}
              searchTerm={basicTabData.searchTerm}
              setSearchTerm={basicTabData.setSearchTerm}
              refProfile={refProfile}
              setOpenModalWind={setOpenModalWind}
            />
          ) : null}
        </div>
        {!appData.metodRole[appData.myProfile?.role]?.some(
          (el) => el === 41
        ) && (
          <div onClick={raketClick}>
            <div className={styles.rocket}>
              <img
                className={styles.rocket_img}
                src="./img/rocket.png"
                alt="up"
              />
            </div>
          </div>
        )}

        {appData.selectedComponent !== "Teachers" && (
          <div className={styles.countSet}>
            Кол-во выделенных нагрузок: {new Set(tabPar.selectedTr).size}
          </div>
        )}
      </div>
      {filePopUp && (
        <PopUpFile
          setfilePopUp={setfilePopUp}
          // handleFileClear={handleFileClear}
        />
      )}
      {appData.createEdicatorPopUp && <PopUpCreateEmploy />}
      {appData.errorPopUp && <PopUpError />}

      {appData.godPopUp && <PopUpGoodMessage />}
      {tabPar.popupShareShow && (
        <SplitByHoursPopup component={appData.selectedComponent} />
      )}
      {textareaStor.textarea && <PopupTextArea data={textareaStor} />}
      {appData.popUpTextArea && <PopUpTextAreaMore />}
    </Layout>
  );
}

export default HomePage;
