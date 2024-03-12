import React, { useState } from 'react';
import styles from "./ContextMenu.module.scss"
import arrow from "./../../img/arrow.svg"
const ContextMenu = (props) => {
  const [menuPosition, setMenuPosition] = useState(props.menuPosition);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };
  const handleMouseClickPop = () => {
    setShowSubMenu(!showSubMenu);
  };

  const handleMouseLeave = () => {
    setShowSubMenu(false);
  };
  return (
    
    <div onContextMenu={handleContextMenu} className={styles.ContextMenu}>
        <div
          style={{
            position: 'fixed',
            top: menuPosition.y,
            left: menuPosition.x,
          }}
          className={styles.blockMenu}
        >
          <div>
            <button onClick={props.handleMenuClick} className={styles.activeStylePointer}>Добавить преподователя</button>
          </div>
          <div 
            onClick={handleMouseClickPop}
            className={styles.blockMenuPop}
            >
            <button className={styles.buttonDel}>Разделить</button>
            
            
            {showSubMenu && (
             <img src={arrow} className={styles.imgOpen}/>
            )}
            {!showSubMenu && (
             <img src={arrow} className={styles.imgClose}/>
            )}
          </div>
          <div>
            <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>Объеденить</button>
          </div>
          <div>
            <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>Копировать</button>
          </div>
          <div>
            <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>Согласовать</button>
          </div>
          <div>
            <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>Предложить</button>
          </div>
          <div>
            <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>Удалить</button>
          </div>
        </div>
        {showSubMenu && (
              <div className={styles.blockMenuRight}
              style={{
                position: 'fixed',
                top: menuPosition.y,
                left: menuPosition.x + 280,
              }}
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
              > 
                <div>
                  <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>На 2 потока</button>
                </div>
                <div>
                  <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>На 3 потока</button>
                </div>
                <div>
                  <button className={styles.activeStylePointer} onClick={props.handleMenuClick}>На 4 потока</button>
                </div>
              </div>
            )}
    </div>
  );
};

export default ContextMenu;