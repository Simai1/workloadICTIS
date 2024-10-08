import React, { useState } from "react";
import styles from "./../UniversalTable.module.scss";
import DataContext from "../../../context";
import OverlapWindow from "./OverlapWindow";
import Comments from "./Comments";
import Offers from "./Offers";
import { ReactComponent as ImgClearFilter } from "./../../../img/ClearFilter.svg";
import { FilteredSample } from "../../../ui/SamplePoints/Function";
import { useDispatch } from "react-redux";
import { removeTableCheckeds } from "../../../store/filter/isChecked.slice";
function InputCheckbox(props) {
  const { appData, tabPar, basicTabData, checkPar } =
    React.useContext(DataContext);
  const [isHovered, setIsHovered] = useState(false);

  //! функция определения есть ли комментарии к строке
  const getComment = () => {
    return basicTabData.allCommentsData.filter(
      (item) => item.workloadId === props.itid
    );
  };
  //! функция получения предложений к строке
  const getOffers = () => {
    return basicTabData.allOffersData.filter(
      (item) => item.offer?.workloadId === props.itid
    );
  };
  const stylesTh = { backgroundColor: props.bgColor, zIndex: "31" };
  const stylesTd = {
    zIndex: `${10 - props.number}`,
    backgroundColor: props.bgColor,
  };
  const dispatch = useDispatch();
  //!функция сброса фильтров
  const refreshFilters = () => {
    checkPar.setIsChecked([]);
    checkPar.setAllChecked([]);
    dispatch(
      removeTableCheckeds({
        tableName: props.tabDat.ssIsChecked,
      })
    );
    const fdfix = FilteredSample(props.tabDat.tableData, [], "");
    props.tabDat.setTableDataFix(fdfix);
    appData.setSortParamByColumn("");
  };

  const getClassTd = () => {
    let cl = `${styles.InputCheckbox}`;
    if (props.tabDat.isActual && !props.workload.isActual) {
      cl = `${cl} ${styles.tableShaduleTdOld}`;
    }
    return cl;
  };

  return (
    <>
      {props.th ? (
        <th style={stylesTh} className={styles.InputCheckbox}>
          <div className={styles.bacground}>
            <ImgClearFilter
              className={
                checkPar.isChecked.length > 0
                  ? styles.svgRed
                  : styles.bacgroundsvgRed
              }
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={refreshFilters}
            />
            {isHovered && (
              <div className={styles.BlockTextFilter}>
                <div className={styles.triangle}></div>
                <p className={styles.textFilter}>Сбросить фильтры</p>
              </div>
            )}
          </div>
          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </th>
      ) : (
        <td style={stylesTd} className={getClassTd()}>
          {tabPar.fastenedData.some((el) => el.workloadId === props.itid) && ( //отмечаем закрепленные // сделать проверку на преподавателя который закрепляет
            <img
              className={styles.fastenedImg}
              src="./img/fastened.svg"
              alt="fastened"
            ></img>
          )}
          {/* //! перекрытие */}
          {props.getConfirmation.blocked && (
            <OverlapWindow
              getConfirmation={props.getConfirmation}
              itid={props.itid}
              tabDat={props.tabDat}
            />
          )}
          {
            //! определяем разделенная ли нагрузка
            props.workload?.isSplit && props.tabDat.isSignature && (
              <div className={styles.isSplit}>
                <span>Разделенная</span>
              </div>
            )
          }
          {
            //! определяем разделенная ли нагрузка
            props.workload?.isBlocked && props.tabDat.isSignature && (
              <div
                className={styles.isSplit}
                style={{ transform: "translateY(-20px)" }}
              >
                <span>Заблокирована </span>
              </div>
            )
          }
          {
            //! после резделения или обьединения исходную помечаем
            props.workload?.isSplitArrow && props.tabDat.isSignature && (
              <div className={styles.isSplit}>
                <span>Исходная</span>
                <img src="img/Arrow.svg" alt=">" />
              </div>
            )
          }
          {
            //! определяем разделенная ли нагрузка
            props.workload?.isMerged && props.tabDat.isSignature && (
              <div className={styles.isSplit}>Объединенная</div>
            )
          }
          <div className={styles.bacground}>
            {getComment().length > 0 &&
              appData.metodRole[appData.myProfile?.role]?.some(
                (el) => el === 20
              ) && <Comments commentData={getComment().reverse()} />}
            {getOffers().length > 0 && (
              <Offers offerData={getOffers().reverse()} />
            )}
          </div>

          <input
            onChange={(e) => props.clickTr(e, props.itemId)}
            type="checkbox"
            checked={props.checked}
          ></input>
        </td>
      )}
    </>
  );
}

export default InputCheckbox;
