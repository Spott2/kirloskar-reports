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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { MenuItem } from "@mui/material";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useRef } from "react";
import Chip from "@mui/material/Chip";
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

export default function Details() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [toDate, setToDate] = React.useState(dayjs());
  const [fromDate, setFromDate] = React.useState(dayjs());
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [lineId, setLineId] = React.useState([]);
  const tableRef = useRef(null);
  const [engineSr, setEngineSr] = React.useState("");
  const [datas, setDatas] = React.useState({
    loading: true,
    rows: [],
    total: 0,
    perPage: 100,
    currentPage: 0,
  });

  React.useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setData([]);
      setLoading(true);

      const response = await axios.post(
        "http://35.154.234.143:9090/report/report-2/v2",
        {
          fromDate: fromDate.add(5, "hour").add(30, "minute"),
          toDate: toDate.add(5, "hour").add(30, "minute"),
          lineId: lineId.length > 0 ? lineId : null,
          currentPage: datas.currentPage + 1,
          perPage: datas.perPage,
          engineSerialNumber: engineSr,
        }
      );
      setData(response.data.data);
      setDatas((prev) => ({ ...prev, total: response.data.total }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handelSearch = () => {
    fetchData();
  };
  const reset = async () => {
    try {
      setFromDate(dayjs());
      setToDate(dayjs());
      setLineId([]);
      setLoading(true);
      setEngineSr("");

      const response = await axios.post(
        "http://35.154.234.143:9090/report/report-2/v2",
        {
          fromDate: dayjs(),
          toDate: dayjs(),
          lineId: null,
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
  const handleLineTypeChange = (event) => {
    const { value } = event.target;
    setLineId(value);
  };
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Report2`,
    sheet: "Users",
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Report</h1>
      {loading && <Loader />}
      <div className="m-5">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <DateTimePicker
              label="From"
              size="small"
              value={fromDate}
              onChange={(newValue) => {
                setFromDate(newValue);
              }}
            />
            <DateTimePicker
              label="To"
              size="small"
              value={toDate}
              onChange={(newValue) => {
                setToDate(newValue);
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
            <Box sx={{ minWidth: 170, display: "flex", gap: "20px" }}>
              <FormControl fullWidth>
                <InputLabel id="Line">Lines</InputLabel>
                <Select
                  label="Line"
                  id="Line"
                  value={lineId}
                  onChange={handleLineTypeChange}
                  multiple
                  renderValue={(selected) => (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} style={{ margin: 2 }} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value="">All Lines</MenuItem>
                  <MenuItem value="1">R1040 Assembly</MenuItem>
                  <MenuItem value="2">DV Assembly</MenuItem>
                  <MenuItem value="3">R550 Assembly</MenuItem>
                  <MenuItem value="4">E Series Assembly</MenuItem>
                  <MenuItem value="5">R810 Assembly</MenuItem>
                  <MenuItem value="6">HA Assembly</MenuItem>
                  <MenuItem value="7">6R Assembly</MenuItem>
                  <MenuItem value="8">SL90 Assembly</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
