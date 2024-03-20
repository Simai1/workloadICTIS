import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.scss";
import TableDisciplines from "../../components/TableDisciplines/TableDisciplines";
import TableTeachers from "../../components/TableTeachers/TableTeachers";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import Warnings from "../../components/Warnings/Warnings";
import TableLks from "../../components/TableLks/TableLks";
import { ApiGetData } from "../../api/services/ApiGetData";
import DataContext from "../../context";

function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState("Disciplines");
  const [educatorData, setEducatorData] = useState([]); // данные о преподавателе получаем в TableTeachers
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };
  const [name, setName] = useState("");
  const [post, setpost] = useState("");
  const [bet, setbet] = useState("");

  const handleButtonClick = () => {
    setName("");
  };

  const handleNameChange = (nameTeacher, postTeacher, betTeacher) => {
    setName(nameTeacher);
    setpost(postTeacher);
    setbet(betTeacher);
  };

  return (
    <Layout>
      <div className={styles.HomePage}>
        <div className={styles.button}>
          <div className={styles.button__inner}>
            <Button
              Bg={selectedComponent === "Disciplines" ? "#3B28CC" : "#efedf3"}
              textColot={
                selectedComponent === "Disciplines" ? "#efedf3" : "#000000"
              }
              onClick={() => {
                handleComponentChange("Disciplines");
                handleButtonClick();
              }}
              text="Дисциплины"
            />
            <Button
              Bg={selectedComponent === "Teachers" ? "#3B28CC" : "#efedf3"}
              textColot={
                selectedComponent === "Disciplines" ? "#000000" : "#efedf3"
              }
              onClick={() => {
                handleComponentChange("Teachers");
                handleButtonClick();
              }}
              text="Преподователи"
            />
          </div>
        </div>
        <div className={styles.Warnings}>
          <Warnings />
        </div>
        <div className={styles.Block__tables}>
          {selectedComponent === "Disciplines" &&
          (name === "" || name !== "") ? (
            <TableDisciplines />
          ) : selectedComponent === "Teachers" && name === "" ? (
            <TableTeachers
              setEducatorData={setEducatorData}
              onNameChange={handleNameChange}
            />
          ) : selectedComponent === "Teachers" && name !== "" ? (
            <TableLks
              educatorData={educatorData}
              delNameChange={handleNameChange}
              NameTeachers={{ name, post, bet }}
            />
          ) : null}
        </div>
        <a href="#">
          <div className={styles.rocket}>
            <img
              className={styles.rocket_img}
              src="./img/rocket.png"
              alt="up"
            />
          </div>
        </a>
      </div>
    </Layout>
  );
}

export default HomePage;
