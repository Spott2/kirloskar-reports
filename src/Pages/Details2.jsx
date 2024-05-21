import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import dayjs from "dayjs";
import Loader from "../Components/Loader";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { MenuItem } from "@mui/material";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useRef } from "react";

import { useState } from "react";
const columns = [
  { id: "sr_no", minWidth: 80 },
  {
    id: "assemblyLine",
    minWidth: 110,
    format: (value) => value.name,
  },
  { id: "engineLoadingNumber" },
  { id: "engineUnloadingNumber" },
  {
    id: "loading_time",
    label: "Date",
    minWidth: 110,
    format: (value) => value.date,
  },
  {
    id: "loading_time",
    label: "Time",
    minWidth: 110,
    format: (value) => value.time,
  },
  {
    id: "unloading_time",
    label: "Date",
    minWidth: 110,
    format: (value) => value.date,
  },
  {
    id: "unloading_time",
    label: "Time",
    minWidth: 110,
    format: (value) => value.time,
  },
  {
    id: "painting_time",
    label: "Date",
    minWidth: 110,
    format: (value) => value.date,
  },
  {
    id: "painting_time",
    label: "Time",
    minWidth: 110,
    format: (value) => value.time,
  },
  { id: "fg", label: "Date", minWidth: 110 },
  { id: "fg", label: "Time", minWidth: 110 },
  {
    id: "throughOutTimeInMinutes",
    label: "Assembly",
    minWidth: 110,
    format: (value) => value.assembly,
  },
  {
    id: "throughOutTimeInMinutes",
    label: "Assembly To Painting",
    minWidth: 110,
    format: (value) => value.assemblyToPainting,
  },
  {
    id: "throughOutTimeInMinutes",
    label: "Painting To Fg",
    minWidth: 110,
    format: (value) => value.paintingToFG,
  },
  {
    id: "throughOutTimeInMinutes",
    label: "Total",
    minWidth: 110,
    format: (value) => value.total,
  },
  { id: "application_code" },
  { id: "engine_assembly_number" },
];

export default function Details2() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [toDate, setToDate] = React.useState(dayjs());
  const [fromDate, setFromDate] = React.useState(dayjs());
  const [lineId, setLineId] = React.useState(null);
  const tableRef = useRef(null);
  const [appCode, setAppCode] = React.useState("");
  const [engineSr, setEngineSr] = React.useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://35.154.234.143:9090/report/report-3/v2",
        {
          applicationCode: appCode,
          engineSerialNumber: engineSr,
          currentPage: currentPage + 1,
          perPage: perPage,
        }
      );
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handelSearch = () => {
    fetchData();
  };

  const reset = async () => {
    try {
      setAppCode("");
      setEngineSr("");
      setLoading(true);
      const response = await axios.post(
        "http://35.154.234.143:9090/report/report-3/v2",
        {
          applicationCode: "",
          engineSerialNumber: "",
        }
      );
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Report3`,
    sheet: "Users",
  });

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Report</h1>
      {loading && <Loader />}
      <div className="m-5">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <input
              type="text"
              placeholder="Application Code"
              value={appCode}
              onChange={(e) => {
                setAppCode(e.target.value);
              }}
              style={{
                border: "1px solid",
                borderRadius: "4px",
                padding: "8px",
                color: "black",
                width: "250px",
              }}
            />
            <input
              type="text"
              placeholder="Engine Serial Number"
              value={engineSr}
              onChange={(e) => {
                setEngineSr(e.target.value);
              }}
              style={{
                border: "1px solid",
                borderRadius: "4px",
                padding: "8px",
                color: "black",
                width: "250px",
              }}
            />
            <div className="flex items-center gap-5 mt-5 mb-5 justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white h-[55px] w-24 p-2 rounded  text-xs "
                onClick={handelSearch}
              >
                Search
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white h-[55px] w-24 p-2 rounded  text-xs "
                onClick={reset}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white h-[55px] w-24 p-2 rounded  text-xs "
                onClick={onDownload}
              >
                Download
              </button>
            </div>
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" ref={tableRef}>
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={1} id="sr_no">
                  Sr. No.
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  Line Name
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  Engine Loading Number
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  Engine Unloading Number
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Crankcase Loading
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Engine Unloading
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  Painting Loading
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  FG
                </TableCell>
                <TableCell align="center" colSpan={4}>
                  Throughput In Minutes
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  Application On Code
                </TableCell>
                <TableCell align="center" colSpan={1}>
                  Engine Serial Number
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.sr_no}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id} align="center">
                          {column.format
                            ? column.format(row[column.id])
                            : row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
