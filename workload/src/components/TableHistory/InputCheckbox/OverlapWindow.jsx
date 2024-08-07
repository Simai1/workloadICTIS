//! окно перекрытия блокированных разделенных, соедененных, удаленных строк

import DataContext from "../../../context";
import styles from "./../TableWorkload.module.scss";
import React from "react";
import {
  deleteWorkload,
  joinWorkloads,
  splitWorkload,
} from "../../../api/services/ApiRequest";
import { deleteItemBuffer } from "../Function";

function OverlapWindow(props) {
  const { tabPar, appData, basicTabData } = React.useContext(DataContext);

  const cancelChanges = () => {
    if (props.getConfirmation.type === 1) {
      appData.setBufferAction(
        deleteItemBuffer(
          [...appData.bufferAction],
          props.itid,
          "deleteWorkload"
        ).buffer
      );
      let changed = { ...tabPar.changedData };
      changed.deleted = changed.deleted.filter((item) => item !== props.itid);
      tabPar.setChangedData(changed);
    } else if (props.getConfirmation.type === 2) {
      const dat = { ...props.getConfirmation.data };
      let buff = [...appData.bufferAction];
      let itemBuff = buff.find((el) => el.id === dat.id);
      let index = buff.findIndex((el) => el.id === dat.id);
      let bd = { ...itemBuff.data };
      const bdids = bd.ids.filter((el) => !dat.data.ids.some((e) => e === el));
      const newbd = {
        ids: bdids,
        n: bd.n,
      };
      let bnids = [...itemBuff.newIds];
      const bnidsNew = bnids.filter((el) => !dat.newIds.some((e) => e === el));
      const newState = itemBuff.newState.filter(
        (el) => el.id !== dat.newState.id
      );
      let ps = itemBuff.prevState.filter((el) => el.id !== dat.prevState.id);
      let buffDat = {
        id: dat.id,
        data: newbd,
        newIds: bnidsNew,
        newState: newState,
        prevState: ps,
        request: "splitWorkload",
      };
      buff[index] = buffDat;
      appData.setBufferAction([...buff]);
      let wdf = [...basicTabData.workloadDataFix];

      let datMap = { ...dat };
      let f = true;
      const wdfNew = wdf
        .map((item) => {
          if (datMap.newIds.some((el) => el === item.id)) {
            if (f) {
              f = false;
              return datMap.prevState[0];
            }
          } else return item;
        })
        .filter((el) => el !== undefined);

      basicTabData.setWorkloadDataFix(wdfNew);

      let changed = { ...tabPar.changedData };
      changed.split = changed.split.filter(
        (item) => !dat.newIds.some((el) => el === item)
      );
      tabPar.setChangedData(changed);
    } else if (props.getConfirmation.type === 3) {
      const bd = props.getConfirmation.data;
      // удаляем нагрузку которую обьеденили
      const dataTable = [...basicTabData.workloadDataFix].filter(
        (item) => !bd.prevState.some((el) => el.id === item.id)
      );
      // сохраняем индекс удаленного элемента
      const deletedIndex = basicTabData.workloadDataFix.findIndex((item) =>
        bd.prevState.some((el) => el.id === item.id)
      );
      const newArray = [...dataTable];
      newArray.splice(deletedIndex, 0, ...bd.prevState);
      basicTabData.setWorkloadDataFix(newArray);
      // убираем заблокированные элементы
      let cd = { ...tabPar.changedData };
      let cdJoin = [...cd.join];
      cdJoin = cdJoin.filter(
        (el) => !bd.prevState.some((item) => item.id !== el)
      );
      cd.join = cdJoin;
      tabPar.setChangedData(cd);
      appData.setBufferAction((prevItems) => prevItems.slice(1));
    }
  };

  const confirmChanges = () => {
    // удаляем нагрузку
    if (props.getConfirmation.type === 1) {
      deleteWorkload({ ids: [props.itid] }).then(() => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "deleteWorkload"
          ).buffer
        );
        basicTabData.setWorkloadDataFix(
          basicTabData.workloadDataFix.filter((item) => item.id !== props.itid)
        );
        basicTabData.setWorkloadData(
          basicTabData.workloadData.filter((item) => item.id !== props.itid)
        );
        let changed = { ...tabPar.changedData };
        changed.deleted = changed.deleted.filter((item) => item !== props.itid);
        tabPar.setChangedData(changed);
      });
    }
    // разделяем нагрузку
    else if (props.getConfirmation.type === 2) {
      splitWorkload(props.getConfirmation.data.data).then(() => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "splitWorkload"
          ).buffer
        );
        let changed = { ...tabPar.changedData };
        changed.split = changed.split.filter(
          (item) => item.slice(0, -1) !== props.itid.slice(0, -1)
        );
        tabPar.setChangedData(changed);

        if (basicTabData.tableDepartment.length > 0) {
          basicTabData.funUpdateTable(
            basicTabData.tableDepartment.find(
              (el) => el.name === basicTabData.nameKaf
            ).id
          );
        }
      });
    } else if (props.getConfirmation.type === 3) {
      joinWorkloads(props.getConfirmation.data.data).then((res) => {
        appData.setBufferAction(
          deleteItemBuffer(
            [...appData.bufferAction],
            props.itid,
            "joinWorkload"
          ).buffer
        );
        let changed = { ...tabPar.changedData };
        changed.join = changed.join.filter((item) => item !== props.itid);
        tabPar.setChangedData(changed);
        if (basicTabData.tableDepartment.length > 0) {
          basicTabData.funUpdateTable(
            basicTabData.tableDepartment.find(
              (el) => el.name === basicTabData.nameKaf
            )?.id
          );
        }
      });
    }
  };

  return (
    <div className={styles.OverlapWindow}>
      <div
        style={{
          height: props.getConfirmation.height,
          top: props.getConfirmation.top,
        }}
        key={"confirmation"}
        className={styles.confirmation}
      >
        <button className={styles.btn_left} onClick={cancelChanges}>
          Отменить
        </button>
        <button className={styles.btn_right} onClick={confirmChanges}>
          Подтвердить
        </button>
      </div>
    </div>
  );
}

export default OverlapWindow;
