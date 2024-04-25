import React, { useEffect, useState } from "react";
import TableTd from "./TableTd";
import TableTh from "./TableTh";
import { headers } from "./Data";
import { Workload } from "../../api/services/ApiRequest";

function TableWorkload() {
  const tableHeaders = headers;
  const [workloadData, setWorkloadData] = useState([]);
  useEffect(() => {
    Workload().then((data) => {
      setWorkloadData([...data]);
      console.log(data);
    });
  }, []);
  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((item) => (
              <TableTh item={item} />
            ))}
          </tr>
        </thead>
        <tbody>
          {workloadData.map((item) => (
            <tr key={item.id}>
              {tableHeaders.map((itemKey) => {
                return <TableTd item={item} itemKey={itemKey} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableWorkload;
