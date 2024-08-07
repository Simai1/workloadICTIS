import React, { useEffect, useState } from "react";
import DataContext from "../../../context";
import PopUpContainer from "../../../ui/PopUpContainer/PopUpContainer";
import Button from "../../../ui/Button/Button";
import List from "../../../ui/List/List";
import Input from "../../../ui/Input/Input";
import styles from "./PopUpEditTeacher.module.scss";
import {
  EditTeacher,
  GetAllDepartments,
  GetUsibleDepartment,
} from "../../../api/services/ApiRequest";

export function PopUpEditTeacher(props) {
  const { appData } = React.useContext(DataContext);
  const [selectedRowsId, setSelectedRowsId] = useState(props.IdRows);
  const [dataNewEdicator, setdataNewEdicator] = useState({
    name: props.selectRows?.name,
    position: props.selectRows?.position,
    rate: props.selectRows?.rate,
    typeOfEmployment: props.selectRows?.typeOfEmployment,
    department: props.selectRows?.department,
  });
  const [isRateValid, setIsRateValid] = useState(true);

  const ListTypeOfEmployment = [
    { id: 1, name: "Внешнее совместительство" },
    { id: 2, name: "Внутреннее совместительство" },
    { id: 3, name: "Основное место работы" },
    { id: 4, name: "Почасовая оплата труда" },
  ];
  const dataListPosition = [
    { id: 1, name: "Ассистент" },
    { id: 2, name: "Ведущий научный сотрудник" },
    { id: 3, name: "Главный научный сотрудник" },
    { id: 5, name: "Доцент" },
    { id: 6, name: "Научный сотрудник" },
    { id: 7, name: "Профессор" },
    { id: 8, name: "Старший научный сотрудник" },
    { id: 9, name: "Старший преподаватель" },
    { id: 10, name: "Преподаватель" },
    { id: 11, name: "Заведующий кафедрой" },
  ];

  const [dataKaf, setDataKaf] = useState([]);
  useEffect(() => {
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 46)) {
      GetAllDepartments().then((resp) => {
        setDataKaf(resp.data);
      });
    } else {
      GetUsibleDepartment().then((resp) => {
        if(resp){
          setDataKaf(resp.data);
        }
      });
    }
  }, []);

  useEffect(()=>{
    console.log("dataNewEdicator",dataNewEdicator)
  },[dataNewEdicator])

  const handleInputChange = (name, value) => {
    if (name === "rate") {
      const rateValue = parseFloat(value.replace(",", "."));
      setIsRateValid(rateValue >= 0 && rateValue <= 1);
    }

    setdataNewEdicator((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputList = (name, value) => {
    setdataNewEdicator((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClicks = () => {
    let depart;
    let position;
    let type;
    if (appData.metodRole[appData.myProfile?.role]?.some((el) => el === 39)) {
      depart = appData.myProfile?.educator?.departmentId;
    } else {
      console.log('dataNewEdicator?.department', dataNewEdicator?.department)
      !Number(dataNewEdicator?.department)
        ? (depart = dataKaf.find(
            (el) => el.name === dataNewEdicator?.department
          )?.id)
        : (depart = dataNewEdicator?.department);
    }

    !Number(dataNewEdicator?.typeOfEmployment)
      ? (type = ListTypeOfEmployment.find(
          (el) => el.name === dataNewEdicator?.typeOfEmployment
        ).id)
      : (type = dataNewEdicator?.typeOfEmployment);
    !Number(dataNewEdicator?.position)
      ? (position = dataListPosition.find(
          (el) => el.name === dataNewEdicator?.position
        )?.id)
      : (position = dataNewEdicator?.position);
    const data = {
      name: dataNewEdicator?.name,
      position: position,
      typeOfEmployment: type,
      rate:
        typeof dataNewEdicator?.rate === "string"
          ? Number(dataNewEdicator?.rate.replace(",", "."))
          : dataNewEdicator?.rate,
      department: depart === undefined ? 0 : depart,
    };

    console.log("data", data);
    EditTeacher(selectedRowsId, data).then((resp) => {
      if (resp.status === 200) {
        props.updateTable();
        props.setSelectRow(null);
        props.setVizibleCont(false);
      }
    });
  };

  return (
    <div className={styles.Mt}>
      <PopUpContainer
        setVizibleCont={props.setVizibleCont}
        title={"Редактирование преподавателя"}
      >
        <div className={styles.mainPop__inner}>
          <div className={styles.inputBlock}>
            <Input
              Textlabel="ФИО"
              placeholder="Иваннов Иван Михайлович"
              name={"name"}
              handleInputChange={handleInputChange}
              value={dataNewEdicator.name}
            />
            <List
              dataList={dataListPosition}
              Textlabel="Должность"
              defaultValue="Выберите должность"
              name={"position"}
              handleInputList={handleInputList}
              value={dataNewEdicator.position}
            />
            <List
              dataList={ListTypeOfEmployment}
              Textlabel="Вид занятости"
              defaultValue="Выберите вид занятости"
              name={"typeOfEmployment"}
              value={dataNewEdicator.typeOfEmployment}
              handleInputList={handleInputList}
            />
            <Input
              Textlabel="Ставка"
              placeholder="0.5"
              name={"rate"}
              handleInputChange={handleInputChange}
              value={dataNewEdicator.rate}
              type="number"
            />
            {!isRateValid && (
              <div
                className={styles.error}
                style={{
                  color: "red",
                  position: "relative",
                  left: "80px",
                  top: "-20px",
                }}
              >
                Ставка должна быть от 0 до 1
              </div>
            )}
            <List
              dataList={dataKaf}
              Textlabel="Кафедра"
              defaultValue="Выберите кафедру"
              name={"department"}
              handleInputList={handleInputList}
              value={dataNewEdicator.department}
            />
          </div>
          <div
            className={styles.buttonBlock}
            style={{
              display: "flex",
              justifyContent: "end",
              position: "relative",
              bottom: "-10px",
            }}
          >
            <button
              className={styles.buttonSave}
              onClick={handleClicks}
              disabled={
                !isRateValid ||
                !dataNewEdicator.name ||
                !dataNewEdicator.position ||
                !dataNewEdicator.rate ||
                !dataNewEdicator.department === undefined 
              }
              style={{
                backgroundColor:
                  !isRateValid ||
                  !dataNewEdicator.name ||
                  !dataNewEdicator.position ||
                  !dataNewEdicator.rate ||
                  !dataNewEdicator.department === undefined 
                    ? "#b9b9ba"
                    : "#3b28cc",
                cursor:
                  !isRateValid ||
                  !dataNewEdicator.name ||
                  !dataNewEdicator.position ||
                  !dataNewEdicator.rate ||
                  !dataNewEdicator.department === undefined 
                    ? "not-allowed"
                    : "pointer",
                color: "#fff",
                borderRadius: "8px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "10px",
                paddingBottom: "10px",
                width: "150px",
                transition: "opacity 0.3s ease",
                opacity: 1,
              }}
              onMouseEnter={(e) => {
                e.target.style.transition = "opacity 0.15s ease";
                e.target.style.opacity = 0.7;
              }}
              onMouseLeave={(e) => {
                e.target.style.transition = "opacity 0.15s ease";
                e.target.style.opacity = 1;
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </PopUpContainer>
    </div>
  );
}

export default PopUpEditTeacher;
