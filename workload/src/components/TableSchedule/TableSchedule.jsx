import React, { useContext, useEffect, useState } from "react";
import styles from "./TableSchedule.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";
import DataContext from "../../context";
import { funFixEducator } from "../TableWorkload/Function";
import { FilteredSample } from "../../ui/SamplePoints/Function";
import { useDispatch, useSelector } from "react-redux";
import { getSchedule } from "../../api/services/ApiRequest";
// import { scheduleHead } from "../TableWorkload/Data";
import ContextMenu from "../../ui/ContextMenu/ContextMenu";
import { resetStatus } from "../../store/popup/textareaData.slice";

function TableSchedule(props) {
  const { basicTabData, checkPar, appData } = useContext(DataContext);
  const [tableHeader, setTableHeader] = useState([...props.tableHeaders]);
  // const [tableHeader, setTableHeader] = useState(scheduleHead);
  const [tableData, setTableData] = useState([]);
  const [tableDataFix, setTableDataFix] = useState([]);
  const [filtredData, setFiltredData] = useState([]);
  const ssIsChecked = `isCheckedSchedule${basicTabData.nameKaf}`;
  // const ssHeader = `TableScheduleHeader${basicTabData.nameKaf}`;
  const ssHeader = `headerSchedule`;
  //! достаем данные из редакса
  const isCheckedStore = useSelector((state) => state.isCheckedSlice.isChecked);
  const dispatch = useDispatch();
  const textareaStor = useSelector((state) => state.textAreaSlice);
  const scheduleSlice = useSelector((state) => state.scheduleSlice);

  // const [limit, setLimit] = useState({
  //   limit: 20,
  //   offset: 0,
  // });

  // const setLim = (l, o) => {
  //   setLimit({
  //     limit: l,
  //     offset: o,
  //   });
  // };
  //параметр для сортировки по колонке
  const [sortParamByColumn, setSortParamByColumn] = useState("");

  const funUpdateTabDat = () => {
    appData.setDataUpdated(false);
    if (appData.loaderAction === 0) {
      appData.setLoaderAction(2);
    }
    let dataBd = [];
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
    if (url !== "" && sortParamByColumn !== "") {
      url = url + `&${sortParamByColumn}`;
    } else if (url === "" && sortParamByColumn !== "") {
      url = `?${sortParamByColumn}`;
    }

    const act = scheduleSlice?.scheduleSelectedFilter.param;
    if (url !== "" && act !== "") {
      url = url + `&${act}`;
    } else if (url === "" && act !== "") {
      url = `?${act}`;
    }

    // getSchedule(url, limit).then((resp) => {
    getSchedule(url).then((resp) => {
      if (resp?.status === 200) {
        // dataBd = [...tableData, ...resp.data];
        dataBd = [...resp.data];
        console.log(
          "dataBd",
          dataBd.filter((el) => !el.isActual && el)
        );
        const fixEducator = funFixEducator(dataBd);
        const checks = isCheckedStore[ssIsChecked];
        const fdfix = FilteredSample(fixEducator, checks);
        setTableData(dataBd);
        setTableDataFix(fdfix);
        setFiltredData(fdfix);
        checkPar.setIsChecked(checks || []);
        appData.setLoaderAction(0);
      } else {
        appData.setLoaderAction(0);
      }
    });
  };

  useEffect(() => {
    funUpdateTabDat();
  }, [
    basicTabData.selectTableSchedle,
    appData.dataUpdated,
    isCheckedStore,
    sortParamByColumn,
    scheduleSlice?.scheduleSelectedFilter,
    // limit,
  ]);

  // useEffect(() => {
  //   // console.log("visibleDataPar.startData", visibleDataPar.startData);
  //   if (visibleDataPar.startData > limit.offset) {
  //     setLim(limit.limit, limit.offset + 20);
  //   }
  // }, [visibleDataPar.startData]);

  useEffect(() => {
    if (textareaStor.status === 200) funUpdateTabDat();
    dispatch(resetStatus({ value: 0 }));
  }, [textareaStor.status]);

  const tabDat = {
    funUpdateTabDat,
    tableHeader,
    setTableHeader,
    tableData,
    setTableData,
    tableDataFix,
    setTableDataFix,
    filtredData,
    setFiltredData,
    ssIsChecked,
    ssHeader,
    isCheckedStore,
    sortParamByColumn,
    setSortParamByColumn,
    isSorted: true, //! показать или скрыть сортировку
    isBlocked: false, //! показывать или скрывать блокированные false это показать
    isSignature: false, //! показывать или скрыть подпись блокированные, разделенные и тд.
    isActual: true, //! выделять в расписании акутальные
  };

  //! функция которая возвращает контекстное меню с параметрами
  const getContextMenu = () => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 54.1)) {
      return (
        <ContextMenu
          setTableDataFix={setTableDataFix}
          tableDataFix={tableDataFix}
          allowedMenus={["Удалить"]}
        />
      );
    } else return "";
  };

  return (
    <div className={styles.TableSchedule}>
      <UniversalTable
        searchTerm={props.searchTerm}
        contextMenu={() => getContextMenu()}
        tabDat={tabDat}
      />
    </div>
  );
}

export default TableSchedule;
