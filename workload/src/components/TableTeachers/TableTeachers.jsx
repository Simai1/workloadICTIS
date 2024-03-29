import styles from "./TableTeachers.module.scss";
import React, { useState, useEffect } from "react";
import EditInput from "../EditInput/EditInput";
import { useDispatch, useSelector } from "react-redux";
import DataContext from "../../context";
import { Educator } from "../../api/services/ApiRequest";

function TableTeachers(props) {
  const [updatedHeader, setUpdatedHeader] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [clickedName, setClickedName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]); // соберем из аднных апи общие данные

  const { appData } = React.useContext(DataContext);
  // заносим данные о преподавателях в состояние
  React.useEffect(() => {
    Educator().then((data) => {
      console.log("teatcher ", data);
      appData.setEducator(data); //данные с апи о преподавателях
      setFilteredData(data);
      setUpdatedData(data);
    });
    // Positions().then((data) => {
    //   appData.setPositions(data); //данные с апи должность
    // });
    // TypeOfEmployments().then((data) => {
    //   appData.setTypeOfEmployments(data); //данные с апи Вид занятости
    // });
  }, []);
  // console.log(appData);

  // const tableData = [
  //   {
  //     id: 1,
  //     name: "Данильченко Владислав Иванович",
  //     post: "Старший преподаватель",
  //     bet: "0,75",
  //     hours: "600",
  //     hours_period_1: "240",
  //     hours_period_2: "260",
  //     hours_without_a_period: "100",
  //     department: "ПиБЖ",
  //   },
  //   {
  //     id: 2,
  //     name: "Капылов Никита Максимович",
  //     post: "Старший преподаватель",
  //     bet: "0,75",
  //     hours: "600",
  //     hours_period_1: "240",
  //     hours_period_2: "260",
  //     hours_without_a_period: "100",
  //     department: "ПиБЖ",
  //   },
  // ];
  const tableHeaders = [
    { key: "id", label: "№" },
    { key: "name", label: "Преподователь" },
    { key: "position", label: "Должность" },
    { key: "typeOfEmployment", label: "Вид занятости" },
    { key: "department", label: "Кафедра" },
    { key: "rate", label: "Ставка" },
    { key: "maxHours", label: "Максимум часов" },
    { key: "recommendedMaxHours", label: "Рекомендуемый максимум часов" },
    { key: "minHours", label: "Минимум часов" },
  ];

  const handleNameClick = (name, index) => {
    // setClickedName(name);
    let postClickTicher = appData.educator[index].department;
    let betClickTicher = appData.educator[index].rate;
    props.onNameChange(name, postClickTicher, betClickTicher);
    props.setEducatorData(appData.educator[index]);
  };

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    addHeadersTable(filters, tableHeaders, appData.educator);
  }, [filters, dispatch]);

  function addHeadersTable(filters, tableHeaders, educator) {
    const updatedHeader = tableHeaders.filter((header) =>
      filters.includes(header.key)
    );
    const updatedData = educator.map((data) => {
      const updatedRow = {};
      Object.keys(data).forEach((key) => {
        if (filters.includes(key)) {
          updatedRow[key] = data[key];
        }
      });
      return updatedRow;
    });
    setUpdatedHeader(updatedHeader);
    setUpdatedData(updatedData);
  }
  // const handleSearch = (event) => {
  //   const searchTerm = event.target.value;
  //   setSearchTerm(searchTerm);
  //   let fd;
  //   if (searchTerm === "") {
  //     fd = updatedData;
  //   } else {
  //     fd = updatedData.filter((row) => {
  //       return Object.values(row).some((value) =>
  //         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //     });
  //   }
  //   setFilteredData(fd);
  // };
  React.useEffect(() => {
    let fd;
    if (props.searchTerm === "") {
      fd = updatedData;
    } else {
      fd = updatedData.filter((row) => {
        return Object.values(row).some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(props.searchTerm.toLowerCase())
        );
      });
    }
    setFilteredData(fd);
  }, [updatedData, props.searchTerm]);

  return (
    <div className={styles.TableTeachers}>
      {/* <div className={styles.tabledisciplinesMain_search}>
        <input
          id="searchTableTeachers"
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={handleSearch}
          className={styles.search}
        />
        <img src="./img/search.svg"></img>
      </div> */}

      {/* <div className={styles.EditInput}>
        <EditInput tableHeaders={tableHeaders} />
      </div> */}

      <div className={styles.TableTeachers__inner}>
        <table className={styles.TableTeachers}>
          <thead>
            <tr>
              {updatedHeader.map((header) => (
                <th key={header.key}>{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((key) => {
                  if (key === "name") {
                    return (
                      <td
                        key={key}
                        onClick={() => handleNameClick(row.name, index)}
                        className={styles.tdName}
                      >
                        {row[key]}
                      </td>
                    );
                  } else {
                    return (
                      <td key={key}>{key === "id" ? index + 1 : row[key]}</td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableTeachers;
