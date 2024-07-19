import React from "react";
import styles from "./Styles.module.scss";
import { tableHeader } from "../AdminData";

function Table(props) {
  return (
    <div className={styles.Table}>
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              {tableHeader.map((item, index) => (
                <th key={item.key + index}>{item.name}</th>
              ))}
            </tr>
          </thead>
          <tbody onContextMenu={(event) => props.lcmClick(event)}>
            {props.tableData.map((item) => (
              <tr
                key={item.id}
                onClick={() => props.trClick(item)}
                className={
                  props.selectedTr === item.id ? styles.selectedTr : null
                }
              >
                {tableHeader.map((keys, index) => (
                  <td key={keys.key + index}>
                    {item[keys.key]?.length === 0 ? "__" : item[keys.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
