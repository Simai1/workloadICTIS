import React from "react";
import styles from "./TableDisciplines.module.scss";
import { ReactComponent as SvgChackmark } from "./../../img/checkmark.svg";
import { ReactComponent as SvgCross } from "./../../img/cross.svg";

function TableTd(props) {
  return (
    <td
      key={props.updatedHeader[props.ind].key}
      className={
        props.updatedHeader[props.ind].key === "discipline" ||
        props.updatedHeader[props.ind].key === "id" ||
        props.updatedHeader[props.ind].key === "workload"
          ? styles.stytic_td
          : null
      }
      style={{ left: props.arrLeft[props.ind] || "0" }}
    >
      <div
        className={styles.td_inner}
        onDoubleClick={() => props.changeValueTd(props.index, props.ind)}
        style={
          props.changeNumberOfStudents?.some((el) => el === props.row.id) &&
          props.updatedHeader[props.ind].key === "numberOfStudents"
            ? {
                backgroundColor: "rgb(255 135 135)",
                borderRadius: "8px",
              }
            : props.changeHours?.some((el) => el === props.row.id) &&
              props.updatedHeader[props.ind].key === "hours"
            ? {
                backgroundColor: "rgb(255 135 135)",
                borderRadius: "8px",
              }
            : props.changeEducator?.some((el) => el === props.row.id) &&
              props.updatedHeader[props.ind].key === "educator"
            ? {
                backgroundColor: "rgb(255 135 135)",
                borderRadius: "8px",
              }
            : null
        }
      >
        {/* редактирование поля нагрузки при двойном клике на нее */}
        {props.cellNumber &&
        props.cellNumber.index === props.index &&
        props.cellNumber.ind === props.ind ? (
          <div className={styles.textarea_title} ref={props.refTextArea}>
            <textarea
              className={styles.textarea}
              type="text"
              defaultValue={props.row[props.updatedHeader[props.ind].key]}
              onChange={props.onChangeTextareaTd}
            ></textarea>
            <div className={styles.svg_textarea}>
              {props.textareaTd?.trim() && (
                <SvgChackmark
                  className={styles.SvgChackmark_green}
                  onClick={() => props.onClickButton(props.row.id, props.key)}
                />
              )}
              <SvgCross
                onClick={() => {
                  props.setCellNumber([]);
                }}
              />
            </div>
          </div>
        ) : props.row[props.updatedHeader[props.ind].key] === null ? (
          "0"
        ) : props.updatedHeader[props.ind].key === "id" ? (
          props.index + 1
        ) : (
          props.row[props.updatedHeader[props.ind].key]
        )}
      </div>
    </td>
  );
}

export default TableTd;
