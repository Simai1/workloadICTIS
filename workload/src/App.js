import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";
import Authorization from "./pages/Authorization/Authorization";
import {
  bufferRequestToApi,
  fixDataBuff,
  returnPrevState,
} from "./bufferFunction";
import { headers } from "./components/TableWorkload/Data";
import {
  Comment,
  GetDepartment,
  Workload,
  getAllAttaches,
  getAllColors,
  getOffers,
  apiGetHistory,
  CommentsLecktorer,
  getOffersLecturer,
} from "./api/services/ApiRequest";

import {
  funFilterSelected,
  funFixEducator,
  funSortedFastened,
} from "./components/TableWorkload/Function";
import { delChangeData } from "./ui/ContextMenu/Function";
import { FilteredSample } from "./ui/SamplePoints/Function";
import { horsTeacher } from "./components/TableTeachers/dataHoursForTeacher/HoursTicher";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [workload, setWorkload] = useState([]); // данные о нагрузках
  const [allWarningMessage, setAllWarningMessage] = useState([]);
  const [individualCheckboxes, setIndividualCheckboxes] = useState([]); //чекбоксы таблицы
  const [fileData, setFileData] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  //! в файле RoleMetods можно посмотреть назание метода и их id
  const metodRole = {
    METHODIST: [
      1, 3, 4, 8, 9, 10, 14, 17, 20, 21, 25, 26, 28, 29, 31, 34, 35, 36, 16, 40,
    ],
    LECTURER: [2, 15, 17, 17.1, 18, 20, 22, 24, 34, 37, 41],
    DEPARTMENT_HEAD: [
      2, 3, 4, 8, 9, 10, 11, 12, 13, 15, 17, 18, 22, 23, 25, 26, 27, 30, 31, 32,
      33, 34, 36, 16, 39, 40,
    ],
    DIRECTORATE: [
      1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 23, 25, 26, 27, 28, 30, 31,
      34, 35, 36, 38, 16, 40,
    ],
    UNIT_ADMIN: [
      1, 3, 4, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 23, 25, 26, 27, 28, 30, 31,
      34, 35, 36, 38, 16, 40, 42
    ],
    EDUCATOR: [15, 24, 41],
  };
  // appData.metodRole[appData.myProfile?.role]?.some((el) => el === 1)

  //! буфер последних действий. Выполняется после кнопки сохранить
  const [bufferAction, setBufferAction] = useState([]);
  const [errorPopUp, seterrorPopUp] = useState(false); //popUp error visible
  const [godPopUp, setgodPopUp] = useState(false); //popUp good visible

  const [createEdicatorPopUp, setcreateEdicatorPopUp] = useState(false); //popUp error visible
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [loaderAction, setLoaderAction] = useState(false);

  const appData = {
    individualCheckboxes,
    setIndividualCheckboxes,
    educator,
    setEducator,
    positions,
    setPositions,
    workload,
    setWorkload,
    allWarningMessage,
    setAllWarningMessage,
    bufferAction,
    setBufferAction,
    myProfile,
    fileData,
    setFileData,
    metodRole,
    seterrorPopUp,
    errorPopUp,
    setcreateEdicatorPopUp,
    createEdicatorPopUp,
    backBuffer,
    setgodPopUp,
    godPopUp,
    selectedComponent,
    setSelectedComponent,
    loaderAction,
    setLoaderAction,
    myProfile,
    setMyProfile,
    WhyColor,
  };

  //! параметры таблицы
  const [tableHeaders, setTableHeaders] = useState(headers);
  const [workloadData, setWorkloadData] = useState([]); // данные с бд нагрузок
  const [workloadDataFix, setWorkloadDataFix] = useState([]); //данные с убранным массиовм преподавателя
  const [filtredData, setFiltredData] = useState([]); // фильтрованные данные
  const [allCommentsData, setAllCommentsData] = useState([]); // все комментарии
  const [allOffersData, setAllOffersData] = useState([]); // предложения
  const [selectkafedra, setselectkafedra] = useState(""); //state выбранной кафедры
  const [actionUpdTabTeach, setActionUpdTabTeach] = useState(false); // при изменении обновляется таблицы преподавателей
  const [tableDepartment, settableDepartment] = useState([]);
  const [selectISOid, setselectISOid] = useState(true);
  const [nameKaf, setnameKaf] = useState(null);
  const [historyChanges, setHistoryChanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); //поиск по таблице

  const basicTabData = {
    searchTerm,
    setSearchTerm,
    updateAlldata,
    tableHeaders,
    setTableHeaders,
    workloadData,
    setWorkloadData,
    workloadDataFix,
    setWorkloadDataFix,
    filtredData,
    setFiltredData,
    allCommentsData,
    allOffersData,
    setAllCommentsData,
    funUpdateAllComments,
    funUpdateOffers,
    funUpdateTable,
    funUpdateFastenedData,
    funUpdateAllColors,
    setselectkafedra,
    funGetDepartment,
    funFilteredFilterSelected,
    selectkafedra,
    actionUpdTabTeach,
    setActionUpdTabTeach,
    tableDepartment,
    nameKaf,
    setnameKaf,
    setselectISOid,
    selectISOid,
    historyChanges,
    setHistoryChanges,
    funUpdateHistory,
  };

  const [coloredData, setColoredData] = useState([]); // выделенные цветом
  const [fastenedData, setFastenedData] = useState([]); // закрепленные строки (храним их id)
  const [selectedTable, setSelectedTable] = useState("Disciplines");
  const [selectedFilter, setSelectedFilter] = useState("Все дисциплины"); // текст в FiltredRows
  const [selectedTr, setSelectedTr] = useState([]); //выбранные tr
  const [onCheckBoxAll, setOnCheckBoxAll] = useState(false); //выбранные tr
  const [isSamplePointsData, setSamplePointsData] = useState([]); // данные фильтрации по th
  const [spShow, setSpShow] = useState(null); // отображение модального окна th
  const [contextMenuShow, setContextMenuShow] = useState(false); // показать скрыть контекст меню
  const [contextPosition, setContextPosition] = useState({ x: 300, y: 300 }); // позиция контекст меню в таблице
  const [perenesenAction, setPerenesenAction] = useState(false); // флаг который открывает перенесенные в истории

  const changedDataObj = {
    split: [],
    join: [],
    educator: [],
    hours: [],
    numberOfStudents: [],
    deleted: [],
  };
  // храним id и ключь измененных td для подсвечивания
  const [changedData, setChangedData] = useState(changedDataObj);
  const [isChecked, setIsChecked] = useState([]); // состояние инпутов в SamplePoints
  const [isAllChecked, setAllChecked] = useState(true); // инпут все в SamplePoints
  const checkPar = {
    isChecked,
    setIsChecked,
    isAllChecked,
    setAllChecked,
  };
  //! для виртуального скролла
  const [startData, setStartData] = useState(0); // индекс элемента с которого показывается таблица
  let visibleData = filtredData.length > 10 ? 10 : filtredData.length; // кооличество данных которые мы видим в таблице

  const heightTd = 150; // высота td

  const visibleDataPar = {
    startData,
    setStartData,
    visibleData,
    heightTd,
  };

  const tabPar = {
    selectedTable,
    setSelectedTable,
    selectedTr,
    setSelectedTr,
    setOnCheckBoxAll,
    onCheckBoxAll,
    isSamplePointsData,
    setSamplePointsData,
    spShow,
    setSpShow,
    contextMenuShow,
    setContextMenuShow,
    setContextPosition,
    contextPosition,
    allOffersData,
    setAllOffersData,
    allCommentsData,
    setAllCommentsData,
    fastenedData,
    setFastenedData,
    coloredData,
    setColoredData,
    changedDataObj,
    changedData,
    setChangedData,
    selectedFilter,
    setSelectedFilter,
    perenesenAction,
    setPerenesenAction,
  };

  
  //! функция обновления комментаривев
  function funUpdateAllComments() {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 37)) {
      CommentsLecktorer().then((data) => {
        console.log("comments", data);
        setAllCommentsData(data);
      });
    } else if (
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 20)
    ) {
      Comment().then((data) => {
        console.log("comments", data);
        setAllCommentsData(data);
      });
    }
  }

  //! функция обновления предложений преподавателей
  function funUpdateOffers() {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 17.1)) {
      getOffersLecturer().then((data) => {
        console.log("предложения", data);
        setAllOffersData(data);
      });
    } else {
      getOffers().then((data) => {
        console.log("предложения", data);
        setAllOffersData(data);
      });
    }
  }

  //! функция обновления истории
  function funUpdateHistory() {
    apiGetHistory().then((req) => {
      console.log("history", req);
      setHistoryChanges(req);
    });
  }

  //! функция получения закрепленных строк
  function funUpdateFastenedData() {
    getAllAttaches().then((data) => {
      console.log("закрепленные", data);
      if (data.length > 0) {
        setFastenedData(data);
      }
    });
  }
  //! Функция обновления существующих кафедр таблицы
  function funGetDepartment() {
    GetDepartment().then((response) => {
      if (response && response.status === 200) {
        // appData.metodRole[appData.myProfile?.role]?.some((el) => el === 42) ? settableDepartment([response?.data]) : settableDepartment([{ id: 14, name: "Все" }, ...response?.data]);
         settableDepartment(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 42) ? [response?.data] : [{ id: 14, name: "Все" }, ...response?.data])
        // setnameKaf("ОИД");
        console.log("Записал");
      }
    });
  }

  //! функция получения выделенных цветом строк
  function funUpdateAllColors() {
    getAllColors().then((data) => {
      console.log("выделенные", data);
      if (data.length > 0) {
        setColoredData(data);
      }
    });
  }

  //! функция которая принимает нагрузки из апи и записывает в состояния
  const funUpdTab = (data) => {
    const dataBd = [...data];
    setWorkloadData(dataBd);
    //! функция прокида буффера для преподавателей, часов, и колличества студентов
    const fixData = UpdateWorkloadForBoofer(
      funFixEducator(dataBd, bufferAction)
    );

    //! функция прокида буффера для разделения соединения и удаления нагрузок
    const fdb = fixDataBuff(fixData, bufferAction);
    // зменяем массив преподавателя на его имя
    const fdfix = FilteredSample(fdb, isChecked);
    setWorkloadData(fdb);
    setWorkloadDataFix(fdfix);
    setFiltredData(fdfix);
  };

  //! Функция для определения цвета фона
  function WhyColor(position, totalHours, rate) {
    let bg;
    let phuthicalHours = 900;
    let max = horsTeacher
      ? horsTeacher.find((el) => el.name === position)?.max
      : 0;
    let min = horsTeacher
      ? horsTeacher.find((el) => el.name === position)?.min
      : 0;
    let maxHours = max * rate;
    let minHorse = min * rate;

    if (totalHours === 0) {
      bg = "#e2e0e5"; // серый цвет
    } else if (totalHours > phuthicalHours || totalHours > maxHours) {
      bg = "#E81414"; // Красный цвет
    } else if (totalHours < minHorse) {
      bg = "#FFD600"; // Желтый цвет
    } else if (totalHours >= minHorse && totalHours <= maxHours) {
      bg = "#19C20A"; // Зеленый цвет
    } else if (totalHours > maxHours && totalHours <= phuthicalHours) {
      bg = "#ffa600"; // оранжевый цвет
    }
    return bg;
  }

  //! функция обновления таблицы
  function funUpdateTable(param = 0) {
    console.log("param", param);
    //param = tableDepartment[0]?.id
    if (metodRole[myProfile?.role]?.some((el) => el === 15)) {
      Workload("").then((data) => {
        if (data) {
          console.log("work", data);
          funUpdTab(data);
        }
      });
    }
    if (metodRole[myProfile?.role]?.some((el) => el === 14)) {
      let url = "";
      if (param == 0) {
        url = "?isOid=true";
      }
      if (param == "14") {
        url = ``;
      } else if (param != 14 && param != 0) {
        url = `?department=${param}`;
      }
      console.log("url", url);
      Workload(`${url}`).then((data) => {
        funUpdTab(data);
      });
    }

    // без параметров - вся абсолютно нагрузка,
    // ?isOid=true - вся ОИД нагрузка,
    // ?isOid=false - вся кафедральная нагрузка,
    // ?department={номер кафедры} - нагрузка одной кафедры
  }

  //!функция прокида буфера
  function UpdateWorkloadForBoofer(data) {
    if (bufferAction.length !== 0) {
      const newData = [...data];
      let obj = [];
      bufferAction.map((item) => {
        let existingObj = obj.find((el) => el.id === item.workloadId);
        if (existingObj) {
          if (item.request === "addEducatorWorkload") {
            existingObj.educator = item.edicatorName.edicatorName;
          }
          if (item.request === "workloadUpdata") {
            if (item.data.key === "numberOfStudents") {
              existingObj.numberOfStudents = item.data.value;
            }
            if (item.data.key === "hours") {
              existingObj.hours = item.data.value;
            }
          }
          // if( item.request === "splitWorkload"){
          //   console.log('existingObj', existingObj)
          // }
        } else {
          let o = {
            ...newData[newData.findIndex((el) => el.id === item.workloadId)],
          };
          if (item.request === "addEducatorWorkload") {
            o.educator = item.edicatorName.edicatorName;
          }
          if (item.request === "workloadUpdata") {
            if (item.data.key === "numberOfStudents") {
              o.numberOfStudents = item.data.value;
            }
            if (item.data.key === "hours") {
              o.hours = item.data.value;
            }
          }
          obj.push(o);
        }
      });
      return data.map((item) => {
        if (obj.find((e) => e.id === item.id)) {
          return obj.find((e) => e.id === item.id);
        } else if (item.educator === null || item.educator === undefined) {
          return {
            ...item,
            educator: item.educator ? item.educator.name : "___",
          };
        } else if (item.educator.name) {
          return {
            ...item,
            educator: item.educator.name,
          };
        } else {
          return item;
        }
      });
    } else {
      return data;
    }
  }
  // LECTURER: [2, 8, 15, 18, 22, 24],

  //! функция обновления всех данных
  function updateAlldata() {
    if(appData.metodRole[appData.myProfile?.role]?.some((el) => el === 42)){
      funUpdateTable(tableDepartment[0]?.id)
    }else if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 28)) {
      selectISOid
        ? funUpdateTable(0)
        : funUpdateTable(tableDepartment.find((el) => el.name === nameKaf)?.id);
    } else {
      if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 32)) {
        funUpdateTable(0);
      } else {
        funUpdateTable(14);
      }
    }
    if (
      appData.metodRole[appData.myProfile?.role]?.some(
        (el) => el === 20 || el === 37
      )
    ) {
      // получаем все комментарии
      funUpdateAllComments();
    }
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 17)) {
      // получение предложений
      funUpdateOffers();
    }
    // получение закрепленных строк
    funUpdateFastenedData();
    // получение выделенных строк
    funUpdateAllColors();
  }

  //! получаем данные нагрузок с бд
  useEffect(() => {
    if (myProfile) {
      console.log("myProfile", myProfile);
      console.log('tableDepartment', tableDepartment)
      appData.metodRole[appData.myProfile?.role]?.some((el) => el === 42) ? setnameKaf(tableDepartment[0]?.name) : setnameKaf("ОИД") 
      updateAlldata();
    }
  }, [tableDepartment, myProfile]); // [myProfile, tableDepartment]

  function funFilteredFilterSelected(splitData = [...workloadDataFix]) {
    return funFilterSelected(
      splitData,
      selectedFilter,
      coloredData,
      changedData,
      fastenedData,
      allCommentsData,
      allOffersData
    );
  }
  //! при переходе с кафедральных на общеинституские и обратно фильтруем основные
  //! фильтруем по FiltredRows
  useEffect(() => {
    // const splitData = funSplitData(workloadDataFix, dataIsOid);
    // console.log("workloadDataFix", splitData);
    const filterSelected = funFilteredFilterSelected();
    if (filterSelected) {
      setFiltredData(funSortedFastened(filterSelected, fastenedData));
    }

    setSelectedTr([]);
    setOnCheckBoxAll(false);
  }, [selectedFilter, workloadDataFix, selectedTable, fastenedData]);

  //! обновляем вертуальный скролл при переходе на другуюс таблицу
  useEffect(() => {
    setStartData(0);
    const table = document.querySelector("table");
    if (table) {
      table.scrollIntoView(true);
    }
  }, [selectedFilter, selectedTable]);

  //! при изменении закрпеленных перемещаем их наверх и сортируем массив
  //? ЕСЛИ ЧТО РАСКОМЕНТИТЬ
  // useEffect(() => {
  //   const fd = funSortedFastened(filtredData, fastenedData);
  //   console.log("fd", fd);
  //   setFiltredData(fd);
  // }, [fastenedData, filtredData]);

  //! следим за нажатием ctrl + s для сохранения изменений
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === "s" || event.key === "ы")) {
        event.preventDefault();
        console.log("Сохранено", bufferAction);
        bufferRequestToApi(bufferAction).then((action) => {
          if (action) {
            setBufferAction([0]);
            updateAlldata();
          }
        });
        setSelectedTr([]);
        setChangedData(changedDataObj);
        console.log("выполнено и очищено", bufferAction);
      }
    };
    // Назначьте обработчик события keydown при монтировании компонента
    document.addEventListener("keydown", handleKeyDown);

    // Удалите обработчик события keydown при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bufferAction]);

  //! функция отмены последенего действия с буффера
  function backBuffer() {
    console.log("отеменено последнее действие", bufferAction);
    //! отмена последнего действия
    if (bufferAction.length > 0) {
      if (
        bufferAction[0].request === "removeEducatorinWorkload" ||
        bufferAction[0].request === "addEducatorWorkload"
      ) {
        // убираем выделение с преподавателя
        setChangedData(
          delChangeData(changedData, "educator", [
            bufferAction[0].data.workloadId,
          ])
        );

        returnPrevState(bufferAction, workloadDataFix).then((data) => {
          setWorkloadDataFix(data);
          setBufferAction((prevItems) => prevItems.slice(1));
        });
      } else if (bufferAction[0].request === "deleteComment") {
        setAllCommentsData([...allCommentsData, ...bufferAction[0].prevState]);
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (bufferAction[0].request === "joinWorkloads") {
        // удаляем нагрузку которую обьеденили
        const dataTable = [...workloadDataFix].filter(
          (item) => !bufferAction[0].prevState.some((el) => el.id === item.id)
        );
        // сохраняем индекс удаленного элемента
        const deletedIndex = workloadDataFix.findIndex((item) =>
          bufferAction[0].prevState.some((el) => el.id === item.id)
        );
        const newArray = [...dataTable];
        newArray.splice(deletedIndex, 0, ...bufferAction[0].prevState);
        setWorkloadDataFix(newArray);
        // убираем заблокированные элементы
        let cd = { ...tabPar.changedData };
        let cdJoin = [...cd.join];
        cdJoin = cdJoin.filter(
          (el) => !bufferAction[0].prevState.some((item) => item.id !== el)
        );
        cd.join = cdJoin;
        setChangedData(cd);
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (bufferAction[0].request === "splitWorkload") {
        let datMap = { ...bufferAction[0] };
        const wdfNew = [...workloadDataFix]
          .map((item) => {
            if (datMap.newIds.some((el) => el === item.id)) {
              if (item.id[item.id.length - 1] === "0") {
                return datMap.prevState.find(
                  (e) => e.id === item.id.slice(0, -1)
                );
              }
            } else return item;
          })
          .filter((el) => el !== undefined);
        setWorkloadDataFix(wdfNew);
        let changed = { ...changedData };
        changed.split = changed.split.filter(
          (item) => !datMap.newIds.some((el) => el === item)
        );
        setBufferAction((prevItems) => prevItems.slice(1));
        setChangedData(changed);
      } else if (bufferAction[0].request === "workloadUpdata") {
        //отмена изменения даннных textarea
        const newData = [...workloadDataFix];
        newData.map((item) => {
          if (item.id === bufferAction[0].data.id) {
            item[bufferAction[0].data.key] = bufferAction[0].prevState;
          }
          return item;
        });
        setWorkloadDataFix([...newData]);
        // убираем заблокированные элементы
        // убираем выделение с преподавателя
        setChangedData(
          delChangeData(changedData, bufferAction[0].data.key, [
            bufferAction[0].data.id,
          ])
        );
        setBufferAction((prevItems) => prevItems.slice(1));
      } else if (bufferAction[0].request === "deleteWorkload") {
        // возвращаем удаленную нагрузку
        let cd = changedData;
        cd.deleted = cd.deleted.filter(
          (el) => !bufferAction[0].data.ids.some((item) => item === el) && el
        );
        setChangedData(cd);
        setBufferAction((prevItems) => prevItems.slice(1));
      }
    }
  }

  //! обновление таблицы, отмена действия при ctrl+z
  useEffect(() => {
    if (bufferAction[0] === 0) {
      setBufferAction([]);
    }
    const handleKeyDown = (event) => {
      //! следим за нажатием ctrl + z для отмены последнего действияы
      if (
        (event.ctrlKey || event.comand) &&
        (event.key === "z" ||
          event.key === "я" ||
          event.key === "Z" ||
          event.key === "Я")
      ) {
        backBuffer();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bufferAction]);

  return (
    <DataContext.Provider
      value={{
        appData,
        tabPar,
        visibleDataPar,
        checkPar,
        basicTabData,
      }}
    >
      <BrowserRouter basename="/client">
        <div className="Container">
          <Routes>
            <Route path="/" element={<Authorization />}></Route>
            <Route path="/HomePage" element={<HomePage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
