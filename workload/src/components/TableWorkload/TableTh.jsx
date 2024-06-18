import React from "react";
import styles from "./TableWorkload.module.scss";
import DataContext from "../../context";
import { SamplePoints } from "../../ui/SamplePoints/SamplePoints";

function TableTh(props) {
  const { tabPar, basicTabData, checkPar } = React.useContext(DataContext);
  //! открытие модального окна фильтрации столбца
  const clickTh = () => {
    if (tabPar.spShow === props.index) {
      tabPar.setSpShow(null);
    } else {
      const modalData = basicTabData.workloadData.map(
        (item) => item[props.item.key]
      );
      tabPar.setSamplePointsData([...modalData]);
      tabPar.setSpShow(props.index);
    }
  };

  return (
    <th name={props.item.key} key={props.item.key}>
      {props.modal && (
        <SamplePoints index={props.index} itemKey={props.item.key} />
      )}

      <div className={styles.th_inner} onClick={clickTh}>
        {props.item.label}
        <img
          src={
            checkPar.isChecked.find((item) => item.itemKey === props.item.key)
              ? "./img/filterColumn.svg"
              : "./img/th_fight.svg"
          }
        ></img>
      </div>
    </th>
  );
}

export default TableTh;
