import React from "react";
import { Button } from "@material-ui/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import axios from "axios";

export const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = () => {
    let fileName = "Ticket_Data_Sheet";
    axios.get("http://localhost:7000/getExcelData/getAllData").then(res => {
      const ws = XLSX.utils.json_to_sheet(res.data.data);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={e => exportToCSV()}>
      Export
    </Button>
  );
};
