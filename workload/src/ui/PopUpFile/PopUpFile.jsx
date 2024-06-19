import React, { useEffect, useRef, useState } from "react";
import styles from "./PopUpFile.module.scss";
import Button from "../Button/Button";
import DataContext from "../../context";
import { SubmitFileXLSX } from "../../api/services/ApiRequest";
import arrow from "./../../img/arrow_down.svg";

export function PopUpFile(props) {
  const { appData, basicTabData } = React.useContext(DataContext);
  const [valueCafedra, setvalueCafedra] = useState("");
  const [openListFlag, setopenListFlag] = useState(false);
  const [fileData, setfileData] = useState(null);
  const cafData = [
    { name: "ОИД", id: 0 },
    { name: "БИТ", id: 1 },
    { name: "ИИТиС", id: 2 },
    { name: "ВТ", id: 3 },
    { name: "ИАСБ", id: 4 },
    { name: "ИБТКС", id: 5 },
    { name: "ИМС", id: 6 },
    { name: "МОП ЭВМ", id: 7 },
    { name: "ПиБЖ", id: 8 },
    { name: "САИТ", id: 9 },
    { name: "САПР", id: 10 },
    { name: "СиПУ", id: 11 },
    { name: "ФМОИО", id: 12 },
  ];
  const fileInputRef = useRef(null);

  const closeMenuPopFile = () => {
    appData.setFileData(null);
    props.setfilePopUp(false);
  };

  const UpdateTable = () => {
    appData.setLoaderAction(true);
    closeMenuPopFile();
    const constIdCafedra = cafData.find((e) => e.name === valueCafedra).id;
    const fileData = appData?.fileData;
    const formData = new FormData();
    formData.append("file", fileData);
    SubmitFileXLSX(constIdCafedra, formData).then((resp) => {
      appData.setLoaderAction(false);
      if (resp) {
        basicTabData.funGetDepartment();
        basicTabData.funUpdateTable();
        appData.setgodPopUp(true);
      }
    });
  };

  const refSave = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refSave.current && !refSave.current.contains(event.target)) {
        closeMenuPopFile();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setfileData(file);
    appData.setFileData(file);
  };

  const clickFile = () => {
    fileInputRef.current.click();
  };

  const setCaf = (nameKaf) => {
    setvalueCafedra(nameKaf);
    setopenListFlag(false);
  };

  useEffect(() => {
    console.log("file", appData.fileData?.name);
  }, []);

  // Determine if the button should be disabled
  const isButtonDisabled = !fileData || !valueCafedra;

  return (
    <div className={styles.mainPop} ref={refSave}>
      <div className={styles.mainPop__inner}>
        <div className={styles.import_blockFirst}>
          <div>
            <h3>Импорт файла</h3>
          </div>
          <div onClick={closeMenuPopFile}>
            <img src="./img/close.svg" />
          </div>
        </div>
        <div className={styles.import_blocktwo}>
          <div className={styles.clickBlock} onClick={clickFile}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div>
              <img src="./img/doc.svg" />
            </div>
            <div>
              <p>{fileData ? fileData.name : "Загрузите документ"}</p>
            </div>
          </div>
        </div>
        <div className={styles.import_blockThree}>
          <div>
            <p>Выберите подразделение:</p>
          </div>
          <div
            className={styles.SelectCafInput}
            onClick={() => setopenListFlag(!openListFlag)}
          >
            <div className={styles.SelectCafInput__inner}>
              <input
                placeholder="Выберите подра..."
                value={valueCafedra}
                readOnly
                onClick={() => setopenListFlag(true)}
              />
              <img
                style={{
                  transform: !openListFlag ? "rotate(-90deg)" : "rotate(0deg)",
                }}
                src={arrow}
              />
            </div>
          </div>
          {openListFlag && (
            <div className={styles.list}>
              <div className={styles.listInner}>
                {cafData?.map((item) => (
                  <p key={item.id} onClick={() => setCaf(item.name)}>
                    {item.name}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.block4}>
          <p>
            Вы уверены, что хотите импортировать новые данные в таблицу? Данное
            действие нельзя будет отменить!
          </p>
        </div>
        <div className={styles.blockButton}>
          <button onClick={closeMenuPopFile}>Нет</button>
          <button
            onClick={UpdateTable}
            disabled={isButtonDisabled}
            style={{
              backgroundColor: isButtonDisabled ? "grey" : "#3b28cc",
              cursor: isButtonDisabled ? "not-allowed" : "pointer",
            }}
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
}
