import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/Homepage";
import DataContext from "./context";

function App() {
  const [educator, setEducator] = useState([]); // преподаватели
  const [positions, setPositions] = useState([]); // должности
  const [typeOfEmployments, setTypeOfEmployments] = useState([]); // вид деятельности
  const [workload, setWorkload] = useState([]); // данные о нагрузках

  const appData = {
    educator,
    setEducator,
    positions,
    setPositions,
    typeOfEmployments,
    setTypeOfEmployments,
    workload,
    setWorkload,
  };

  return (
    <DataContext.Provider
      value={{
        appData,
      }}
    >
      <BrowserRouter>
        <div className="Container">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
